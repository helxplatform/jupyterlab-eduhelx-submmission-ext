import React from 'react'
import { assignmentInfoClass } from './style'
import { useAssignmentContext } from '../../../contexts'

export const AssignmentInfo = () => {
    const { assignment, path } = useAssignmentContext()!
    
    return (
        <div className={ assignmentInfoClass }>
            The active assignment is called "{ assignment!.name }"
            <br />
            The active path is "{ path! }"
        </div>
    )
}