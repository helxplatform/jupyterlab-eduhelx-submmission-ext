import { StudentResponse } from './api-responses'
import { IUser, User } from './user'

export interface IStudent extends IUser {
    readonly joinDate: Date
    readonly exitDate: Date | null
}

export class Student extends User implements IStudent {
    constructor(
        id: number,
        onyen: string,
        firstName: string,
        lastName: string,
        email: string,
        private _joinDate: Date,
        private _exitDate: Date | null
    ) {
        super(id, onyen, firstName, lastName, email)
    }
    get joinDate() { return this._joinDate }
    get exitDate() { return this._exitDate }

    static fromResponse(data: StudentResponse): IStudent {
        return new Student(
            data.id,
            data.onyen,
            data.first_name,
            data.last_name,
            data.email,
            new Date(data.join_date),
            data.exit_date ? new Date(data.exit_date) : null
        )
    }
}