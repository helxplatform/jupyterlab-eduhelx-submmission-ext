import React, { Fragment, useMemo } from 'react'
import moment from 'moment'
import { ArrowBackSharp } from '@material-ui/icons'
import { assignmentInfoClass, assignmentInfoSectionClass, assignmentInfoSectionHeaderClass, assignmentInfoSectionWarningClass, assignmentNameClass, tagClass } from './style'
import { useAssignment } from '../../../contexts'
import { DateFormat } from '../../../utils'

const MS_IN_HOURS = 3.6e6

interface AssignmentInfoProps {
}

export const AssignmentInfo = ({  }: AssignmentInfoProps) => {
    const { assignment, instructor, course } = useAssignment()!
    if (!instructor || !assignment || !course) return null

    const hoursUntilDue = useMemo(() => (
        assignment.isCreated ? (
            (assignment.dueDate!.getTime() - Date.now()) / MS_IN_HOURS
        ) : Infinity
    ), [assignment])

    const assignmentStatusTag = useMemo(() => {
        let color = undefined
        let backgroundColor = undefined
        let text = undefined
        let tooltip = undefined
        let filled = false
        if (!assignment.isCreated) {
            // Upcoming assignment (doesn't have either an open or close date yet)
            color = "white"
            backgroundColor = "#1890ff"
            text = "Upcoming"
            tooltip = `Your instructor${ course.instructors.length > 1 ? "s" : "" } has not released this assignment yet`
            filled = true
        }
        else if (assignment.isClosed) {
            // Not available to work on anymore
            if (assignment.activeSubmission) {
                // Closed and submitted
                color = "var(--jp-success-color1)"
                backgroundColor = "var(--jp-success-color1)"
                text = (
                    <span>
                        Submitted { new DateFormat(assignment.activeSubmission.submissionTime).toRelativeDatetimeNoArticle() } ago
                    </span>
                )
                tooltip = `You submitted this assignment before it closed. Please contact your instructor${ course.instructors.length > 1 ? "s" : "" } if you need to resubmit`
                filled = false
            } else {
                // Closed and never submitted
                color = "var(--jp-error-color1)"
                backgroundColor = "var(--jp-error-color1)"
                text = (
                    <span>
                        { new DateFormat(assignment.dueDate!).toRelativeDatetimeNoArticle() } past due
                    </span>
                )
                tooltip = `You never submitted this assignment. Please contact your instructor${ course.instructors.length > 1 ? "s" : "" } to request an extension`
                filled = false
            }            
        } else if (assignment.isAvailable) {
            // Available
            color = assignment.activeSubmission ? "var(--jp-success-color1)" : "white"
            backgroundColor = assignment.activeSubmission ? "var(--jp-success-color1)" : "var(--jp-warn-color1)"
            text = assignment.activeSubmission ? "Submitted" : "Not Submitted"
            tooltip = assignment.activeSubmission ? `You have submitted this assignment` : `You haven't submitted this assignment yet`
            filled = !assignment.activeSubmission
        }
        return (
            <span
                className={ tagClass }
                style={{
                    marginTop: 8,
                    color,
                    backgroundColor: filled ? backgroundColor: "transparent",
                    border: `1px solid ${ backgroundColor }`,
                    textTransform: "capitalize"
                }}
                title={ tooltip }
            >
                { text }
            </span>
        )
    }, [course, assignment, hoursUntilDue])

    return (
        <div className={ assignmentInfoClass }>
            <div>
                <header className={ assignmentNameClass }>{ assignment.name }</header>
                { assignmentStatusTag }
                { assignment.isCreated && !assignment.isClosed && hoursUntilDue <= 4 && (
                    <span
                        className={ tagClass }
                        style={{
                            marginTop: 8,
                            marginLeft: 6,
                            color: "white",
                            backgroundColor: "var(--jp-warn-color-normal)",
                            border: `1px solid var(--jp-warn-color-normal)`,
                            textTransform: "capitalize"
                        }}
                        title={ new DateFormat(assignment.dueDate!).toBasicDatetime() }
                    >
                        Due in { new DateFormat(assignment.dueDate!).toRelativeDatetimeNoArticle() }
                    </span>
                ) }
            </div>
            <div className={ assignmentInfoSectionClass } style={{ marginTop: 16 }}>
                <h5 className={ assignmentInfoSectionHeaderClass }>Student</h5>
                {/* <span>{ student.firstName } { student.lastName }</span> */}
            </div>
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>
                    Instructor{ course.instructors.length > 1 ? "s" : "" }
                </h5>
                <span>{ course.instructors.map((ins) => ins.fullName).join(", ") }</span>
            </div>
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>Due date</h5>
                <div>
                    { assignment.isCreated ? (
                        new DateFormat(assignment.dueDate!).toBasicDatetime()
                    ) : (
                        `To be determined`
                    ) }
                    { assignment.isExtended ? (
                        <i>&nbsp;(extended)</i>
                    ) : null }
                </div>
            </div>
            { assignment.isCreated && assignment.isClosed && (
                <div className={ assignmentInfoSectionClass }>
                    <h5
                        className={ `${ assignmentInfoSectionHeaderClass} ${ assignmentInfoSectionWarningClass }` }
                    >
                        Assignment is past due
                    </h5>
                    <div className={ assignmentInfoSectionWarningClass }>
                        No further changes can be submitted.
                        Please contact your instructor{ course.instructors.length > 1 ? "s" : "" } for an extension.
                    </div>
                </div>
            ) }
        </div>
    )
}