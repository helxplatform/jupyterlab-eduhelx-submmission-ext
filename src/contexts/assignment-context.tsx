import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react'
import { IChangedArgs } from '@jupyterlab/coreutils'
import { FileBrowserModel, IDefaultFileBrowser } from '@jupyterlab/filebrowser'
import { IEduhelxSubmissionModel } from '../tokens'
import { IAssignment, IStudent, ICurrentAssignment, ICourse, getAssignmentsPolled, GetAssignmentsResponse, getStudentAndCoursePolled } from '../api'

interface IAssignmentContext {
    assignments: IAssignment[] | null | undefined
    assignment: ICurrentAssignment | null | undefined
    student: IStudent | undefined
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
    const [student, setStudent] = useState<IStudent|undefined>(undefined)
    const [course, setCourse] = useState<ICourse|undefined>(undefined)

    const loading = useMemo(() => (
        currentAssignment === undefined ||
        assignments === undefined ||
        student === undefined ||
        course === undefined
    ), [currentAssignment, assignments, student, course])

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
        void async function poll(currentValue?: object) {
            let newValue = undefined
            if (currentPath !== null) {
                try {
                    newValue = await getAssignmentsPolled(currentPath, currentValue)
                } catch (e: any) {
                    console.error(e)
                }
            }
            if (cancelled) return
            if (newValue !== undefined) {
                setAssignments(newValue.assignments)
                setCurrentAssignment(newValue.currentAssignment)
            } else {
                setAssignments(undefined)
                setCurrentAssignment(undefined)
            }
            poll(newValue)
        }()
        return () => {
            cancelled = true
        }
    }, [currentPath])

    useEffect(() => {
        setCourse(undefined)
        setStudent(undefined)

        let cancelled = false
        void async function poll(currentValue?: object) {
            let newValue = undefined
            try {
                newValue = await getStudentAndCoursePolled(currentValue)
            } catch (e: any) {
                console.error(e)
            }
            if (cancelled) return
            if (newValue !== undefined) {
                setCourse(newValue.course)
                setStudent(newValue.student)
            } else {
                setCourse(undefined)
                setStudent(undefined)
            }
            poll(newValue)
        }()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <AssignmentContext.Provider value={{
            assignment: currentAssignment,
            assignments,
            student,
            course,
            path: currentPath,
            loading
        }}>
            { children }
        </AssignmentContext.Provider>
    )
}
export const useAssignment = () => useContext(AssignmentContext)