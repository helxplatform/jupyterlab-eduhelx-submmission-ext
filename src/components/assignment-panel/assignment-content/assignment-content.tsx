import React, { Fragment, useEffect, useState } from 'react'
import { CircularProgress, Divider } from '@material-ui/core'
import { assignmentContainerClass, containerClass, loadingContainerClass } from './style'
import { NoAssignmentWarning } from '../no-assignment-warning'
import { AssignmentInfo } from '../assignment-info'
import { AssignmentSubmissions } from '../assignment-submissions'
import { AssignmentSubmitForm } from '../assignment-submit-form'
import { AssignmentStagedChanges } from '../assignment-staged-changes'
import { useAssignment } from '../../../contexts'
import { Tabs } from '../../tabs'

export const AssignmentContent = () => {
    const { loading, path, assignment, instructor, assignments } = useAssignment()!
    
    return (
        <div className={ containerClass }>
            {
                loading ? (
                    <div className={ loadingContainerClass }>
                        <CircularProgress color="inherit" />
                    </div>
                ) : assignments === null || assignment === null ? (
                    <NoAssignmentWarning noRepository={ assignments === null } />
                ) : (
                    <div className={ assignmentContainerClass }>
                        <AssignmentInfo />
                        <AssignmentStagedChanges />
                        {/*<AssignmentSubmissions style={{ flexGrow: 1 }} /> */}
                        <AssignmentSubmitForm />
                    </div>
                )
            }
        </div>
    )
}