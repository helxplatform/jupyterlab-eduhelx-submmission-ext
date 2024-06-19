import { UserResponse } from './api-responses'

export interface IUser {
    id: number
    onyen: string
    name: string
    email: string
}

export class User implements IUser {
    constructor(
        private _id: number,
        private _onyen: string,
        private _name: string,
        private _email: string
    ) {}

    get id() { return this._id }
    get onyen() { return this._onyen }
    get name() { return this._name }
    get email() { return this._email }

    static fromResponse(data: UserResponse): IUser {
        return new User(
            data.id,
            data.onyen,
            data.name,
            data.onyen
        )
    }
}