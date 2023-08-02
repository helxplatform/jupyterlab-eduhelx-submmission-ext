import { InstructorResponse } from './api-responses'

export interface IInstructor {
    id: number
    instructorOnyen: string
    firstName: string
    lastName: string
    fullName: string
}

export class Instructor implements IInstructor {
    constructor(
        private _id: number,
        private _instructorOnyen: string,
        private _firstName: string,
        private _lastName: string
    ) {}

    get id() { return this._id }
    get instructorOnyen() { return this._instructorOnyen }
    get firstName() { return this._firstName }
    get lastName() { return this._lastName }
    get fullName() { return `${ this.firstName } ${ this.lastName }` }

    static fromResponse(data: InstructorResponse): IInstructor {
        return new Instructor(
            data.id,
            data.instructor_onyen,
            data.first_name,
            data.last_name
        )
    }
}