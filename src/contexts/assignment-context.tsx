import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { IChangedArgs, URLExt } from '@jupyterlab/coreutils'
import { ServerConnection } from '@jupyterlab/services'
import { FileBrowserModel, IDefaultFileBrowser } from '@jupyterlab/filebrowser'
import { showDialog, Dialog } from '@jupyterlab/apputils'
import { Button } from '@jupyterlab/ui-components'
import { useSnackbar } from './snackbar-context'
import { useWebsocket } from './websocket-context'
import { IEduhelxSubmissionModel } from '../tokens'
import {
    IAssignment, IStudent, ICurrentAssignment, ICourse,
    getStudentAndCourse, getAssignments, listNotebookFiles,
    WebsocketCrudMessage,
    WebsocketJobStatusMessage,
    WebsocketGitPullMessage,
    IIncomingWebsocketMessage
} from '../api'
import { IJobStatus, JobStatus } from '../api/job'
import { CrudResourceType } from '../api/ws-responses'

interface StudentNotebookExists {
    (assignment: IAssignment, directoryPath?: string | undefined): boolean
}

interface IAssignmentContext {
    path: string | null
    loading: boolean
    assignments: IAssignment[] | null | undefined
    assignment: ICurrentAssignment | null | undefined
    student: IStudent | undefined
    course: ICourse | undefined
    jobStatuses: IJobStatus[]
    updateAssignments: (requestOptions?: RequestInit) => Promise<void>
    updateCourseAndUserData: (requestOptions?: RequestInit) => Promise<void>
    updateNotebookFiles: (requestOptions?: RequestInit) => Promise<void>
    studentNotebookExists: StudentNotebookExists
}

interface IAssignmentProviderProps {
    fileBrowser: IDefaultFileBrowser
    children?: ReactNode
}

const _SC = ServerConnection.makeSettings()
const WEBSOCKET_URL = URLExt.join(
    _SC.baseUrl,
    "eduhelx-jupyterlab-student",
    "ws"
)

const POLL_DELAY = 30000
const POLL_RETRY_DELAY = 2500
const POLL_NOTEBOOK_FILES_DELAY = 2500

export const AssignmentContext = createContext<IAssignmentContext|undefined>(undefined)

