import React, { Fragment } from 'react'
import { CircularProgress, Divider } from '@material-ui/core'
import { assignmentContainerClass, containerClass, loadingContainerClass } from './style'
import { NoAssignmentWarning } from '../no-assignment-warning'
import { AssignmentInfo } from '../assignment-info'
import { AssignmentSubmissions } from '../assignment-submissions'
import { AssignmentSubmitForm } from '../assignment-submit-form'
import { useAssignment } from '../../../contexts'

export const AssignmentContent = () => {
    const { loading, assignment, student, assignments } = useAssignment()!
    return (
        <div className={ containerClass }>
            {
                loading ? (
                    <div className={ loadingContainerClass }>
                        <CircularProgress color="inherit" />
                    </div>
                ) : assignment === null ? (
                    <NoAssignmentWarning />
                ) : (
                    <div className={ assignmentContainerClass }>
                        <AssignmentInfo />
                        <AssignmentSubmissions style={{ flexGrow: 1 }} />
                        <AssignmentSubmitForm />
                    </div>
                )
            }
        </div>
    )
}