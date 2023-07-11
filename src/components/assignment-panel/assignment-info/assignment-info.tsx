import React from 'react'
import { assignmentInfoClass, assignmentInfoSectionClass, assignmentInfoSectionHeaderClass, assignmentNameClass } from './style'
import { useAssignment } from '../../../contexts'

export const AssignmentInfo = () => {
    const { assignment } = useAssignment()!
    if (!assignment) return null
    return (
        <div className={ assignmentInfoClass }>
            <header className={ assignmentNameClass }>{ assignment.name }</header>
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>Student</h5>
                <span>{ assignment.student.firstName } { assignment.student.lastName }</span>
            </div>
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>Professor</h5>
                <span>{ assignment.student.professorOnyen }</span>
            </div>
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>Due date</h5>
                <span>{ assignment.dueDate.toDateString() }</span>
            </div>
        </div>
    )
}