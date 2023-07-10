import React from 'react'
import { ReactWidget } from '@jupyterlab/apputils'
import { StylesProvider } from '@material-ui/core/styles'
import { AssignmentPanel } from '../components'
import { IServerSettings } from '../api'
import { AssignmentProvider, SettingsProvider } from '../contexts'
import { IEduhelxSubmissionModel } from '../tokens'

export class AssignmentWidget extends ReactWidget {
    private model: IEduhelxSubmissionModel
    private serverSettings: IServerSettings

    constructor(model: IEduhelxSubmissionModel, serverSettings: IServerSettings) {
        super()
        
        this.model = model
        this.serverSettings = serverSettings
    }

    render() {
        return (
            <StylesProvider injectFirst>
                <SettingsProvider settings={ this.serverSettings }>
                    <AssignmentProvider model={ this.model }>
                        <AssignmentPanel />
                    </AssignmentProvider>
                </SettingsProvider>
            </StylesProvider>
        )
    }
}