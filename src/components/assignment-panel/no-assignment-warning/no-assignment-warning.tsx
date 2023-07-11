import React from 'react'
import { containerClass, openFileBrowserButtonClass, textContainerClass } from './style'
import { useCommands } from '../../../contexts'

export const NoAssignmentWarning = () => {
    const commands = useCommands()!
    return (
        <div className={ containerClass }>
            <div className={ textContainerClass }>
                You are not currently in an assignment repository.
                To submit your work, navigate to an assignment repository.
            </div>
            <button
                className={ openFileBrowserButtonClass }
                onClick={ () => commands.execute('filebrowser:toggle-main') }
            >
                Open the FileBrowser
            </button>
        </div>
    )
}