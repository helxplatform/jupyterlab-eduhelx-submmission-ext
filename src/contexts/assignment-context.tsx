import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react'
import { IChangedArgs } from '@jupyterlab/coreutils'
import { IEduhelxSubmissionModel } from '../tokens'
import { IAssignment, IStudent, ICurrentAssignment, ICourse } from '../api'

interface IAssignmentContext {
    assignments: IAssignment[] | null | undefined
    assignment: ICurrentAssignment | null | undefined
    student: IStudent | undefined
    course: ICourse | undefined
    path: string | null
    loading: boolean
}

interface IAssignmentProviderProps {
    model: IEduhelxSubmissionModel
    children?: ReactNode
}

export const AssignmentContext = createContext<IAssignmentContext|undefined>(undefined)

export const AssignmentProvider = ({ model, children }: IAssignmentProviderProps) => {
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
        setCurrentPath(model.currentPath)
        setCurrentAssignment(model.currentAssignment)
        setAssignments(model.assignments)
        setStudent(model.student)
        setCourse(model.course)
        const onCurrentPathChanged = (model: IEduhelxSubmissionModel, change: IChangedArgs<string|null>) => {
            setCurrentPath(change.newValue)
        }
        const onCurrentAssignmentChanged = (model: IEduhelxSubmissionModel, change: IChangedArgs<ICurrentAssignment|null|undefined>) => {
            setCurrentAssignment(change.newValue)
        }
        const onAssignmentsChanged = (model: IEduhelxSubmissionModel, change: IChangedArgs<IAssignment[]|null|undefined>) => {
            setAssignments(change.newValue)
        }
        const onStudentChanged = (model: IEduhelxSubmissionModel, change: IChangedArgs<IStudent|undefined>) => {
            setStudent(change.newValue)
        }
        const onCourseChanged = (model: IEduhelxSubmissionModel, change: IChangedArgs<ICourse|undefined>) => {
            setCourse(change.newValue)
        }
        model.currentPathChanged.connect(onCurrentPathChanged)
        model.currentAssignmentChanged.connect(onCurrentAssignmentChanged)
        model.assignmentsChanged.connect(onAssignmentsChanged)
        model.studentChanged.connect(onStudentChanged)
        model.courseChanged.connect(onCourseChanged)
        return () => {
            model.currentPathChanged.disconnect(onCurrentPathChanged)
            model.currentAssignmentChanged.disconnect(onCurrentAssignmentChanged)
            model.assignmentsChanged.disconnect(onAssignmentsChanged)
            model.studentChanged.disconnect(onStudentChanged)
            model.courseChanged.disconnect(onCourseChanged)
        }
    }, [model])

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