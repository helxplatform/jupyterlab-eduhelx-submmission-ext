export interface ICourse {

}

export class Course implements ICourse {
    constructor() {}

    static fromResponse(): ICourse {
        return new Course()
    }
}