import React from 'react'
import { ArrowBackSharp } from '@material-ui/icons'
import { assignmentInfoClass, assignmentInfoSectionClass, assignmentInfoSectionHeaderClass, assignmentNameClass } from './style'
import { useAssignment } from '../../../contexts'
import { DateFormat } from '../../../utils'

const MS_IN_HOURS = 3.6e6

interface AssignmentInfoProps {
}

export const AssignmentInfo = ({  }: AssignmentInfoProps) => {
    const { assignment, student, course } = useAssignment()!
    if (!student || !assignment || !course) return null

    const hoursUntilDue = assignment.isReleased ? (
        (assignment.adjustedDueDate!.getTime() - Date.now()) / MS_IN_HOURS
    ) : Infinity

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
                <h5 className={ assignmentInfoSectionHeaderClass }>
                    Professor{ course.instructors.length > 1 ? "s" : "" }
                </h5>
                <span>{ course.instructors.map((ins) => ins.fullName).join(", ") }</span>
            </div>
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>Due date</h5>
                <div>
                    { assignment.isReleased ? (
                        new DateFormat(assignment.adjustedDueDate!).toBasicDatetime()
                    ) : (
                        `To be determined`
                    ) }
                    { assignment.isExtended ? (
                        <i>&nbsp;(extended)</i>
                    ) : null }
                </div>
                { assignment.isReleased && !assignment.isClosed && hoursUntilDue <= 5 ? (
                    <div style={{ marginTop: 4, color: 'var(--jp-warn-color0)' }}>
                        Warning: { new DateFormat(assignment.adjustedDueDate!).toRelativeDatetime() } remaining
                    </div>
                ) : null }
            </div>
        </div>
    )
}