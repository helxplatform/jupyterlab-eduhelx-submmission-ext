import { IChangedArgs } from '@jupyterlab/coreutils'
import { Token } from '@lumino/coreutils'
import { IDisposable } from '@lumino/disposable'
import { ISignal } from '@lumino/signaling'
import { IAssignment, IInstructor, ICurrentAssignment, ICourse } from './api'

export const IEduhelxSubmissionModel = new Token<IEduhelxSubmissionModel>("jupyter.extensions.eduhelx_jupyterlab_prof")

export interface IEduhelxSubmissionModel extends IDisposable {
    currentPath: string | null
    readonly currentPathChanged: ISignal<IEduhelxSubmissionModel, IChangedArgs<string | null>>

    readonly currentAssignment: ICurrentAssignment | null | undefined
    readonly currentAssignmentChanged: ISignal<IEduhelxSubmissionModel, IChangedArgs<ICurrentAssignment | null | undefined>>
    
    readonly assignments: IAssignment[] | null | undefined
    readonly assignmentsChanged: ISignal<IEduhelxSubmissionModel, IChangedArgs<IAssignment[] | null | undefined>>
    
    readonly instructor: IInstructor | undefined
    readonly instructorChanged: ISignal<IEduhelxSubmissionModel, IChangedArgs<IInstructor | undefined>>

    readonly course: ICourse | undefined
    readonly courseChanged: ISignal<IEduhelxSubmissionModel, IChangedArgs<ICourse | undefined>>
}