import { IChangedArgs } from '@jupyterlab/coreutils'
import { Token } from '@lumino/coreutils'
import { IDisposable } from '@lumino/disposable'
import { ISignal } from '@lumino/signaling'
import { IAssignment } from './api'

export const IEduhelxSubmissionModel = new Token<IEduhelxSubmissionModel>("jupyter.extensions.eduhelx_submission_plugin")

export interface IEduhelxSubmissionModel extends IDisposable {
    currentPath: string | null
    readonly currentPathChanged: ISignal<IEduhelxSubmissionModel, IChangedArgs<string | null>>

    readonly currentAssignment: IAssignment | null | undefined
    readonly currentAssignmentChanged: ISignal<IEduhelxSubmissionModel, IChangedArgs<IAssignment | null | undefined>>
}