import React, { Fragment, useMemo } from 'react'
import { List, ListItem, ListItemAvatar as _ListItemAvatar, ListItemText, Avatar } from '@material-ui/core'
import { CalendarTodayOutlined, FolderSharp, GetAppSharp, HourglassFullOutlined, QueryBuilderOutlined } from '@material-ui/icons'
import {
    containerClass, openFileBrowserButtonClass, textContainerClass,
    warningTextContainerClass
} from './style'
import { AssignmentsList } from '../assignments-list'
import { TextDivider } from '../../text-divider'
import { useAssignment, useCommands } from '../../../contexts'
import { DateFormat } from '../../../utils'

export const NoAssignmentWarning = () => {
    const commands = useCommands()!

    return (
        <div className={ containerClass }>
            <div className={ textContainerClass }>
                You are not currently in an assignment repository.
                To submit your work, navigate to an existing assignment repository
                or clone an assignment here.
            </div>
            <div className={ warningTextContainerClass }>
                Warning: Don't download an assignment if you've already cloned it!
                Navigate to the assignment in the file browser instead.
            </div>
            <TextDivider innerStyle={{ fontSize: 15 }} style={{ width: '100%', marginTop: 12 }}>Assignments</TextDivider>
            <AssignmentsList />
            <button
                className={ openFileBrowserButtonClass }
                onClick={ () => commands.execute('filebrowser:toggle-main') }
            >
                Open the FileBrowser
            </button>
        </div>
    )
}