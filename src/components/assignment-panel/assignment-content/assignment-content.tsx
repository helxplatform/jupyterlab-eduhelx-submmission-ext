import React, { Fragment } from 'react'
import { CircularProgress, Divider } from '@material-ui/core'
import { assignmentContainerClass, containerClass, loadingContainerClass } from './style'
import { NoAssignmentWarning } from '../no-assignment-warning'
import { AssignmentInfo } from '../assignment-info'
import { AssignmentSubmissions } from '../assignment-submissions'
import { AssignmentSubmitButton } from '../assignment-submit-button'
import { useAssignment } from '../../../contexts'

export const AssignmentContent = () => {
    const { assignment } = useAssignment()!
    return (
        <div className={ containerClass }>
            {
                assignment === undefined ? (
                    <div className={ loadingContainerClass }>
                        <CircularProgress color="inherit" />
                    </div>
                ) : assignment === null ? (
                    <NoAssignmentWarning />
                ) : (
                    <div className={ assignmentContainerClass }>
                        <AssignmentInfo />
                        <Divider style={{ margin: '0 12px 16px 12px' }} />
                        <AssignmentSubmissions />
                        <div style={{ flexGrow: 1 }} />
                        <AssignmentSubmitButton />
                    </div>
                )
            }
        </div>
    )
}