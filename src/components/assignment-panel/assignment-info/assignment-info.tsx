import React, { Fragment, useCallback, useMemo } from 'react'
import { Tooltip } from 'antd'
import { FormHelperText, Input } from '@material-ui/core'
import { ArrowBackSharp } from '@material-ui/icons'
import moment from 'moment'
import pluralize from 'pluralize'
import { assignmentInfoClass, assignmentInfoSectionClass, assignmentInfoSectionHeaderClass, assignmentInfoSectionWarningClass, assignmentNameClass, tagClass } from './style'
import { useAssignment, useCommands, } from '../../../contexts'
import { DateFormat } from '../../../utils'

const MS_IN_HOURS = 3.6e6

interface AssignmentInfoProps {
}

export const AssignmentInfo = ({  }: AssignmentInfoProps) => {
    const { assignment, student, course, studentNotebookExists } = useAssignment()!
    const commands = useCommands()
    if (!student || !assignment || !course) return null

    const hoursUntilDue = useMemo(() => (
        assignment.isCreated ? (
            (assignment.adjustedDueDate!.getTime() - Date.now()) / MS_IN_HOURS
        ) : Infinity
    ), [assignment])

    const assignmentStatusTag = useMemo(() => {
        let color = undefined
        let backgroundColor = undefined
        let borderColor = undefined
        let text = undefined
        let tooltip = undefined
        let filled = false
        if (!assignment.isCreated || !assignment.isAvailable) {
            // Upcoming assignment (missing either an open/close date OR open date not reached yet)
            color = "white"
            backgroundColor = "#1890ff"
            text = "Upcoming"
            tooltip = `Your ${ pluralize("instructor", course.instructors.length) } has not released this assignment yet`
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
                tooltip = `You submitted this assignment before it closed. Please contact your ${ pluralize("instructor", course.instructors.length) } if you need to resubmit`
                filled = false
            } else {
                // Closed and never submitted
                color = "var(--jp-error-color1)"
                backgroundColor = "var(--jp-error-color1)"
                text = (
                    <span>
                        { new DateFormat(assignment.adjustedDueDate!).toRelativeDatetimeNoArticle() } past due
                    </span>
                )
                tooltip = `You never submitted this assignment. Please contact your ${ pluralize("instructor", course.instructors.length) } to request an extension`
                filled = false
            }            
        } else if (assignment.isAvailable) {
            // Available
            color = assignment.activeSubmission ? "var(--jp-success-color1)" : "var(--jp-ui-font-color1)"
            backgroundColor = assignment.activeSubmission ? "var(--jp-success-color1)" : "#fafafa"
            borderColor = assignment.activeSubmission ? undefined : "#d9d9d9"
            text = assignment.activeSubmission ? "Submitted" : "Not Submitted"
            tooltip = assignment.activeSubmission ? `You have submitted this assignment` : `You haven't submitted this assignment yet`
            filled = !assignment.activeSubmission
        }
        return (
            <Tooltip title={ tooltip } placement="right">
                <span
                    className={ tagClass }
                    style={{
                        marginTop: 8,
                        color,
                        backgroundColor: filled ? backgroundColor: "transparent",
                        border: `1px solid ${ borderColor ?? backgroundColor }`,
                        textTransform: "capitalize"
                    }}
                >
                    { text }
                </span>
            </Tooltip>
        )
    }, [course, assignment, hoursUntilDue])
    
    const attemptsDescriptionText = useMemo(() => {
        if (assignment.maxAttempts === null) return "This assignment has unlimited attempts"

        const remainingAttempts = assignment.maxAttempts - assignment.currentAttempts
        const maxAttemptsReached = assignment.currentAttempts === assignment.maxAttempts

        if (maxAttemptsReached) return "You've reached the maximum number of submissions."
        else return `You are allowed to submit ${ remainingAttempts }${ assignment.currentAttempts > 0 ? ' more' : ''} ${ pluralize("time", remainingAttempts) }`
    }, [assignment])

    const studentNotebookInvalid = useMemo(() => (
        !studentNotebookExists(assignment)
    ), [studentNotebookExists, assignment])

    const openStudentNotebook = useCallback(async () => {
        if (!commands || !assignment) return
        const fullNotebookPath = assignment.absoluteDirectoryPath + "/" + assignment.studentNotebookPath
        commands.execute('docmanager:open', { path: fullNotebookPath })
    }, [commands, assignment])

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
                        title={ new DateFormat(assignment.adjustedDueDate!).toBasicDatetime() }
                    >
                        Due in { new DateFormat(assignment.adjustedDueDate!).toRelativeDatetimeNoArticle() }
                    </span>
                ) }
            </div>
            <div className={ assignmentInfoSectionClass } style={{ marginTop: 16 }}>
                <h5 className={ assignmentInfoSectionHeaderClass }>Student</h5>
                <span>{ student.name }</span>
            </div>
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>
                    { pluralize("Instructor", course.instructors.length) }
                </h5>
                <span>{ course.instructors.map((ins) => ins.name).join(", ") }</span>
            </div>
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>Due Date</h5>
                <div>
                    { assignment.isCreated ? (
                        new DateFormat(assignment.adjustedDueDate!).toBasicDatetime()
                    ) : (
                        `To be determined`
                    ) }
                    { assignment.isExtended ? (
                        <i>&nbsp;(extended)</i>
                    ) : null }
                </div>
            </div>
            { assignment.maxAttempts !== null && (
                <div className={ assignmentInfoSectionClass }>
                    <h5 className={ assignmentInfoSectionHeaderClass }>
                        Attempts{ assignment.currentAttempts > 0 ? ` (${ assignment.currentAttempts }/${ assignment.maxAttempts })` : "" }
                    </h5>
                    <div>
                        { attemptsDescriptionText }
                    </div>
                </div>
            ) }
            { assignment.isCreated && assignment.isClosed && (
                <div className={ assignmentInfoSectionClass }>
                    <h5
                        className={ `${ assignmentInfoSectionHeaderClass} ${ assignmentInfoSectionWarningClass }` }
                    >
                        Assignment is past due
                    </h5>
                    <div className={ assignmentInfoSectionWarningClass }>
                        No further changes can be submitted.
                        Please contact your {pluralize("instructor", course.instructors.length)} for an extension.
                    </div>
                </div>
            ) }
            <div className={ assignmentInfoSectionClass } style={{ marginTop: 0 }}>
                <h5 className={ assignmentInfoSectionHeaderClass }>
                    Assignment Notebook
                </h5>
                <div style={{ width: "100%" }}>
                    { !studentNotebookInvalid ? (
                        <Fragment>
                        <Input
                            readOnly
                            value={ assignment.studentNotebookPath }
                            inputProps={{ style: { height: 32 } }}
                            style={{ width: "100%" }}
                        />
                        <FormHelperText style={{ color: "#1976d2" }}>
                            <a onClick={ openStudentNotebook } style={{ cursor: "pointer" }}>
                                Open notebook
                            </a>
                        </FormHelperText>
                        </Fragment>
                    ) : (
                        <span>
                            Not published yet
                        </span>
                    ) }
                </div>
            </div>
        </div>
    )
}