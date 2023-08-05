import React from 'react'
import { ReactWidget } from '@jupyterlab/apputils'
import { CommandRegistry } from '@lumino/commands'
import { StylesProvider } from '@material-ui/core/styles'
import { AssignmentPanel } from '../components'
import { IServerSettings } from '../api'
import { AssignmentProvider, CommandsProvider, SettingsProvider, BackdropProvider, SnackbarProvider } from '../contexts'
import { IEduhelxSubmissionModel } from '../tokens'

export class AssignmentWidget extends ReactWidget {
    private model: IEduhelxSubmissionModel
    private commands: CommandRegistry
    private serverSettings: IServerSettings

    constructor(
        model: IEduhelxSubmissionModel,
        commands: CommandRegistry,
        serverSettings: IServerSettings
    ) {
        super()
        
        this.model = model
        this.commands = commands
        this.serverSettings = serverSettings
    }

    render() {
        return (
            <StylesProvider injectFirst>
                <CommandsProvider commands={ this.commands }>
                    <SettingsProvider settings={ this.serverSettings }>
                        <BackdropProvider>
                            <SnackbarProvider>
                                <AssignmentProvider model={ this.model }>
                                    <AssignmentPanel />
                                </AssignmentProvider>
                            </SnackbarProvider>
                        </BackdropProvider>
                    </SettingsProvider>
                </CommandsProvider>
            </StylesProvider>
        )
    }
}