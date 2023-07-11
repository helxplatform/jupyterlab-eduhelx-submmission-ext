import { IStudent, Student } from './student'
import { ISubmission, Submission } from './submission'
import { AssignmentResponse } from './api-responses'

export interface IAssignment {
    readonly id: number
    readonly name: string
    readonly dueDate: Date
    readonly student: IStudent
    readonly submissions: ISubmission[] 
}

export class Assignment implements IAssignment {
    constructor(
        private _id: number,
        private _name: string,
        private _dueDate: Date,
        private _student: IStudent,
        private _submissions: ISubmission[]
    ) {}
    get id() { return this._id }
    get name() { return this._name }
    get dueDate() { return this._dueDate }
    get student() { return this._student }
    get submissions() { return this._submissions }

    static fromResponse(data: AssignmentResponse): IAssignment {
        return new Assignment(
            data.id,
            data.name,
            new Date(data.due_date),
            Student.fromResponse(data.student),
            data.submissions.map((submission) => Submission.fromResponse(submission))
        )
    }
}