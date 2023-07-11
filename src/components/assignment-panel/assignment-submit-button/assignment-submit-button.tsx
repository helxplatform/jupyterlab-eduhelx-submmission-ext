import React from 'react'
import { PublishSharp } from '@material-ui/icons'
import { assignmentSubmitButton } from './style'

interface AssignmentSubmitButtonProps {

}

export const AssignmentSubmitButton = ({ }: AssignmentSubmitButtonProps) => {
    return (
        <button
            className={ assignmentSubmitButton }
            onClick={ () => {} }
        >
            <PublishSharp style={{ fontSize: 22, marginRight: 4 }} /> Submit Assignment
        </button>
    )
}