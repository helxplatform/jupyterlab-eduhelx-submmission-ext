import qs from 'qs'
import { ServerConnection } from '@jupyterlab/services'
import { requestAPI } from './handler'

export interface IAssignment {
    name: string
}

export interface IServerSettings {}

export async function getCurrentAssignment(path: string): Promise<IAssignment | null> {
    return await requestAPI<IAssignment | null>(`/assignment?${ qs.stringify({ path }) }`, {
        method: 'GET'
    })
}

export async function getServerSettings(): Promise<IServerSettings> {
    try {
        return await requestAPI<IServerSettings>('/settings', {
            method: 'GET'
        })
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

export async function postSubmission(): Promise<any> {
    return await requestAPI<any>('/submission', {
        method: 'POST'
    })
}