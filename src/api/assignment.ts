import { IStudent, Student } from './student'
import { ISubmission, Submission } from './submission'
import { AssignmentResponse, AssignmentStatus } from './api-responses'
import { IStagedChange, StagedChange } from './staged-change'

export interface IAssignment {
    readonly id: number
    readonly name: string
    readonly directoryPath: string
    // Added by serverextension so that we know what path to give the filebrowser
    // to open an assignment, even though we don't know where the repo root is.
    readonly absoluteDirectoryPath: string
    readonly masterNotebookPath: string
    readonly studentNotebookPath: string
    readonly protectedFiles: string[]
    readonly overwritableFiles: string[]
    readonly maxAttempts: number | null
    readonly currentAttempts: number
    readonly graderQuestionFeedback: boolean
    readonly createdDate: Date
    readonly adjustedAvailableDate: Date | null
    readonly adjustedDueDate: Date | null
    readonly lastModifiedDate: Date
    
    readonly isPublished: boolean
    readonly status: AssignmentStatus

    // Indicates that release date has been deferred to a later date for the student
    readonly isDeferred: boolean
    // Indicates that due date is extended to a later date for the student
    readonly isExtended: boolean
    // Indicates if an assignment is available to work on (e.g. date is greater than adjusted_available_date)
    readonly isAvailable: boolean
    // Indicates if an assignment is no longer available to work on (e.g. date is greater than adjusted_due_date)
    readonly isClosed: boolean
    readonly submissions?: ISubmission[]
    // `null` if there are no submissions
    readonly activeSubmission?: ISubmission | null
    readonly stagedChanges?: IStagedChange[]
}

// Submissions and staged changes are definitely defined in an ICurrentAssignment
export interface ICurrentAssignment extends IAssignment {
    readonly submissions: ISubmission[]
    // `null` if there are no submissions
    readonly activeSubmission: ISubmission | null
    readonly stagedChanges: IStagedChange[]
}

export class Assignment implements IAssignment {
    constructor(
        private _id: number,
        private _name: string,
        private _directoryPath: string,
        private _absoluteDirectoryPath: string,
        private _masterNotebookPath: string,
        private _studentNotebookPath: string,
        private _protectedFiles: string[],
        private _overwritableFiles: string[],
        private _maxAttempts: number | null,
        private _currentAttempts: number,
        private _graderQuestionFeedback: boolean,
        private _createdDate: Date,
        private _adjustedAvailableDate: Date | null,
        private _adjustedDueDate: Date | null,
        private _lastModifiedDate: Date,
        
        private _isPublished: boolean,
        private _status: AssignmentStatus,

        private _isDeferred: boolean,
        private _isExtended: boolean,
        private _isAvailable: boolean,
        private _isClosed: boolean,
        private _submissions?: ISubmission[],
        private _stagedChanges?: IStagedChange[]
    ) {}
    
    get id() { return this._id }
    get name() { return this._name }
    get directoryPath() { return this._directoryPath }
    get absoluteDirectoryPath() { return this._absoluteDirectoryPath }
    get masterNotebookPath() { return this._masterNotebookPath }
    get studentNotebookPath() { return this._studentNotebookPath }
    get protectedFiles() { return this._protectedFiles }
    get overwritableFiles() { return this._overwritableFiles }
    get maxAttempts() { return this._maxAttempts }
    get currentAttempts() { return this._currentAttempts }
    get graderQuestionFeedback() { return this._graderQuestionFeedback }
    get createdDate() { return this._createdDate }
    get adjustedAvailableDate() { return this._adjustedAvailableDate }
    get adjustedDueDate() { return this._adjustedDueDate }
    get lastModifiedDate() { return this._lastModifiedDate }

    get isPublished() { return this._isPublished }
    get status() { return this._status }

    get isDeferred() { return this._isDeferred }
    get isExtended() { return this._isExtended }
    get isAvailable() { return this._isAvailable }
    get isClosed() { return this._isClosed }

    get submissions() { return this._submissions }
    get activeSubmission() {
        if (this._submissions === undefined) return undefined
        if (this._submissions.length === 0) return null
        return this._submissions.sort((a, b) => b.submissionTime.getTime() - a.submissionTime.getTime())[0]
    }

    get stagedChanges() { return this._stagedChanges }
    

    static fromResponse(data: AssignmentResponse): IAssignment {
        return new Assignment(
            data.id,
            data.name,
            data.directory_path,
            data.absolute_directory_path,
            data.master_notebook_path,
            data.student_notebook_path,
            data.protected_files,
            data.overwritable_files,
            data.max_attempts,
            data.current_attempts,
            data.grader_question_feedback,
            new Date(data.created_date),
            data.adjusted_available_date ? new Date(data.adjusted_available_date) : null,
            data.adjusted_due_date ? new Date(data.adjusted_due_date) : null,
            new Date(data.last_modified_date),

            data.is_published,
            data.status,

            data.is_deferred,
            data.is_extended,
            data.is_available,
            data.is_closed,
            data.submissions?.map((res) => Submission.fromResponse(res)),
            data.staged_changes?.map((res) => StagedChange.fromResponse(res))
        )
    }
}