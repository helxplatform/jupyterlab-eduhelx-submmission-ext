import { ServerSettingsResponse } from './api-responses'

export interface IServerSettings {
    serverVersion: string
    repoRoot: string
}
export class ServerSettings implements IServerSettings {
    constructor(
        private _serverVersion: string,
        private _repoRoot: string
    ) {}

    get serverVersion() { return this._serverVersion }
    get repoRoot() { return this._repoRoot }
    
    static fromResponse(data: ServerSettingsResponse): IServerSettings {
        return new ServerSettings(
            data.serverVersion,
            data.repoRoot
        )
    }
}