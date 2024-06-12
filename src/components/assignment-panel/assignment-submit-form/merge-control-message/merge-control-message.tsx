import React, { useMemo } from 'react'
import { List, ListItem, ListItemIcon } from '@material-ui/core'
import { InsertDriveFileOutlined } from '@material-ui/icons'
import { fileIcon } from '@jupyterlab/ui-components'

interface MergeControlMessageProps {
    remoteMessages: string[] 
    assignmentPath: string
}

const INFO_PREFIX = "ERROR: "
const VIOLATION_PREFIX = "VIOLATION: "

export const MergeControlMessage = ({ remoteMessages, assignmentPath }: MergeControlMessageProps) => {
    const [info, files] = useMemo(() => {
        const info: string[] = []
        const files: string[] = []

        remoteMessages.forEach((message) => {
            if (message.trim().startsWith(INFO_PREFIX)) info.push(message.trim().slice(INFO_PREFIX.length))
            if (message.trim().startsWith(VIOLATION_PREFIX)) {
                const fullPath = message.trim().slice(VIOLATION_PREFIX.length)
                // Remove the assignmentPath prefix, since we are in the assignment view already.
                const fileName = fullPath.split(assignmentPath).slice(1).join(assignmentPath)
                files.push(fileName)
            }
        })

        return [info, files]
    }, [remoteMessages])
    
    return (
        <div>
            This assignment has become available for students, so files can no longer be modified.
            <br />
            Please create a new revision of the following:
            <List>
                { files.map((file) => (
                    <ListItem key={ file }>
                        <InsertDriveFileOutlined style={{ fontSize: 20, marginRight: 8 }} />
                        { file }
                    </ListItem>
                )) }
            </List>
        </div>
    )
}