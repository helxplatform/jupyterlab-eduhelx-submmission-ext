import { ServerSettingsResponse } from './api-responses'

export interface IServerSettings {
    serverVersion: string
    repoRoot: string
    documentationUrl: string | null
}
export class ServerSettings implements IServerSettings {
    constructor(
        private _serverVersion: string,
        private _repoRoot: string,
        private _documentationUrl: string | null
    ) {}

    get serverVersion() { return this._serverVersion }
    get repoRoot() { return this._repoRoot }
    get documentationUrl() { return this._documentationUrl }
    
    static fromResponse(data: ServerSettingsResponse): IServerSettings {
        return new ServerSettings(
            data.serverVersion,
            data.repoRoot,
            data.documentationUrl
        )
    }
}