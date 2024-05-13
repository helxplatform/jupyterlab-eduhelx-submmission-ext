import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import { Backdrop, CircularProgress, Input, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { AssignmentSubmitButton } from './assignment-submit-button'
import {
    submitFormContainerClass, submitRootClass,
    summaryClass,
    activeStyle, disabledStyle
} from './style'
import { useAssignment, useBackdrop, useSnackbar } from '../../../contexts'
import { uploadAssignment as apiUploadAssignment } from '../../../api'

interface AssignmentSubmitFormProps {

}

export const AssignmentSubmitForm = ({ }: AssignmentSubmitFormProps) => {
    const { assignment, course, path } = useAssignment()!
    const backdrop = useBackdrop()!
    const snackbar = useSnackbar()!

    const [summaryText, setSummaryText] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)

    const disabled = submitting || summaryText === ""
    const disabledReason = disabled ? (
        !assignment ? undefined :   
        submitting ? `Currently uploading assignment` :
        summaryText === "" ? `Please enter a summary describing your changes` : undefined
    ) : undefined
    
    const submitAssignment = async () => {
        if (!path) {
            // If this component is being rendered, this should never be possible.
            console.log("Unknown cwd, can't submit")
            return
        }
        setSubmitting(true)
        try {
            const submission = await apiUploadAssignment(path, summaryText)
            // Only clear summary if the upload goes through.
            setSummaryText("")

            snackbar.open({
                type: 'success',
                message: 'Successfully uploaded assignment!'
            })
        } catch (e: any) {
            snackbar.open({
                type: 'error',
                message: 'Failed to upload assignment!'
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
                placeholder="*Summary"
                title="Enter a summary for the assignment changes"
                multiline
                minRows={ 1 }
                value={ summaryText }
                onChange={ (e) => setSummaryText(e.target.value) }
                onKeyDown={ (e) => {
                    if (disabled) return
                    // if (e.key === 'Enter') submitAssignment()
                } }
                disabled={ submitting }
                required
                disableUnderline
                fullWidth
            />
            <Tooltip title={ disabledReason }>
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