import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react'
import { IChangedArgs } from '@jupyterlab/coreutils'
import { FileBrowserModel, IDefaultFileBrowser } from '@jupyterlab/filebrowser'
import { IEduhelxSubmissionModel } from '../tokens'
import { IAssignment, IInstructor, ICurrentAssignment, ICourse, getAssignments, GetAssignmentsResponse, GetInstructorAndStudentsAndCourseResponse, IStudent, getInstructorAndStudentsAndCourse } from '../api'

interface IAssignmentContext {
    assignments: IAssignment[] | null | undefined
    assignment: ICurrentAssignment | null | undefined
    instructor: IInstructor | undefined
    students: IStudent[] | undefined
    course: ICourse | undefined
    path: string | null
    loading: boolean
}

interface IAssignmentProviderProps {
    fileBrowser: IDefaultFileBrowser
    children?: ReactNode
}

export const AssignmentContext = createContext<IAssignmentContext|undefined>(undefined)

export const AssignmentProvider = ({ fileBrowser, children }: IAssignmentProviderProps) => {
    const [currentPath, setCurrentPath] = useState<string|null>(null)
    const [currentAssignment, setCurrentAssignment] = useState<ICurrentAssignment|null|undefined>(undefined)
    const [assignments, setAssignments] = useState<IAssignment[]|null|undefined>(undefined)
    const [instructor, setInstructor] = useState<IInstructor|undefined>(undefined)
    const [students, setStudents] = useState<IStudent[]|undefined>(undefined)
    const [course, setCourse] = useState<ICourse|undefined>(undefined)

    const loading = useMemo(() => (
        currentAssignment === undefined ||
        assignments === undefined ||
        instructor === undefined ||
        students === undefined ||
        course === undefined
    ), [currentAssignment, assignments, instructor, students, course])
    
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
        
        const delay = 5000
        const retryDelay = 1000
        let cancelled = false
        let timeoutId: number | undefined = undefined
        async function timeout() {
            if (currentPath !== null) {
                try {
                    const data = await getAssignments(currentPath)
                    if (!cancelled) {
                        setAssignments(data.assignments)
                        setCurrentAssignment(data.currentAssignment)
                        timeoutId = window.setTimeout(timeout, delay)
                    }
                } catch (e: any) {
                    // If the request fails, just maintain whatever state we already have
                    console.error(e)
                    if (!cancelled) timeoutId = window.setTimeout(timeout, retryDelay)
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

        const delay = 5000
        const retryDelay = 1000
        let cancelled = false
        let timeoutId: number | undefined = undefined
        async function timeout() {
            try {
                const data = await getInstructorAndStudentsAndCourse()
                if (!cancelled) {
                    setCourse(data.course)
                    setInstructor(data.instructor)
                    setStudents(data.students)
                    timeoutId = window.setTimeout(timeout, delay)
                }
            } catch (e: any) {
                // If the request fails, just maintain whatever state we already have
                console.error(e)
                if (!cancelled) timeoutId = window.setTimeout(timeout, retryDelay)
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
            path: currentPath,
            loading
        }}>
            { children }
        </AssignmentContext.Provider>
    )
}
export const useAssignment = () => useContext(AssignmentContext)