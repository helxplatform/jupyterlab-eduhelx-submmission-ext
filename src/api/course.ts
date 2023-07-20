import { CourseResponse } from './api-responses'

export interface ICourse {
    id: number
    name: string
    masterRemoteUrl: string
}

export class Course implements ICourse {
    constructor(
        private _id: number,
        private _name: string,
        private _masterRemoteUrl: string
    ) {}

    get id() { return this._id }
    get name() { return this._name }
    get masterRemoteUrl() { return this._masterRemoteUrl }

    static fromResponse(data: CourseResponse): ICourse {
        return new Course(
            data.id,
            data.name,
            data.master_remote_url
        )
    }
}