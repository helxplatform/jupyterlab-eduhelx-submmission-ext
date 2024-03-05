import React from 'react'
import { assignmentStagedChangesClass } from './style'
import { useAssignment } from '../../../contexts'

interface AssignmentStagedChangesProps {
}

export const AssignmentStagedChanges = ({ }: AssignmentStagedChangesProps) => {
    const { assignment } = useAssignment()!
    return (
        <div className={ assignmentStagedChangesClass }>
            Changed files:
            <ul>
            {
                assignment!.stagedChanges.map((file) => <li>{ file }</li>)
            }
            </ul>
        </div>
    )
}