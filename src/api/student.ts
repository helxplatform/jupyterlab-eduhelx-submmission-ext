import { StudentResponse } from './api-responses'

export interface IStudent {
    readonly id: number
    readonly firstName: string
    readonly lastName: string
    readonly professorOnyen: string
}

export class Student implements IStudent {
    constructor(
        private _id: number,
        private _firstName: string,
        private _lastName: string,
        private _professorOnyen: string
    ) {}
    get id() { return this._id }
    get firstName() { return this._firstName }
    get lastName() { return this._lastName }
    get professorOnyen() { return this._professorOnyen }

    static fromResponse(data: StudentResponse): IStudent {
        return new Student(
            data.id,
            data.first_name,
            data.last_name,
            data.professor_onyen
        )
    }
}