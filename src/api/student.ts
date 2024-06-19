import { StudentResponse } from './api-responses'
import { IUser, User } from './user'

export interface IStudent extends IUser {
    readonly joinDate: Date
    readonly exitDate: Date | null
    readonly forkRemoteUrl: string
    readonly forkCloned: boolean
}

export class Student extends User implements IStudent {
    constructor(
        id: number,
        onyen: string,
        name: string,
        email: string,
        private _joinDate: Date,
        private _exitDate: Date | null,
        private _forkRemoteUrl: string,
        private _forkCloned: boolean
    ) {
        super(id, onyen, name, email)
    }
    get joinDate() { return this._joinDate }
    get exitDate() { return this._exitDate }
    get forkRemoteUrl() { return this._forkRemoteUrl }
    get forkCloned() { return this._forkCloned }

    static fromResponse(data: StudentResponse): IStudent {
        return new Student(
            data.id,
            data.onyen,
            data.name,
            data.email,
            new Date(data.join_date),
            data.exit_date ? new Date(data.exit_date) : null,
            data.fork_remote_url,
            data.fork_cloned
        )
    }
}