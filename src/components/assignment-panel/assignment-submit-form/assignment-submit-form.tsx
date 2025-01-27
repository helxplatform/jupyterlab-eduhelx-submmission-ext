import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog, showDialog } from '@jupyterlab/apputils'
import { Backdrop, CircularProgress, Input, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Tooltip } from 'antd'
import pluralize from 'pluralize'
import { AssignmentSubmitButton } from './assignment-submit-button'
import {
    submitFormContainerClass, submitRootClass,
    summaryClass, descriptionClass,
    activeStyle, disabledStyle
} from './style'
import { useAssignment, useBackdrop, useSnackbar } from '../../../contexts'
import { submitAssignment as apiSubmitAssignment } from '../../../api'
import { AssignmentStatus } from '../../../api/api-responses'

interface AssignmentSubmitFormProps {

}

export const AssignmentSubmitForm = ({ }: AssignmentSubmitFormProps) => {
    const { assignment, course, path, updateAssignments } = useAssignment()!
    const backdrop = useBackdrop()!
    const snackbar = useSnackbar()!

    const [summaryText, setSummaryText] = useState<string>("")
    const [descriptionText, setDescriptionText] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)

    const maxAttemptsReached = !!assignment && assignment.maxAttempts !== null && assignment.currentAttempts >= assignment.maxAttempts
    const contactText = `Please contact your ${ pluralize("instructor", course!.instructors.length) }`

    const disabled = submitting || summaryText === "" || assignment?.status !== AssignmentStatus.OPEN || maxAttemptsReached
    const disabledReason = disabled ? (
        !assignment ? undefined :
        submitting ? `Currently uploading submission` :
        assignment.status === AssignmentStatus.UNPUBLISHED || assignment.status === AssignmentStatus.UPCOMING ?
            `Assignment is not available for you to work on yet` :
        assignment.status === AssignmentStatus.CLOSED ?
            `Past due. ${ contactText } if you need an extension` :
        maxAttemptsReached ? `You have reached the maximum number of submissions. ${ contactText } if you need to resubmit` :
        summaryText === "" ? `Please enter a summary for the submission` : undefined
    ) : undefined
    
    const submitAssignment = async () => {
        if (!path) {
            // If this component is being rendered, this should never be possible.
            console.log("Unknown cwd, can't submit")
            return
        }
        if (assignment && assignment.maxAttempts !== null) {
            const singleAttempt = assignment.maxAttempts === 1
            const remainingAttempts = assignment.maxAttempts - assignment.currentAttempts

            if (remainingAttempts === 1) {
                const result = await showDialog({
                    title: "Confirm submission",
                    body: singleAttempt ? (
                        "You can only submit this assignment once. Are you sure you want to submit?"
                    ) : (
                        "This is your final remaining submission. Are you sure you want to submit?"
                    ),
                    buttons: [
                        Dialog.cancelButton(),
                        Dialog.okButton({ label: "Confirm" })
                    ]
                })
                if (!result.button.accept) return
            }
        } 

        setSubmitting(true)
        try {
            // Use undefined for descriptionText if it is an empty string.
            const submission = await apiSubmitAssignment(path, summaryText, descriptionText ?? undefined)
            // Only clear summary/description if the submission goes through.
            setSummaryText("")
            setDescriptionText("")

            snackbar.open({
                type: 'success',
                message: 'Successfully submitted assignment!'
            })
        } catch (e: any) {
            snackbar.open({
                type: 'error',
                message: 'Failed to submit assignment!'
            })
        }
        try {
            // In order to immediately update staged changes tacked onto `current_assignment`.
            await updateAssignments()
        } catch (e: any) {}
        setSubmitting(false)
    }
    
    useEffect(() => {
        backdrop.setLoading(submitting)
    }, [submitting])
    
    return (
        <div className={ submitFormContainerClass }>
            <Input
                className={ summaryClass }
                classes={{
                    root: submitRootClass,
                    focused: activeStyle,
                    disabled: disabledStyle
                }}
                type="text"
                placeholder="Summary"
                title="Enter a summary for the submission (preferably less than 50 characters)"
                value={ summaryText }
                onChange={ (e) => setSummaryText(e.target.value) }
                onKeyDown={ (e) => {
                    if (disabled) return
                    if (e.key === 'Enter') submitAssignment()
                } }
                disabled={ submitting }
                required
                disableUnderline
                fullWidth
            />
            <Input
                className={ descriptionClass }
                classes={{
                    root: submitRootClass,
                    focused: activeStyle,
                    disabled: disabledStyle
                }}
                multiline
                rows={ 3 }
                rowsMax={ 10 }
                placeholder="Description (optional)"
                title="Enter a description for the submission"
                value={ descriptionText }
                onChange={ (e) => setDescriptionText(e.target.value) }
                onKeyDown={ (e) => {
                    // if (disabled) return
                    // if (e.key === 'Enter') submitAssignment()
                } }
                disabled={ submitting }
                disableUnderline
                fullWidth
            />
            <Tooltip title={ disabledReason }>
                {/* Wrap in div to avoid antd appending button styles. */}
                <div>
                    <AssignmentSubmitButton
                        onClick={ submitAssignment }
                        disabled={ disabled }
                        style={{ width: "100%" }}
                    />
                </div>
            </Tooltip>
        </div>
    )
}