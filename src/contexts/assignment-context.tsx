import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect, useCallback } from 'react'
import { IChangedArgs, URLExt } from '@jupyterlab/coreutils'
import { ServerConnection } from '@jupyterlab/services'
import { FileBrowserModel, IDefaultFileBrowser } from '@jupyterlab/filebrowser'
import { showDialog, Dialog } from '@jupyterlab/apputils'
import { Button } from '@jupyterlab/ui-components'
import { useSnackbar } from './snackbar-context'
import { IEduhelxSubmissionModel } from '../tokens'
import { IAssignment, IStudent, ICurrentAssignment, ICourse, getAssignmentsPolled, GetAssignmentsResponse, getStudentAndCoursePolled, getStudentAndCourse, getAssignments, listNotebookFiles } from '../api'

interface StudentNotebookExists {
    (assignment: IAssignment, directoryPath?: string | undefined): boolean
}

interface IAssignmentContext {
    assignments: IAssignment[] | null | undefined
    assignment: ICurrentAssignment | null | undefined
    student: IStudent | undefined
    course: ICourse | undefined
    path: string | null
    loading: boolean
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
const WEBSOCKET_REOPEN_DELAY = 1000
const POLL_DELAY = 15000

export const AssignmentContext = createContext<IAssignmentContext|undefined>(undefined)

export const AssignmentProvider = ({ fileBrowser, children }: IAssignmentProviderProps) => {
    const snackbar = useSnackbar()!

    const [currentPath, setCurrentPath] = useState<string|null>(null)
    const [currentAssignment, setCurrentAssignment] = useState<ICurrentAssignment|null|undefined>(undefined)
    const [assignments, setAssignments] = useState<IAssignment[]|null|undefined>(undefined)
    const [student, setStudent] = useState<IStudent|undefined>(undefined)
    const [course, setCourse] = useState<ICourse|undefined>(undefined)
    const [notebookFiles, setNotebookFiles] = useState<{ [key: string]: string[] }|undefined>(undefined)
    const [ws, setWs] = useState<WebSocket>(() => new WebSocket(WEBSOCKET_URL))

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

    useEffect(() => {
        const triggerReconnect = () => {
            ws.close()
            setWs(new WebSocket(WEBSOCKET_URL))
        }

        ws.addEventListener("message", (e) => {
            const { type, ...data } = JSON.parse(e.data)
            if (type === "downsync") showDialog({
                title: "New files have been added",
                body: (
                    <ul>
                        { data.files.map((f: string) => (
                            <li>{ f }</li>
                        )) }
                    </ul>
                ),
                buttons: [Dialog.okButton({ label: "Ok" })]
            })
        })
        ws.addEventListener("close", triggerReconnect)
        return () => {
            ws.close()
        }
    }, [ws])

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
        
        let cancelled = false
        let timeoutId: number | undefined = undefined
        const poll = async () => {
            let value
            if (currentPath !== null) {
                try {
                    value = await getAssignments(currentPath)
                } catch (e: any) {
                    console.error(e)
                    snackbar.open({
                        type: 'warning',
                        message: 'Failed to pull assignments...'
                    })
                }
            }
            if (cancelled) return
            if (value !== undefined) {
                setAssignments(value.assignments)
                setCurrentAssignment(value.currentAssignment)
            } else {
                setAssignments(undefined)
                setCurrentAssignment(undefined)
            }
            timeoutId = window.setTimeout(poll, POLL_DELAY)
        }
        poll()
        return () => {
            cancelled = true
            window.clearTimeout(timeoutId)
        }
    }, [currentPath])

    useEffect(() => {
        setCourse(undefined)
        setStudent(undefined)

        let cancelled = false
        let timeoutId: number | undefined = undefined
        const poll = async () => {
            let value
            try {
                value = await getStudentAndCourse()
            } catch (e: any) {
                console.error(e)
                snackbar.open({
                    type: 'warning',
                    message: 'Failed to pull course data...'
                })
            }
            if (cancelled) return
            if (value !== undefined) {
                setCourse(value.course)
                setStudent(value.student)
            } else {
                setCourse(undefined)
                setStudent(undefined)
            }
            timeoutId = window.setTimeout(poll, POLL_DELAY)
        }
        poll()
        return () => {
            cancelled = true
            window.clearTimeout(timeoutId)
        }
    }, [])

    useEffect(() => {
        setNotebookFiles(undefined)

        let cancelled = false
        let timeoutId: number | undefined = undefined
        const poll = async () => {
            let value
            try {
                value = await listNotebookFiles()
            } catch (e: any) {
                console.error(e)
                snackbar.open({
                    type: 'warning',
                    message: 'Failed to pull course data...'
                })
            }
            if (cancelled) return
            if (value !== undefined) {
                setNotebookFiles(value.notebooks)
            } else {
                setNotebookFiles(undefined)
            }
            // We don't use POLL_DELAY for fetching notebook files, since this needs to be reflected more rapidly
            // to the user and also doesn't involve any API calls, only scanning the directory for ipynb files.
            timeoutId = window.setTimeout(poll, 2500)
        }
        poll()
        return () => {
            cancelled = true
            window.clearTimeout(timeoutId)
        }
    }, [])

    return (
        <AssignmentContext.Provider value={{
            assignment: currentAssignment,
            assignments,
            student,
            course,
            path: currentPath,
            loading,
            studentNotebookExists
        }}>
            { children }
        </AssignmentContext.Provider>
    )
}
export const useAssignment = () => useContext(AssignmentContext)