import { IChangedArgs } from '@jupyterlab/coreutils'
import { ISignal, Signal } from '@lumino/signaling'
import { Poll } from '@lumino/polling'
import { IEduhelxSubmissionModel } from './tokens'
import { getCurrentAssignment, IAssignment } from './api'

export class EduhelxSubmissionModel implements IEduhelxSubmissionModel {
    private _isDisposed: boolean = false
    private _currentPath: string | null = null
    private _currentAssignment: IAssignment | null | undefined = undefined

    private _assignmentPoll: Poll

    private _currentPathChanged = new Signal<
        IEduhelxSubmissionModel,
        IChangedArgs<string | null>
    >(this)
    private _currentAssignmentChanged = new Signal<
        IEduhelxSubmissionModel,
        IChangedArgs<IAssignment | null | undefined>
    >(this)

    constructor() {
        this._assignmentPoll = new Poll({
            factory: this._refreshModel.bind(this),
            frequency: {
                interval: 3000,
                backoff: true,
                max: 300 * 1000
            },
            standby: this._refreshStandby
        })
    }

    get isDisposed() {
        return this._isDisposed
    }

    // Undefined: loading, null: no current assignment
    get currentAssignment(): IAssignment | null | undefined {
        return this._currentAssignment
    }
    private set currentAssignment(v: IAssignment | null | undefined) {
        const change: IChangedArgs<IAssignment | null | undefined> = {
            name: 'currentAssignment',
            newValue: v,
            oldValue: this.currentAssignment
        }
        this._currentAssignment = v
        this._currentAssignmentChanged.emit(change)
    }
    get currentAssignmentChanged(): ISignal<IEduhelxSubmissionModel, IChangedArgs<IAssignment | null | undefined>> {
        return this._currentAssignmentChanged
    }
    
    get currentPath(): string | null {
        return this._currentPath
    }
    set currentPath(v: string | null) {
        const change: IChangedArgs<string | null> = {
            name: 'currentPath',
            newValue: v,
            oldValue: this.currentPath
        }
        this._currentPath = v
        this._currentPathChanged.emit(change)
        this.refreshAssignment()
    }
    get currentPathChanged(): ISignal<IEduhelxSubmissionModel, IChangedArgs<string | null>> {
        return this._currentPathChanged
    }

    private async _loadAssignment(): Promise<IAssignment | null | undefined> {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // If the currentPath is loading, the assignment is also loading.
        if (this.currentPath === null) {
            return undefined
        }
        try {
            return await getCurrentAssignment(this.currentPath)
        } catch (e: any) {
            // If the request encouners an error, default to loading.
            // Don't want to mislead and say an assignment directory isn't an assignment due to an error here.
            return undefined
        }
    }

    
    async refreshAssignment() {
        // Set assignment to loading.
        this.currentAssignment = undefined
        await this._assignmentPoll.refresh()
        await this._assignmentPoll.tick
    }

    private async _refreshModel(): Promise<void> {
        this.currentAssignment = await this._loadAssignment()
    }

    /**
     * Determine if polling should temporarily suspend.
     * 
     * Stand by, if:
     * - webpage hidden
     */
    private _refreshStandby(): boolean | Poll.Standby {
        // if (this.currentPath === null) return true
        return 'when-hidden'
    }

    dispose() {
        if (this.isDisposed) return
        this._isDisposed = true

        this._assignmentPoll.dispose()
        Signal.clearData(this)
    }
}