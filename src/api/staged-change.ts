import { StagedChangeResponse } from './api-responses'

export interface IStagedChange {
    readonly path: string
    readonly modificationType: string
    readonly type: "file" | "directory"
}

export class StagedChange implements IStagedChange {
    constructor(
        private _path: string,
        private _modificationType: string,
        private _type: "file" | "directory"
    ) {}

    get path() { return this._path }
    get modificationType() { return this._modificationType }
    get type() { return this._type }

    static fromResponse(data: StagedChangeResponse): IStagedChange {
        return new StagedChange(
            data.path,
            data.modification_type,
            data.type
        )
    }
}