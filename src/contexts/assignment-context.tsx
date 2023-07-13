import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react'
import { IChangedArgs } from '@jupyterlab/coreutils'
import { IEduhelxSubmissionModel } from '../tokens'
import { IAssignment, IStudent, ICurrentAssignment } from '../api'

interface IAssignmentContext {
    assignments: IAssignment[] | undefined
    student: IStudent | undefined
    assignment: ICurrentAssignment | null | undefined
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
    const [student, setStudent] = useState<IStudent|undefined>(undefined)
    const [assignments, setAssignments] = useState<IAssignment[]|undefined>(undefined)
    const loading = useMemo(() => (
        currentAssignment === undefined ||
        student === undefined ||
        assignments === undefined
    ), [currentAssignment, student, assignments])

    useEffect(() => {
        setCurrentPath(model.currentPath)
        setCurrentAssignment(model.currentAssignment)
        setStudent(model.student)
        setAssignments(model.assignments)
        const onCurrentPathChanged = (model: IEduhelxSubmissionModel, change: IChangedArgs<string|null>) => {
            setCurrentPath(change.newValue)
        }
        const onCurrentAssignmentChanged = (model: IEduhelxSubmissionModel, change: IChangedArgs<ICurrentAssignment|null|undefined>) => {
            setCurrentAssignment(change.newValue)
        }
        const onStudentChanged = (model: IEduhelxSubmissionModel, change: IChangedArgs<IStudent|undefined>) => {
            setStudent(change.newValue)
        }
        const onAssignmentsChanged = (model: IEduhelxSubmissionModel, change: IChangedArgs<IAssignment[]|undefined>) => {
            setAssignments(change.newValue)
        }
        model.currentPathChanged.connect(onCurrentPathChanged)
        model.currentAssignmentChanged.connect(onCurrentAssignmentChanged)
        model.studentChanged.connect(onStudentChanged)
        model.assignmentsChanged.connect(onAssignmentsChanged)
        return () => {
            model.currentPathChanged.disconnect(onCurrentPathChanged)
            model.currentAssignmentChanged.disconnect(onCurrentAssignmentChanged)
            model.studentChanged.disconnect(onStudentChanged)
            model.assignmentsChanged.disconnect(onAssignmentsChanged)
        }
    }, [model])

    return (
        <AssignmentContext.Provider value={{
            assignment: currentAssignment,
            student,
            assignments,
            path: currentPath,
            loading
        }}>
            { children }
        </AssignmentContext.Provider>
    )
}
export const useAssignment = () => useContext(AssignmentContext)