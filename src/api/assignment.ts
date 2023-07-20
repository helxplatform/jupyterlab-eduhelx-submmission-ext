import { IStudent, Student } from './student'
import { ISubmission, Submission } from './submission'
import { AssignmentResponse } from './api-responses'

export interface IAssignment {
    readonly id: number
    readonly name: string
    readonly directoryPath: string
    // Added by serverextension so that we know what path to give the filebrowser
    // to open an assignment, even though we don't know where the repo root is.
    readonly absoluteDirectoryPath: string
    readonly createdDate: Date
    readonly releasedDate: Date
    readonly lastModifiedDate: Date
    readonly baseDueDate: Date
    readonly adjustedDueDate: Date
    readonly baseTimeSeconds: number
    readonly extraTimeSeconds: number
    // Indicates if a student has been alloted extra time.
    readonly isExtended: boolean
    // Simply if the releasedDate has passed or not, computed by the server. 
    readonly isReleased: boolean
    // Accounts for extra time.
    readonly isClosed: boolean
    readonly submissions?: ISubmission[]
}

// Submissions are definitely defined in an ICurrentAssignment
export interface ICurrentAssignment extends IAssignment {
    readonly submissions: ISubmission[] 
}

export class Assignment implements IAssignment {
    private _baseDueDate: Date
    private _adjustedDueDate: Date
    constructor(
        private _id: number,
        private _name: string,
        private _directoryPath: string,
        private _absoluteDirectoryPath: string,
        private _createdDate: Date,
        private _releasedDate: Date,
        private _lastModifiedDate: Date,
        private _baseTimeSeconds: number,
        private _extraTimeSeconds: number,
        private _isReleased: boolean,
        private _isClosed: boolean,
        private _submissions?: ISubmission[]
    ) {
        const baseTimeMs = this._baseTimeSeconds * 1000
        const extraTimeMs = this._extraTimeSeconds * 1000
        this._baseDueDate = new Date(this._releasedDate.getTime() + baseTimeMs)
        this._adjustedDueDate = new Date(this._baseDueDate.getTime() + extraTimeMs)
    }
    
    get id() { return this._id }
    get name() { return this._name }
    get directoryPath() { return this._directoryPath }
    get absoluteDirectoryPath() { return this._absoluteDirectoryPath }
    get createdDate() { return this._createdDate }
    get releasedDate() { return this._releasedDate }
    get lastModifiedDate() { return this._lastModifiedDate }
    get baseDueDate() { return this._baseDueDate }
    get adjustedDueDate() { return this._adjustedDueDate }
    get baseTimeSeconds() { return this._baseTimeSeconds }
    get extraTimeSeconds() { return this._extraTimeSeconds }
    get isExtended() {
        return this._extraTimeSeconds > 0
    }
    get isReleased() { return this._isReleased }
    get isClosed() { return this._isClosed }
    get submissions() { return this._submissions }
    

    static fromResponse(data: AssignmentResponse): IAssignment {
        return new Assignment(
            data.id,
            data.name,
            data.directory_path,
            data.absolute_directory_path,
            new Date(data.created_date),
            new Date(data.released_date),
            new Date(data.last_modified_date),
            data.base_time,
            data.extra_time,
            data.is_released,
            data.is_closed,
            data.submissions?.map((res) => Submission.fromResponse(res))
        )
    }
}