import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect, useCallback } from 'react'
import { IChangedArgs } from '@jupyterlab/coreutils'
import { FileBrowserModel, IDefaultFileBrowser } from '@jupyterlab/filebrowser'
import { useSnackbar } from './snackbar-context'
import { IEduhelxSubmissionModel } from '../tokens'
import { IAssignment, IInstructor, ICurrentAssignment, ICourse, getAssignments, GetAssignmentsResponse, GetInstructorAndStudentsAndCourseResponse, IStudent, getInstructorAndStudentsAndCourse, listNotebookFiles } from '../api'

interface GradedNotebookExists {
    (assignment: IAssignment, directoryPath?: string | undefined): boolean
}

interface IAssignmentContext {
    assignments: IAssignment[] | null | undefined
    assignment: ICurrentAssignment | null | undefined
    instructor: IInstructor | undefined
    students: IStudent[] | undefined
    course: ICourse | undefined
    notebookFiles: { [assignmentId: string]: string[] } | undefined
    path: string | null
    loading: boolean
    gradedNotebookExists: GradedNotebookExists
    triggerImmediateUpdate: () => Promise<void>
}

interface IAssignmentProviderProps {
    fileBrowser: IDefaultFileBrowser
    children?: ReactNode
}

const POLL_DELAY = 15000
const POLL_RETRY_DELAY = 1000

export const AssignmentContext = createContext<IAssignmentContext|undefined>(undefined)

export const AssignmentProvider = ({ fileBrowser, children }: IAssignmentProviderProps) => {
    const snackbar = useSnackbar()!
    const [currentPath, setCurrentPath] = useState<string|null>(null)
    const [currentAssignment, setCurrentAssignment] = useState<ICurrentAssignment|null|undefined>(undefined)
    const [assignments, setAssignments] = useState<IAssignment[]|null|undefined>(undefined)
    const [instructor, setInstructor] = useState<IInstructor|undefined>(undefined)
    const [students, setStudents] = useState<IStudent[]|undefined>(undefined)
    const [course, setCourse] = useState<ICourse|undefined>(undefined)
    const [notebookFiles, setNotebookFiles] = useState<{ [key: string]: string[] }|undefined>(undefined)

    const loading = useMemo(() => (
        currentAssignment === undefined ||
        assignments === undefined ||
        instructor === undefined ||
        students === undefined ||
        course === undefined ||
        notebookFiles === undefined
    ), [currentAssignment, assignments, instructor, students, course, notebookFiles])

    const gradedNotebookExists = useCallback((assignment: IAssignment, gradedNotebookPath?: string | undefined) => {
        if (!notebookFiles) return false
        if (gradedNotebookPath === undefined) gradedNotebookPath = assignment.masterNotebookPath
        return notebookFiles[assignment.id].some((file) => file === gradedNotebookPath)
    }, [notebookFiles])

    const triggerImmediateUpdate = useCallback(async () => {
        if (!currentPath) return
        try {
            const [
                assignmentData,
                courseUserData,
                { notebooks }
            ] = await Promise.all([
                getAssignments(currentPath),
                getInstructorAndStudentsAndCourse(),
                listNotebookFiles()
            ])
            setAssignments(assignmentData.assignments)
            setCurrentAssignment(assignmentData.currentAssignment)
            setCourse(courseUserData.course)
            setInstructor(courseUserData.instructor)
            setStudents(courseUserData.students)
            setNotebookFiles(notebooks)
        } catch {}
    }, [currentPath])
    
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
        async function timeout() {
            if (currentPath !== null) {
                try {
                    const data = await getAssignments(currentPath)
                    if (!cancelled) {
                        setAssignments(data.assignments)
                        setCurrentAssignment(data.currentAssignment)
                        timeoutId = window.setTimeout(timeout, POLL_DELAY)
                    }
                } catch (e: any) {
                    // If the request fails, just maintain whatever state we already have
                    console.error(e)
                    snackbar.open({
                        type: 'warning',
                        message: 'Failed to pull assignments...'
                    })
                    if (!cancelled) timeoutId = window.setTimeout(timeout, POLL_RETRY_DELAY)
                }
            }
        }
        timeout()
        return () => {
            cancelled = true
            window.clearTimeout(timeoutId)
        }

    }, [currentPath])

    useEffect(() => {
        setCourse(undefined)
        setInstructor(undefined)
        setStudents(undefined)

        let cancelled = false
        let timeoutId: number | undefined = undefined
        async function timeout() {
            try {
                const data = await getInstructorAndStudentsAndCourse()
                if (!cancelled) {
                    setCourse(data.course)
                    setInstructor(data.instructor)
                    setStudents(data.students)
                    timeoutId = window.setTimeout(timeout, POLL_DELAY)
                }
            } catch (e: any) {
                // If the request fails, just maintain whatever state we already have
                console.error(e)
                snackbar.open({
                    type: 'warning',
                    message: 'Failed to pull course data...'
                })
                if (!cancelled) timeoutId = window.setTimeout(timeout, POLL_RETRY_DELAY)
            }
        }
        timeout()
        return () => {
            cancelled = true
            window.clearTimeout(timeoutId)
        }
    }, [])

    useEffect(() => {
        setNotebookFiles(undefined)

        let cancelled = false
        let timeoutId: number | undefined = undefined
        async function timeout() {
            try {
                const { notebooks } = await listNotebookFiles()
                if (!cancelled) {
                    setNotebookFiles(notebooks)
                    // We don't use POLL_DELAY for fetching notebook files, since this needs to be reflected more rapidly
                    // to the user and also doesn't involve any API calls, only scanning the directory for ipynb files.
                    timeoutId = window.setTimeout(timeout, 2500)
                }
            } catch (e: any) {
                // If the request fails, just maintain whatever state we already have
                console.error(e)
                snackbar.open({
                    type: 'warning',
                    message: 'Failed to pull notebook files for assignments...'
                })
                if (!cancelled) timeoutId = window.setTimeout(timeout, POLL_RETRY_DELAY)
            }
        }
        timeout()
        return () => {
            cancelled = true
            window.clearTimeout(timeoutId)
        }
    }, [])

    return (
        <AssignmentContext.Provider value={{
            assignment: currentAssignment,
            assignments,
            instructor,
            students,
            course,
            notebookFiles,
            path: currentPath,
            loading,
            gradedNotebookExists,
            triggerImmediateUpdate
        }}>
            { children }
        </AssignmentContext.Provider>
    )
}
export const useAssignment = () => useContext(AssignmentContext)