export const AssignmentProvider = ({ fileBrowser, children }: IAssignmentProviderProps) => {
    const snackbar = useSnackbar()!
    const { lastWsMessage } = useWebsocket()!

    const [currentPath, setCurrentPath] = useState<string|null>(null)
    const [currentAssignment, setCurrentAssignment] = useState<ICurrentAssignment|null|undefined>(undefined)
    const [assignments, setAssignments] = useState<IAssignment[]|null|undefined>(undefined)
    const [student, setStudent] = useState<IStudent|undefined>(undefined)
    const [course, setCourse] = useState<ICourse|undefined>(undefined)
    const [notebookFiles, setNotebookFiles] = useState<{ [key: string]: string[] }|undefined>(undefined)
    const [ws, setWs] = useState<WebSocket>(() => new WebSocket(WEBSOCKET_URL))
    const [jobStatuses, setJobStatuses] = useState<IJobStatus[]>([])

    const assignmentsController = useRef<AbortController>()
    const courseUserController = useRef<AbortController>()
    const notebookFileController = useRef<AbortController>()

    const lastProcessedWsMessage = useRef<IIncomingWebsocketMessage<any>>()

    const loading = useMemo(() => (
        currentAssignment === undefined ||
        assignments === undefined ||
        student === undefined ||
        course === undefined ||
        notebookFiles === undefined
    ), [currentAssignment, assignments, student, course, notebookFiles])

    const studentNotebookExists = useCallback((assignment: IAssignment, studentNotebookPath?: string | undefined) => {
        if (!notebookFiles) return false
        if (studentNotebookPath === undefined) studentNotebookPath = assignment.studentNotebookPath
        return notebookFiles[assignment.id].some((file) => file === studentNotebookPath)
    }, [notebookFiles])

    // Pull course and current user data
    const updateCourseAndUserData = useCallback(async () => {
        courseUserController.current?.abort()
        courseUserController.current = new AbortController()
        const data = await getStudentAndCourse({ signal: courseUserController.current.signal })
        setCourse(data.course)
        setStudent(data.student)
    }, [])

    // Pull assignments and current assignment (of the cwd, when applicable)
    const updateAssignments = useCallback(async () => {
        if (currentPath === null) return
        assignmentsController.current?.abort()
        assignmentsController.current = new AbortController()
        const data = await getAssignments(currentPath, { signal: assignmentsController.current.signal })
        setAssignments(data.assignments)
        setCurrentAssignment(data.currentAssignment)
    }, [currentPath])

    // Pull all notebook files (currently, *.ipynb) in the repository.
    const updateNotebookFiles = useCallback(async () => {
        notebookFileController.current?.abort()
        notebookFileController.current = new AbortController()
        const { notebooks } = await listNotebookFiles({ signal: notebookFileController.current.signal })
        setNotebookFiles(notebooks)
    }, [])

    const poll = useCallback((
        pollFn: () => Promise<void>, 
        {
            pollDelay=POLL_DELAY,
            pollRetryDelay=POLL_RETRY_DELAY,
            onFailure=(e: any) => {}
        }
    ) => {
        let timeoutId: number
        const timeout = async () => {
            try {
                await pollFn()
                timeoutId = window.setTimeout(timeout, pollDelay)
            } catch (e: any) {
                // Stop polling if an abort error is encountered.
                if (e.name === "AbortError") return
                else {
                    await onFailure(e)
                    // Expedite the next poll if an unexpected error is encountered.
                    timeoutId = window.setTimeout(timeout, pollRetryDelay)
                }
            }
        }
        timeout()
        return function cancel() {
            window.clearTimeout(timeoutId)
        }
    }, [])

    useEffect(() => {
        setCurrentPath(fileBrowser.model.path)

        const onCurrentPathChanged = (model: FileBrowserModel, change: IChangedArgs<string|null>) => {
            setCurrentPath(change.newValue)
        }
        fileBrowser.model.pathChanged.connect(onCurrentPathChanged)
        return () => {
            fileBrowser.model.pathChanged.disconnect(onCurrentPathChanged)
        }
    }, [fileBrowser])

    useEffect(() => {
        setAssignments(undefined)
        setCurrentAssignment(undefined)

        // Current path being undefined is a precursor to loading.
        // We cannot begin to load assignment data until current path is loaded.
        if (!currentPath) return
        
        const cancelPoll = poll(updateAssignments, {
            onFailure: (e) => console.warn(`Encountered unexpected error while pulling assignment data for path ${ currentPath }`, e)
        })

        return () => {
            cancelPoll()
            assignmentsController.current?.abort()
        }
    }, [currentPath, updateAssignments, poll])

    useEffect(() => {
        setCourse(undefined)
        setStudent(undefined)

        const cancelPoll = poll(updateCourseAndUserData, {
            onFailure: (e) => console.warn(`Encountered unexpected error while pulling course/user data`, e)
        })

        return () => {
            cancelPoll()
            courseUserController.current?.abort()
        }
    }, [updateCourseAndUserData, poll])

    useEffect(() => {
        setNotebookFiles(undefined)

        const cancelPoll = poll(updateNotebookFiles, {
            pollDelay: POLL_NOTEBOOK_FILES_DELAY,
            onFailure: (e) => console.warn(`Encountered unexpected error while pulling notebook files`, e)
        })

        return () => {
            cancelPoll()
            notebookFileController.current?.abort()
        }
    }, [updateNotebookFiles, poll])

    /**
     * Handle incoming WS messages and update state accordingly.
     */
    useEffect(() => {
        if (!lastWsMessage || lastWsMessage === lastProcessedWsMessage.current) return

        lastProcessedWsMessage.current = lastWsMessage
        void async function() {
            if (lastWsMessage instanceof WebsocketCrudMessage) {
                switch (lastWsMessage.resourceType) {
                    case CrudResourceType.COURSE:
                    case CrudResourceType.USER:
                        await updateCourseAndUserData()
                        break;
                    case CrudResourceType.SUBMISSION:
                    case CrudResourceType.ASSIGNMENT:
                        await updateAssignments()
                        break;
                    default:
                        console.log("Unrecognized CRUD resource type", lastWsMessage.resourceType)
                        break;
                }
            } else if (lastWsMessage instanceof WebsocketJobStatusMessage) {
                const newJobStatus = JobStatus.fromResponse(lastWsMessage.payload)
                setJobStatuses((jobStatuses) => {
                    const newStatuses = jobStatuses.map((jobStatus) => {
                        if (jobStatus.id === lastWsMessage.jobId) return newJobStatus
                        else return jobStatus
                    })
                    if (!newStatuses.map((s) => s.id).includes(lastWsMessage.jobId)) newStatuses.push(newJobStatus)
                    return newStatuses
                })
            } else if (lastWsMessage instanceof WebsocketGitPullMessage) {
                showDialog({
                    title: "New files have been added",
                    body: (
                        <ul>
                            { lastWsMessage.files.map((f: string) => (
                                <li key={ f }>{ f }</li>
                            )) }
                        </ul>
                    ),
                    buttons: [Dialog.okButton({ label: "Ok" })]
                })
            }
        }()
    }, [lastWsMessage, updateAssignments, updateCourseAndUserData])

    return (
        <AssignmentContext.Provider value={{
            path: currentPath,
            loading,
            assignment: currentAssignment,
            assignments,
            student,
            course,
            jobStatuses,
            updateAssignments,
            updateCourseAndUserData,
            updateNotebookFiles,
            studentNotebookExists
        }}>
            { children }
        </AssignmentContext.Provider>
    )
}
export const useAssignment = () => useContext(AssignmentContext)