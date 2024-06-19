import { InstructorResponse } from './api-responses'
import { IUser, User } from './user'

export interface IInstructor extends IUser {
}

export class Instructor extends User implements IInstructor {
    constructor(
        id: number,
        onyen: string,
        name: string,
        email: string
    ) {
        super(id, onyen, name, email)
    }

    static fromResponse(data: InstructorResponse): IInstructor {
        return new Instructor(
            data.id,
            data.onyen,
            data.name,
            data.email
        )
    }
}