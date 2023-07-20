import React from 'react'
import { ArrowBackSharp } from '@material-ui/icons'
import { assignmentInfoClass, assignmentInfoSectionClass, assignmentInfoSectionHeaderClass, assignmentNameClass } from './style'
import { useAssignment } from '../../../contexts'
import { DateFormat } from '../../../utils'

const MS_IN_HOURS = 3.6e6

interface AssignmentInfoProps {
}

export const AssignmentInfo = ({  }: AssignmentInfoProps) => {
    const { assignment, student } = useAssignment()!
    if (!student || !assignment) return null

    const hoursUntilDue = (assignment.adjustedDueDate.getTime() - Date.now()) / MS_IN_HOURS

    return (
        <div className={ assignmentInfoClass }>
            <div>
                <header className={ assignmentNameClass }>{ assignment.name }</header>
                { assignment.isClosed ? (
                    <h5 style={{
                        margin: 0,
                        marginTop: 8,
                        fontSize: 13,
                        color: 'var(--jp-ui-font-color1)',
                        textTransform: 'uppercase',
                        letterSpacing: 0.75
                    }}>
                        Closed
                    </h5>
                ) : null }
            </div>
            <div className={ assignmentInfoSectionClass } style={{ marginTop: 16 }}>
                <h5 className={ assignmentInfoSectionHeaderClass }>Student</h5>
                <span>{ student.firstName } { student.lastName }</span>
            </div>
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>Professor</h5>
                <span>{ student.professorOnyen }</span>
            </div>
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>Due date</h5>
                <div>
                    { new DateFormat(assignment.adjustedDueDate).toBasicDatetime() }
                    { assignment.isExtended ? (
                        <i>&nbsp;(extended)</i>
                    ) : null }
                </div>
                { !assignment.isClosed && hoursUntilDue <= 5 ? (
                    <div style={{ marginTop: 4, color: 'var(--jp-warn-color0)' }}>
                        Warning: { new DateFormat(assignment.adjustedDueDate).toRelativeDatetime() } remaining
                    </div>
                ) : null }
            </div>
        </div>
    )
}