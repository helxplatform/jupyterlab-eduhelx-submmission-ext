import qs from 'qs'
import { ServerConnection } from '@jupyterlab/services'
import { requestAPI } from '../handler'
import { IAssignment, Assignment } from './assignment'
import { IServerSettings, ServerSettings } from './server-settings'
import { AssignmentResponse, ServerSettingsResponse } from './api-responses'

export async function getCurrentAssignment(path: string): Promise<IAssignment|null> {
    const data = await requestAPI<AssignmentResponse|null>(`/assignment?${ qs.stringify({ path }) }`, {
        method: 'GET'
    })
    if (data === null) return null
    return Assignment.fromResponse(data)
}

export async function getServerSettings(): Promise<IServerSettings> {
    try {
        const data = await requestAPI<ServerSettingsResponse>('/settings', {
            method: 'GET'
        })
        return ServerSettings.fromResponse(data)
    } catch (e) {
        if (e instanceof ServerConnection.ResponseError) {
            const response = e.response;
            if (response.status === 404) {
                const message =
                    'EduHeLx Submission server extension is unavailable. Please ensure you have installed the ' +
                    'JupyterLab EduHeLx Submission server extension by running: pip install --upgrade jupyterlab_eduhelx_submission. ' +
                    'To confirm that the server extension is installed, run: jupyter server extension list.'
                throw new ServerConnection.ResponseError(response, message);
            } else {
                const message = e.message;
                console.error('Failed to get the server extension settings', message);
                throw new ServerConnection.ResponseError(response, message);
            }
        } else {
            throw e;
        }
    }
}