import React, { ChangeEvent, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import moment from 'moment'
import TextField from '@material-ui/core/TextField'
import { ArrowBackSharp } from '@material-ui/icons'
import { useDebouncedCallback } from 'use-debounce'
import { assignmentInfoClass, assignmentInfoSectionClass, assignmentInfoSectionHeaderClass, assignmentInfoSectionWarningClass, assignmentNameClass, tagClass } from './style'
import { useAssignment } from '../../../contexts'
import { getLocalTimezoneAbbr } from '../../../utils'
import { updateAssignment } from '../../../api'
import { ExpectedValue } from '../../expected-value'
import { InputAdornment } from '@material-ui/core'

const MS_IN_HOURS = 3.6e6

interface AssignmentInfoProps {
}

const formatDateToMui = (date: Date | null | undefined): string => {
    if (date === null || date === undefined) return ""
    return moment(date).format("YYYY-MM-DDTHH:mm")
}

const formatMuiToDate = (date: string): Date | null => {
    if (date === "") return null
    return new Date(date)
}

export const AssignmentInfo = ({  }: AssignmentInfoProps) => {
    const { assignment, instructor, course } = useAssignment()!
    // We need the raw undebounced value so that other parts of the UI can respond immediately to the expected value
    const [availableDateControlled, setAvailableDateControlled] = useState<string|undefined>(undefined)
    const [dueDateControlled, setDueDateControlled] = useState<string|undefined>(undefined)

    if (!instructor || !assignment || !course) return null

    const hoursUntilDue = useMemo(() => (
        assignment.isCreated ? (
            (assignment.dueDate!.getTime() - Date.now()) / MS_IN_HOURS
        ) : Infinity
    ), [assignment])

    const assignmentReleasedTag = useMemo(() => {
        let color = undefined
        let backgroundColor = undefined
        let borderColor = undefined
        let text = undefined
        let tooltip = undefined
        let filled = false
        if (assignment.isCreated) {
            color = "white"
            backgroundColor = "#1890ff"
            text = "Released"
            tooltip = `Clear the available date or due date to unrelease the assignment`
            filled = true
        } else {
            color = "rgba(0, 0, 0, 0.88)"
            backgroundColor = "#fafafa"
            borderColor = "#d9d9d9"
            text = "Not Released"
            tooltip = `Set the available date and due date to release the assignment`
            filled = true
        }
        return (
            <span
                className={ tagClass }
                style={{
                    marginTop: 8,
                    color,
                    backgroundColor: filled ? backgroundColor: "transparent",
                    border: `1px solid ${ borderColor ?? backgroundColor }`,
                    textTransform: "capitalize"
                }}
                title={ tooltip }
            >
                { text }
            </span>
        )
    }, [assignment.isCreated])

    const assignmentStatusTag = useMemo(() => {
        let color = undefined
        let backgroundColor = undefined
        let borderColor = undefined
        let text = undefined
        let tooltip = undefined
        let filled = false
        if (!assignment.isAvailable) {
            color = "rgba(0, 0, 0, 0.88)"
            backgroundColor = "#fafafa"
            borderColor = "#d9d9d9"
            text = "Not Open Yet"
            tooltip = "The assignment has not opened yet for students"
        }
        else if (!assignment.isClosed) {
            text = "Open"
            tooltip = "The assignment is currently open for students to work"
        } else {
            color = "var(--jp-error-color1)"
            backgroundColor = "var(--jp-error-color1)"
            text = "Closed"
            tooltip = "The assignment has closed for students"
            filled = false
        }
        return (
            <span
                className={ tagClass }
                style={{
                    marginTop: 8,
                    marginLeft: 8,
                    color,
                    backgroundColor: filled ? backgroundColor: "transparent",
                    border: `1px solid ${ borderColor ?? backgroundColor }`,
                    textTransform: "capitalize"
                }}
                title={ tooltip }
            >
                { text }
            </span>
        )
    }, [course, assignment, hoursUntilDue])

    const onAvailableDateChanged = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
        void async function() {
            const newDate = e.target.value !== "" ? e.target.value : null
            await updateAssignment(assignment.name, {
                available_date: newDate
            })
        }()
    }, 1000, { leading: true })

    const onDueDateChanged = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
        void async function() {
            const newDate = e.target.value !== "" ? e.target.value : null
            await updateAssignment(assignment.name, {
                due_date: newDate
            })
        }()
    }, 1000, { leading: true })

    useEffect(() => {
        setAvailableDateControlled(formatDateToMui(assignment.availableDate))
        setDueDateControlled(formatDateToMui(assignment.dueDate))
    }, [assignment])

    return (
        <div className={ assignmentInfoClass }>
            <div>
                <header className={ assignmentNameClass }>{ assignment.name }</header>
                {/*
                if (!assignment.isCreated) {
                    // Upcoming assignment (doesn't have either an open or close date yet)
                    color = "white"
                    backgroundColor = "#1890ff"
                    text = "Not released"
                    tooltip = `Set an available date and due date to release the assignment`
                    filled = true
                }
                */}
                { assignmentReleasedTag }
                { assignment.isCreated && assignmentStatusTag }
            </div>
            <div className={ assignmentInfoSectionClass } style={{ marginTop: 16 }}>
                <h5 className={ assignmentInfoSectionHeaderClass }>
                    Available date
                    { availableDateControlled === "" && ` (not set)` }
                </h5>
                <div style={{ width: "100%" }}>
                    <TextField
                        type="datetime-local"
                        defaultValue={ formatDateToMui(assignment.availableDate) }
                        onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                            setAvailableDateControlled(e.target.value)
                            onAvailableDateChanged(e)
                        } }
                        inputProps={{
                            step: 900, // 15 min step
                            style: { boxSizing: "content-box", paddingTop: 4, paddingBottom: 5, fontSize: 15 },
                        }}
                        InputProps={{ inputProps: {
                            // Gets overriden in top-level inputProps
                            max: "9999-12-31T11:59"
                        } }}
                        // helperText={ "(" + getLocalTimezoneAbbr() + ")" }
                        style={{ width: "100%" }}
                    />
                </div>
            </div>
            <div className={ assignmentInfoSectionClass } style={{ marginTop: 0 }}>
                <h5 className={ assignmentInfoSectionHeaderClass }>
                    Due date
                    { dueDateControlled === "" && ` (not set)` }
                </h5>
                <div style={{ width: "100%" }}>
                    <TextField
                        type="datetime-local"
                        defaultValue={ formatDateToMui(assignment.dueDate) }
                        onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                            setDueDateControlled(e.target.value)
                            onDueDateChanged(e)
                        } }
                        inputProps={{
                            step: 900, // 15 min step
                            style: { boxSizing: "content-box", paddingTop: 4, paddingBottom: 5, fontSize: 15 }
                        }}
                        InputProps={{ inputProps: {
                            // Gets overriden in top-level inputProps
                            max: "9999-12-31T11:59"
                        } }}
                        style={{ width: "100%" }}
                    />
                </div>
            </div>
        </div>
    )
}