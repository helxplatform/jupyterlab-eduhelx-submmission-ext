import { CourseResponse } from './api-responses'
import { IInstructor, Instructor } from './instructor'

export interface ICourse {
    id: number
    name: string
    masterRemoteUrl: string
    instructors: IInstructor[]
}

export class Course implements ICourse {
    constructor(
        private _id: number,
        private _name: string,
        private _masterRemoteUrl: string,
        private _instructors: IInstructor[]
    ) {}

    get id() { return this._id }
    get name() { return this._name }
    get masterRemoteUrl() { return this._masterRemoteUrl }
    get instructors() { return this._instructors }

    static fromResponse(data: CourseResponse): ICourse {
        return new Course(
            data.id,
            data.name,
            data.master_remote_url,
            data.instructors.map((res) => Instructor.fromResponse(res))
        )
    }
}