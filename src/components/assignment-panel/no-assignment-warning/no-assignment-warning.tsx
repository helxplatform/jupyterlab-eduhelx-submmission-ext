import React, { Fragment, useMemo, useState } from 'react'
import { List, ListItem, ListItemAvatar as _ListItemAvatar, ListItemText, Avatar, Input, CircularProgress } from '@material-ui/core'
import { GetAppSharp } from '@material-ui/icons'
import { classes } from 'typestyle'
import {
    containerClass, openFileBrowserButtonClass, textContainerClass,
    warningTextContainerClass
} from './style'
import { AssignmentsList } from '../assignments-list'
import { TextDivider } from '../../text-divider'
import { cloneStudentRepository } from '../../../api'
import { useAssignment, useCommands, useSettings } from '../../../contexts'
import { DateFormat } from '../../../utils'
import { activeStyle, disabledStyle, submitRootClass, summaryClass } from '../assignment-submit-form/style'

interface NoAssignmentWarningProps {
    noRepository: boolean
}

export const NoAssignmentWarning = ({ noRepository }: NoAssignmentWarningProps) => {
    const commands = useCommands()!
    const { course } = useAssignment()!
    const { repoRoot } = useSettings()!

    if (noRepository) return (
        <div className={ containerClass }>
            <div className={ textContainerClass }>
                You are not currently in your class repository.
            </div>
            <button
                className={ openFileBrowserButtonClass }
                onClick={ () => commands.execute('filebrowser:go-to-path', {
                    path: repoRoot,
                    dontShowBrowser: true
                }) }
            >
                Open { course?.name }
            </button>
        </div>
    )
    return (
        <div className={ containerClass }>
            <div className={ textContainerClass }>
                You are not currently in an assignment.
                To submit your work, navigate to an assignment
                in the filebrowser or open it here.
            </div>
            <TextDivider innerStyle={{ fontSize: 15 }} style={{ width: '100%', marginTop: 12 }}>Assignments</TextDivider>
            <AssignmentsList />
        </div>
    )
}