import React, { Fragment, useEffect, useState } from 'react'
import { CircularProgress, Divider } from '@material-ui/core'
import { assignmentContainerClass, containerClass, loadingContainerClass } from './style'
import { NoAssignmentWarning } from '../no-assignment-warning'
import { AssignmentInfo } from '../assignment-info'
import { AssignmentSubmissions } from '../assignment-submissions'
import { AssignmentSubmitForm } from '../assignment-submit-form'
import { AssignmentStagedChanges } from '../assignment-staged-changes'
import { useAssignment } from '../../../contexts'

export const AssignmentContent = () => {
    const { loading, path, assignment, student, assignments } = useAssignment()!

    /*
    const [showSelectionView, setShowSelectionView] = useState<boolean>(true)

    useEffect(() => {
        // When the path / active assignment changes,
        // if there's an active assignment, show the assignment view.
        if (assignment) setShowSelectionView(false)
        // If there isn't an assignment in the current directory, show the selection view.
        else setShowSelectionView(true)
        // Then, users can press a button while in the assignment view, users can press
        // a back button to go back to the selection view.
    }, [path, assignment?.id])
    */

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
                        <AssignmentSubmissions style={{ flexGrow: 1 }} />
                        <AssignmentSubmitForm />
                    </div>
                )
            }
        </div>
    )
}