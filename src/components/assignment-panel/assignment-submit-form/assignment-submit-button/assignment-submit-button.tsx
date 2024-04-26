import React, { ButtonHTMLAttributes } from 'react'
import { PublishSharp } from '@material-ui/icons'
import { assignmentSubmitButton } from './style'
import { useAssignment } from '../../../../contexts'
import { classes } from 'typestyle'
import { disabledButtonClass } from '../../../style'

interface AssignmentSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick: (e: any) => void
}

export const AssignmentSubmitButton = ({ onClick, disabled=false, ...props }: AssignmentSubmitButtonProps) => {
    return (
        <button
            className={ classes(assignmentSubmitButton, disabled && disabledButtonClass) }
            onClick={ onClick }
            disabled={ disabled }
            { ...props }
        >
            <PublishSharp style={{ fontSize: 22, marginRight: 4 }} />Push Changes To Students
        </button>
    )
}