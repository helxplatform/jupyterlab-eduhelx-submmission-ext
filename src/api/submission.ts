import moment from 'moment'
import { IStudent, Student } from './student'
import { ICommit, Commit } from './commit'
import { SubmissionResponse } from './api-responses'

export interface ISubmission {
    readonly id: number
    readonly active: boolean
    readonly submissionTime: Date
    readonly commit: ICommit
}

export class Submission implements ISubmission {
    constructor(
        private _id: number,
        private _active: boolean,
        private _submissionTime: Date,
        private _commit: ICommit
    ) {}
    get id() { return this._id }
    get active() { return this._active }
    get submissionTime() { return this._submissionTime }
    get commit() { return this._commit }

    static fromResponse(data: SubmissionResponse): ISubmission {
        return new Submission(
            data.id,
            data.active,
            new Date(data.submission_time),
            Commit.fromResponse(data.commit)
        )
    }
}