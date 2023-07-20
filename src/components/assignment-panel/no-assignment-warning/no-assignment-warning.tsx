import React, { Fragment, useMemo, useState } from 'react'
import { List, ListItem, ListItemAvatar as _ListItemAvatar, ListItemText, Avatar, Input } from '@material-ui/core'
import { GetAppSharp } from '@material-ui/icons'
import {
    containerClass, openFileBrowserButtonClass, textContainerClass,
    warningTextContainerClass
} from './style'
import { AssignmentsList } from '../assignments-list'
import { TextDivider } from '../../text-divider'
import { useAssignment, useCommands } from '../../../contexts'
import { DateFormat } from '../../../utils'
import { activeStyle, disabledStyle, submitRootClass, summaryClass } from '../assignment-submit-form/style'

interface NoAssignmentWarningProps {
    noRepository: boolean
}

export const NoAssignmentWarning = ({ noRepository }: NoAssignmentWarningProps) => {
    const commands = useCommands()!

    const [repositoryUrl, setRepositoryUrl] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const cloneRepository = async () => {
        setLoading(true)

        setLoading(false)
    }

    if (noRepository) return (
        <div className={ containerClass }>
            <div style={{ display: 'flex', alignItems: 'stretch', width: '100%', marginBottom: 12 }}>
                <Input
                    className={ summaryClass }
                    classes={{
                        root: submitRootClass,
                        focused: activeStyle,
                        disabled: disabledStyle
                    }}
                    style={{
                        borderRadius: 0,
                        borderRight: 'none',
                        marginBottom: 0,
                        flexGrow: 1,
                        height: '2.25em'
                    }}
                    type="url"
                    placeholder="Class repository URL"
                    title="Enter the URL to the class's git repository"
                    value={ repositoryUrl }
                    onChange={ (e) => setRepositoryUrl(e.target.value) }
                    disabled={ loading }
                    required
                    disableUnderline
                    fullWidth
                />
                <button
                    className={ openFileBrowserButtonClass }
                    style={{
                        borderRadius: 0,
                        margin: 0,
                        width: '2.25em',
                        height: '2.25em',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onClick={ () => console.log("not implemented") }
                >
                    <GetAppSharp style={{ fontSize: 20 }} />
                </button>
            </div>
            <div className={ textContainerClass }>
                You are not currently in your class repository. If you haven't
                already cloned your class repository, you can download it here.
            </div>
            <div className={ warningTextContainerClass }>
                Warning: Don't clone the repository again if you've already downloaded it!
                Navigate to the repository in the file browser.
            </div>
            <button
                className={ openFileBrowserButtonClass }
                onClick={ () => commands.execute('filebrowser:toggle-main') }
            >
                Open the FileBrowser
            </button>
        </div>
    )
    return (
        <div className={ containerClass }>
            <div className={ textContainerClass }>
                You are not currently in an assignment.
                To submit your work, navigate to an existing
                assignment or open an assignment here.
            </div>
            <TextDivider innerStyle={{ fontSize: 15 }} style={{ width: '100%', marginTop: 12 }}>Assignments</TextDivider>
            <AssignmentsList />
        </div>
    )
}