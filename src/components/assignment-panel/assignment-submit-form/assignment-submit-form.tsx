import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Backdrop, CircularProgress, Input, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { AssignmentSubmitButton } from './assignment-submit-button'
import {
    submitFormContainerClass, submitRootClass,
    summaryClass, descriptionClass,
    activeStyle, disabledStyle
} from './style'
import { useAssignment, useBackdrop, useSnackbar } from '../../../contexts'
import { submitAssignment as apiSubmitAssignment } from '../../../api'

interface AssignmentSubmitFormProps {

}

export const AssignmentSubmitForm = ({ }: AssignmentSubmitFormProps) => {
    const { assignment, path } = useAssignment()!
    const backdrop = useBackdrop()!
    const snackbar = useSnackbar()!

    const [summaryText, setSummaryText] = useState<string>("")
    const [descriptionText, setDescriptionText] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)

    const disabled = submitting || summaryText === "" || !assignment?.isAvailable || assignment?.isClosed
    
    const submitAssignment = async () => {
        if (!path) {
            // If this component is being rendered, this should never be possible.
            console.log("Unknown cwd, can't submit")
            return
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
                rows={ 5 }
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
            <AssignmentSubmitButton
                onClick={ submitAssignment }
                disabled={ disabled }
            />
        </div>
    )
}