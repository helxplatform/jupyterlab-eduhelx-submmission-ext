import { UserResponse } from './api-responses'

export interface IUser {
    id: number
    onyen: string
    firstName: string
    lastName: string
    fullName: string
    email: string
}

export class User implements IUser {
    constructor(
        private _id: number,
        private _onyen: string,
        private _firstName: string,
        private _lastName: string,
        private _email: string
    ) {}

    get id() { return this._id }
    get onyen() { return this._onyen }
    get firstName() { return this._firstName }
    get lastName() { return this._lastName }
    get fullName() { return `${ this.firstName } ${ this.lastName }` }
    get email() { return this._email }

    static fromResponse(data: UserResponse): IUser {
        return new User(
            data.id,
            data.onyen,
            data.first_name,
            data.last_name,
            data.onyen
        )
    }
}