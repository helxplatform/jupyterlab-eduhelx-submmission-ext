import { StudentResponse } from './api-responses'

export interface IStudent {
    readonly id: number
    readonly studentOnyen: string
    readonly firstName: string
    readonly lastName: string
    readonly joinDate: Date
    readonly exitDate: Date | null
}

export class Student implements IStudent {
    constructor(
        private _id: number,
        private _studentOnyen: string,
        private _firstName: string,
        private _lastName: string,
        private _joinDate: Date,
        private _exitDate: Date | null
    ) {}
    get id() { return this._id }
    get studentOnyen() { return this._studentOnyen }
    get firstName() { return this._firstName }
    get lastName() { return this._lastName }
    get joinDate() { return this._joinDate }
    get exitDate() { return this._exitDate }

    static fromResponse(data: StudentResponse): IStudent {
        return new Student(
            data.id,
            data.student_onyen,
            data.first_name,
            data.last_name,
            new Date(data.join_date),
            data.exit_date ? new Date(data.exit_date) : null
        )
    }
}