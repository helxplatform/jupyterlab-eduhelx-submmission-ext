import { ServerSettingsResponse } from './api-responses'

export interface IServerSettings {}
export class ServerSettings implements IServerSettings {
    constructor() {}
    
    static fromResponse(data: ServerSettingsResponse): IServerSettings {
        return new ServerSettings()
    }
}