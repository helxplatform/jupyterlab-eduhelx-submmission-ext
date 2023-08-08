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
import { useAssignment, useCommands } from '../../../contexts'
import { DateFormat } from '../../../utils'
import { activeStyle, disabledStyle, submitRootClass, summaryClass } from '../assignment-submit-form/style'

interface NoAssignmentWarningProps {
    noRepository: boolean
}

export const NoAssignmentWarning = ({ noRepository }: NoAssignmentWarningProps) => {
    const commands = useCommands()!
    const { path } = useAssignment()!

    const [repositoryUrl, setRepositoryUrl] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const cloneRepository = async (repositoryUrl: string) => {
        if (!path) {
            console.log("Unknown cwd, can't clone")
            return
        }
        setLoading(true)
        try {
            const repositoryRootPath = await cloneStudentRepository(repositoryUrl, path)
            commands.execute('filebrowser:go-to-path', {
                path: repositoryRootPath,
                dontShowBrowser: true
            })
        } catch (e: any) {
            setErrorMessage(e.message)
        }
        setLoading(false)
    }

    if (noRepository) return (
        <div className={ containerClass }>
            <div style={{ width: '100%', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
                    <Input
                        className={ summaryClass }
                        classes={{
                            root: submitRootClass,
                            focused: activeStyle,
                            // disabled: disabledStyle
                        }}
                        style={{
                            borderRadius: 0,
                            borderRight: 'none',
                            marginBottom: 0,
                            flexGrow: 1,
                            height: '2.25em',
                            borderWidth: 1,
                            overflow: 'visible'
                        }}
                        type="url"
                        placeholder="Class repository URL"
                        title="Enter the URL to the class's git repository"
                        error={ errorMessage !== null }
                        value={ repositoryUrl }
                        onChange={ (e) => {
                            setErrorMessage(null)
                            setRepositoryUrl(e.target.value)
                        }}
                        onKeyDown={ (e) => {
                            if (loading) return
                            if (e.key === 'Enter') cloneRepository(repositoryUrl)
                        }}
                        // disabled={ loading }
                        required
                        disableUnderline
                        fullWidth
                    />
                    <button
                        className={ classes(openFileBrowserButtonClass, loading && disabledStyle) }
                        style={{
                            borderRadius: 0,
                            margin: 0,
                            width: '2.25em',
                            height: '2.25em',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        disabled={ loading }
                        onClick={ () => cloneRepository(repositoryUrl) }
                    >
                        { !loading ? (
                            <GetAppSharp style={{ fontSize: 20 }} />
                        ) : (
                            <CircularProgress
                                color="inherit"
                                style={{ width: 14, height: 14, color: 'white' }}
                            />
                        ) }
                    </button>
                </div>
                <div style={{ color: 'var(--jp-error-color1)', marginTop: 8, marginBottom: 4, fontSize: '0.75rem', wordBreak: 'break-all' }}>
                    { errorMessage }
                </div>
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
                To submit your work, navigate to an assignment
                in the filebrowser or open it here.
            </div>
            <TextDivider innerStyle={{ fontSize: 15 }} style={{ width: '100%', marginTop: 12 }}>Assignments</TextDivider>
            <AssignmentsList />
        </div>
    )
}