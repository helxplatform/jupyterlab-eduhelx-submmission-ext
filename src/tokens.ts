import { IChangedArgs } from '@jupyterlab/coreutils'
import { Token } from '@lumino/coreutils'
import { IDisposable } from '@lumino/disposable'
import { ISignal } from '@lumino/signaling'
import { IAssignment, IStudent, ICurrentAssignment } from './api'

export const IEduhelxSubmissionModel = new Token<IEduhelxSubmissionModel>("jupyter.extensions.eduhelx_submission_plugin")

export interface IEduhelxSubmissionModel extends IDisposable {
    currentPath: string | null
    readonly currentPathChanged: ISignal<IEduhelxSubmissionModel, IChangedArgs<string | null>>

    readonly currentAssignment: ICurrentAssignment | null | undefined
    readonly currentAssignmentChanged: ISignal<IEduhelxSubmissionModel, IChangedArgs<ICurrentAssignment | null | undefined>>
    
    readonly assignments: IAssignment[] | undefined
    readonly assignmentsChanged: ISignal<IEduhelxSubmissionModel, IChangedArgs<IAssignment[] | undefined>>
    
    readonly student: IStudent | undefined
    readonly studentChanged: ISignal<IEduhelxSubmissionModel, IChangedArgs<IStudent | undefined>>
}