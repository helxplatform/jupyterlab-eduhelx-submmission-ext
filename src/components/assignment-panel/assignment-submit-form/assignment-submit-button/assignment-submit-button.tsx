import React from 'react'
import { PublishSharp } from '@material-ui/icons'
import { assignmentSubmitButton } from './style'
import { useAssignment } from '../../../../contexts'
import { classes } from 'typestyle'
import { disabledButtonClass } from '../../../style'

interface AssignmentSubmitButtonProps {
    onClick: (e: any) => void
    disabled?: boolean
}

export const AssignmentSubmitButton = ({ onClick, disabled=false }: AssignmentSubmitButtonProps) => {
    return (
        <button
            className={ classes(assignmentSubmitButton, disabled && disabledButtonClass) }
            disabled={ disabled }
            onClick={ onClick }
        >
            <PublishSharp style={{ fontSize: 22, marginRight: 4 }} /> Submit Assignment
        </button>
    )
}