import { InstructorResponse } from './api-responses'
import { IUser, User } from './user'

export interface IInstructor extends IUser {
}

export class Instructor extends User implements IInstructor {
    constructor(
        id: number,
        onyen: string,
        firstName: string,
        lastName: string,
        email: string
    ) {
        super(id, onyen, firstName, lastName, email)
    }

    static fromResponse(data: InstructorResponse): IInstructor {
        return new Instructor(
            data.id,
            data.onyen,
            data.first_name,
            data.last_name,
            data.email
        )
    }
}