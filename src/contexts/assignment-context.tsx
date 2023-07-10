import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react'
import { IChangedArgs } from '@jupyterlab/coreutils'
import { IEduhelxSubmissionModel } from '../tokens'
import { IAssignment } from '../api'

interface IAssignmentContext {
    assignment: IAssignment | null | undefined
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
    const [currentAssignment, setCurrentAssignment] = useState<IAssignment|null|undefined>(undefined)
    const loading = useMemo(() => currentAssignment === undefined, [currentAssignment])

    useEffect(() => {
        setCurrentPath(model.currentPath)
        setCurrentAssignment(model.currentAssignment)
        const onCurrentPathChanged = (model: IEduhelxSubmissionModel, change: IChangedArgs<string|null>) => {
            setCurrentPath(change.newValue)
        }
        const onCurrentAssignmentChanged = (model: IEduhelxSubmissionModel, change: IChangedArgs<IAssignment|null|undefined>) => {
            setCurrentAssignment(change.newValue)
        }
        model.currentPathChanged.connect(onCurrentPathChanged)
        model.currentAssignmentChanged.connect(onCurrentAssignmentChanged)
        return () => {
            model.currentPathChanged.disconnect(onCurrentPathChanged)
            model.currentAssignmentChanged.disconnect(onCurrentAssignmentChanged)
        }
    }, [model])

    return (
        <AssignmentContext.Provider value={{
            assignment: currentAssignment,
            path: currentPath,
            loading
        }}>
            { children }
        </AssignmentContext.Provider>
    )
}
export const useAssignmentContext = () => useContext(AssignmentContext)