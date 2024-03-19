import { StagedChangeResponse } from './api-responses'

export interface IStagedChange {
    readonly pathFromRepositoryRoot: string
    readonly pathFromAssignmentRoot: string
    readonly modificationType: string
    readonly type: "file" | "directory"
}

export class StagedChange implements IStagedChange {
    constructor(
        private _pathFromRepositoryRoot: string,
        private _pathFromAssignmentRoot: string,
        private _modificationType: string,
        private _type: "file" | "directory"
    ) {}

    get pathFromRepositoryRoot() { return this._pathFromRepositoryRoot }
    get pathFromAssignmentRoot() { return this._pathFromAssignmentRoot }
    get modificationType() { return this._modificationType }
    get type() { return this._type }

    static fromResponse(data: StagedChangeResponse): IStagedChange {
        return new StagedChange(
            data.path_from_repo,
            data.path_from_assn,
            data.modification_type,
            data.type
        )
    }
}