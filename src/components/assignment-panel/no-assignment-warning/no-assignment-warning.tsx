import React from 'react'
import { containerClass, openFileBrowserButtonClass, textContainerClass } from './style'

export const NoAssignmentWarning = () => {
    return (
        <div className={ containerClass }>
            <div className={ textContainerClass }>
                You are not currently in an assignment repository.
                To submit your work, navigate to an assignment repository.
            </div>
            <button
                className={ openFileBrowserButtonClass }
                onClick={ () => console.log("Open the filebrowser") }
            >
                Open the FileBrowser
            </button>
        </div>
    )
}