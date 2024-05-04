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

// This is named POORLY!
export const NoAssignmentWarning = ({ noRepository }: NoAssignmentWarningProps) => {
    const commands = useCommands()!
    const { course } = useAssignment()!
    const { repoRoot } = useSettings()!

    const [repositoryUrl, setRepositoryUrl] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    if (noRepository) return (
        <div className={ containerClass }>
            <div className={ textContainerClass }>
                You are not currently in the class master repository.
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
                Please select an assignment for additional details and configuration/management options.
            </div>
            <TextDivider innerStyle={{ fontSize: 15 }} style={{ width: '100%', marginTop: 12 }}>Assignments</TextDivider>
            <AssignmentsList />
        </div>
    )
}