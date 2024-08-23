import React, { Fragment, useCallback, useMemo } from 'react'
import { Tooltip } from 'antd'
import { FormHelperText, Input } from '@material-ui/core'
import { ArrowBackSharp } from '@material-ui/icons'
import moment from 'moment'
import pluralize from 'pluralize'
import { assignmentInfoClass, assignmentInfoSectionClass, assignmentInfoSectionHeaderClass, assignmentInfoSectionWarningClass, assignmentNameClass, tagClass } from './style'
import { useAssignment, useCommands, } from '../../../contexts'
import { DateFormat } from '../../../utils'
import { AssignmentStatus } from '../../../api/api-responses'

const MS_IN_HOURS = 3.6e6

interface AssignmentInfoProps {
}

export const AssignmentInfo = ({  }: AssignmentInfoProps) => {
    const { assignment, student, course, studentNotebookExists } = useAssignment()!
    const commands = useCommands()
    if (!student || !assignment || !course) return null

    const hoursUntilDue = useMemo(() => (
        assignment.adjustedDueDate ? (
            (assignment.adjustedDueDate.getTime() - Date.now()) / MS_IN_HOURS
        ) : Infinity
    ), [assignment])

    const assignmentStatusTag = useMemo(() => {
        let color = undefined
        let backgroundColor = undefined
        let borderColor = undefined
        let text = undefined
        let tooltip = undefined
        let filled = false
        switch (assignment.status) {
            // We don't actually show this tag if the assignment is unpublished.
            case AssignmentStatus.UNPUBLISHED:
            case AssignmentStatus.UPCOMING: {
                color = "white"
                backgroundColor = "#1890ff"
                text = "Upcoming"
                tooltip = `Your ${ course.instructors.length === 1 ? "instructor has" : "instructors have" } not released this assignment yet`
                filled = true
                break
            }
            case AssignmentStatus.OPEN: {
                color = assignment.activeSubmission ? "var(--jp-success-color1)" : "var(--jp-ui-font-color1)"
                backgroundColor = assignment.activeSubmission ? "var(--jp-success-color1)" : "#fafafa"
                borderColor = assignment.activeSubmission ? undefined : "#d9d9d9"
                text = assignment.activeSubmission ? "Submitted" : "Not Submitted"
                tooltip = assignment.activeSubmission ? `You have submitted this assignment` : `You haven't submitted this assignment yet`
                filled = !assignment.activeSubmission
                break
            }
            case AssignmentStatus.CLOSED: {
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
            }
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
    }, [course, assignment])
    
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
                { assignment.status === AssignmentStatus.OPEN && hoursUntilDue <= 4 && (
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
                <h5 className={ assignmentInfoSectionHeaderClass }>
                    { pluralize("Instructor", course.instructors.length) }
                </h5>
                <span>{ course.instructors.map((ins) => ins.name).join(", ") }</span>
            </div>
            { assignment.status === AssignmentStatus.UPCOMING && (
                <div className={ assignmentInfoSectionClass }>
                    <h5 className={ assignmentInfoSectionHeaderClass }>Open date</h5>
                    <div>
                        { assignment.adjustedAvailableDate !== null ? (
                            new DateFormat(assignment.adjustedAvailableDate).toBasicDatetime()
                        ) : (
                            `No open date`
                        ) }
                        { assignment.isDeferred ? (
                            <i>&nbsp;(deferred)</i>
                        ) : null }
                    </div>
                </div>
            ) }
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>Due Date</h5>
                <div>
                    { assignment.adjustedDueDate !== null ? (
                        new DateFormat(assignment.adjustedDueDate).toBasicDatetime()
                    ) : (
                        `No closing date`
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
            <div className={ assignmentInfoSectionClass }>
                <h5 className={ assignmentInfoSectionHeaderClass }>
                    Assignment Notebook
                </h5>
                <div style={{ width: "100%" }}>
                    { !studentNotebookInvalid ? (
                        <Fragment>
                        <Input
                            readOnly
                            value={ assignment.studentNotebookPath }
                            inputProps={{ style: { height: 32, fontSize: 15 } }}
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
            { assignment.status === AssignmentStatus.CLOSED && !assignment.activeSubmission && (
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
        </div>
    )
}