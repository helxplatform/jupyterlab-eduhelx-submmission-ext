import { IStudent, Student } from './student'
import { ISubmission, Submission } from './submission'
import { AssignmentResponse, CurrentAssignmentResponse } from './api-responses'

export interface IAssignment {
    readonly id: number
    readonly name: string
    readonly gitRemoteUrl: string
    readonly revisionCount: number
    readonly createdDate: Date
    readonly releasedDate: Date | null
    readonly lastModifiedDate: Date
    readonly dueDate: Date
}

export interface ICurrentAssignment extends IAssignment {
    readonly submissions: ISubmission[] 
}

export class Assignment implements IAssignment {
    constructor(
        private _id: number,
        private _name: string,
        private _gitRemoteUrl: string,
        private _revisionCount: number,
        private _createdDate: Date,
        private _releasedDate: Date | null,
        private _lastModifiedDate: Date,
        private _dueDate: Date,
    ) {}
    
    get id() { return this._id }
    get name() { return this._name }
    get gitRemoteUrl() { return this._gitRemoteUrl }
    get revisionCount() { return this._revisionCount }
    get createdDate() { return this._createdDate }
    get releasedDate() { return this._releasedDate }
    get lastModifiedDate() { return this._lastModifiedDate }
    get dueDate() { return this._dueDate }
    

    static fromResponse(data: AssignmentResponse): IAssignment {
        return new Assignment(
            data.id,
            data.name,
            data.git_remote_url,
            data.revision_count,
            new Date(data.created_date),
            new Date(data.released_date),
            new Date(data.last_modified_date),
            new Date(data.due_date)
        )
    }
}

export class CurrentAssignment extends Assignment implements ICurrentAssignment {
    constructor(
        id: number,
        name: string,
        gitRemoteUrl: string,
        revisionCount: number,
        createdDate: Date,
        releasedDate: Date | null,
        lastModifiedDate: Date,
        dueDate: Date,
        private _submissions: ISubmission[]
    ) {
        super(
            id, name, gitRemoteUrl, revisionCount,
            createdDate, releasedDate, lastModifiedDate, dueDate
        )
    }

    get submissions() { return this._submissions }

    static fromResponse(data: CurrentAssignmentResponse): ICurrentAssignment {
        return new CurrentAssignment(
            data.id,
            data.name,
            data.git_remote_url,
            data.revision_count,
            new Date(data.created_date),
            new Date(data.released_date),
            new Date(data.last_modified_date),
            new Date(data.due_date),
            data.submissions.map((submission) => Submission.fromResponse(submission))
        )
    }
}