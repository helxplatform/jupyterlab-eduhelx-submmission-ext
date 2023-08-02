import React from 'react'
import { PublishSharp } from '@material-ui/icons'
import { assignmentSubmitButton } from './style'
import { useAssignment } from '../../../../contexts'
import { classes } from 'typestyle'
import { disabledButtonClass } from '../../../style'

interface AssignmentSubmitButtonProps {

}

export const AssignmentSubmitButton = ({ }: AssignmentSubmitButtonProps) => {
    const { assignment } = useAssignment()!

    if (!assignment) return null
    return (
        <button
            className={ classes(assignmentSubmitButton, (!assignment.isReleased || assignment.isClosed) && disabledButtonClass) }
            disabled={ !assignment.isReleased || assignment.isClosed }
            onClick={ () => {} }
        >
            <PublishSharp style={{ fontSize: 22, marginRight: 4 }} /> Submit Assignment
        </button>
    )
}