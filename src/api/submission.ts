import { IStudent, Student } from './student'
import { SubmissionResponse } from './api-responses'

export interface ISubmission {
    readonly id: number
    readonly commitId: string
    readonly commitIdShort: string
    readonly active: boolean
    readonly submissionTime: Date
    readonly student: IStudent
}

export class Submission implements ISubmission {
    constructor(
        private _id: number,
        private _commitId: string,
        private _active: boolean,
        private _submissionTime: Date,
        private _student: IStudent
    ) {}
    get id() { return this._id }
    get commitId() { return this._commitId }
    get commitIdShort() { return this._commitId.slice(0, 7) }
    get active() { return this._active }
    get submissionTime() { return this._submissionTime }
    get student() { return this._student }

    static fromResponse(data: SubmissionResponse): ISubmission {
        return new Submission(
            data.id,
            data.commit_id,
            data.active,
            new Date(data.submission_time),
            Student.fromResponse(data.student)
        )
    }
}