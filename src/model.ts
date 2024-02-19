import { IChangedArgs } from '@jupyterlab/coreutils'
import { ISignal, Signal } from '@lumino/signaling'
import { Poll } from '@lumino/polling'
import { IEduhelxSubmissionModel } from './tokens'
import { getAssignments, IAssignment, IStudent, ICurrentAssignment, GetAssignmentsResponse, GetStudentAndCourseResponse, getStudentAndCourse, ICourse } from './api'

export class EduhelxSubmissionModel implements IEduhelxSubmissionModel {
    private _isDisposed: boolean = false
    private _currentPath: string | null = null
    private _currentAssignment: ICurrentAssignment | null | undefined = undefined
    private _assignments: IAssignment[] | null | undefined = undefined
    private _student: IStudent | undefined = undefined
    private _course: ICourse | undefined = undefined

    private _assignmentPoll: Poll

    private _currentPathChanged = new Signal<
        IEduhelxSubmissionModel,
        IChangedArgs<string | null>
    >(this)
    private _currentAssignmentChanged = new Signal<
        IEduhelxSubmissionModel,
        IChangedArgs<ICurrentAssignment | null | undefined>
    >(this)
    private _assignmentsChanged = new Signal<
        IEduhelxSubmissionModel,
        IChangedArgs<IAssignment[] | null | undefined>
    >(this)
    private _studentChanged = new Signal<
        IEduhelxSubmissionModel,
        IChangedArgs<IStudent | undefined>
    >(this)
    private _courseChanged = new Signal<
        IEduhelxSubmissionModel,
        IChangedArgs<ICourse | undefined>
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

    get assignments(): IAssignment[] | null | undefined {
        return this._assignments
    }
    private set assignments(v: IAssignment[] | null | undefined) {
        const change: IChangedArgs<IAssignment[] | null | undefined> = {
            name: 'assignments',
            newValue: v,
            oldValue: this.assignments
        }
        this._assignments = v
        this._assignmentsChanged.emit(change)
    }
    get assignmentsChanged(): ISignal<IEduhelxSubmissionModel, IChangedArgs<IAssignment[] | null | undefined>> {
        return this._assignmentsChanged
    }

    get student(): IStudent | undefined {
        return this._student
    }
    private set student(v: IStudent | undefined) {
        const change: IChangedArgs<IStudent | undefined> = {
            name: 'student',
            newValue: v,
            oldValue: this.student
        }
        this._student = v
        this._studentChanged.emit(change)
    }
    get studentChanged(): ISignal<IEduhelxSubmissionModel, IChangedArgs<IStudent | undefined>> {
        return this._studentChanged
    }

    get course(): ICourse | undefined {
        return this._course
    }
    private set course(v: ICourse | undefined) {
        const change: IChangedArgs<ICourse | undefined> = {
            name: 'course',
            newValue: v,
            oldValue: this.course
        }
        this._course = v
        this._courseChanged.emit(change)
    }
    get courseChanged(): ISignal<IEduhelxSubmissionModel, IChangedArgs<ICourse | undefined>> {
        return this._courseChanged
    }

    // Undefined: loading, null: no current assignment
    get currentAssignment(): ICurrentAssignment | null | undefined {
        return this._currentAssignment
    }
    private set currentAssignment(v: ICurrentAssignment | null | undefined) {
        const change: IChangedArgs<ICurrentAssignment | null | undefined> = {
            name: 'currentAssignment',
            newValue: v,
            oldValue: this.currentAssignment
        }
        this._currentAssignment = v
        this._currentAssignmentChanged.emit(change)
    }
    get currentAssignmentChanged(): ISignal<IEduhelxSubmissionModel, IChangedArgs<ICurrentAssignment | null | undefined>> {
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

    private async _loadAssignments(): Promise<GetAssignmentsResponse | undefined> {
        // If the currentPath is loading, the assignment is also loading.
        if (this.currentPath === null) {
            return undefined
        }
        try {
            return await getAssignments(this.currentPath)
        } catch (e: any) {
            console.error(e)
            // If the request encouners an error, default to loading.
            // Don't want to mislead and say an assignment directory isn't an assignment due to an error here.
            return undefined
        }
    }

    private async _loadStudentAndCourse(): Promise<GetStudentAndCourseResponse | undefined> {
        try {
            return await getStudentAndCourse()
        } catch (e: any) {
            console.error(e)
            // If the request encouners an error, default to loading.
            return undefined
        }
    }

    async refreshAssignment() {
        // Set assignment to loading.
        this.currentAssignment = undefined
        this.assignments = undefined
        this.student = undefined
        // await this._assignmentPoll.refresh()
        this._refreshModel()
        await this._assignmentPoll.tick
    }

    private async _refreshModel(): Promise<void> {
        const [
            assignmentsResponse,
            studentAndCourseResponse
        ] = await Promise.all([
            this._loadAssignments(),
            this._loadStudentAndCourse()
        ])
        if (assignmentsResponse === undefined) {
            this.assignments = undefined
            this.currentAssignment = undefined
        } else {
            this.assignments = assignmentsResponse.assignments
            this.currentAssignment = assignmentsResponse.currentAssignment
        }
        if (studentAndCourseResponse === undefined) {
            this.student = undefined
            this.course = undefined
        } else {
            this.student = studentAndCourseResponse.student
            this.course = studentAndCourseResponse.course
        }
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