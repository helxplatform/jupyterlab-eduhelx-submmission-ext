import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Progress, Tooltip } from 'antd'
import { classes } from 'typestyle'
import { assignmentSubmissionInfoClass } from './style'
import { TextDivider } from '../../text-divider'
import { tagClass } from '../assignment-info/style'
import { assignmentSubmitButton } from '../assignment-submit-form/assignment-submit-button/style'
import { useAssignment } from '../../../contexts'
import { IStudent, ISubmission } from '../../../api'
import { CircularProgress } from '@material-ui/core'
import { ClearOutlined, PlayArrowOutlined } from '@material-ui/icons'

interface SubmissionLegendProps {
    graded: [IStudent, ISubmission][]
    submitted: [IStudent, ISubmission][]
    unsubmitted: IStudent[]
    
    // Subset of graded in which the student has been given a grade for an old submission
    // but has since resubmitted (stale grade).
    // This is independent of graded/submitted/unsubmitted
    resubmitted: [IStudent, ISubmission][]
}

interface AssignmentSubmissionInfoProps {

}

const Circle = ({ size=8, color, style, ...props }: { size?: number, color: string } & React.HTMLProps<HTMLDivElement>) => {
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
            ...style
        }} { ...props } />
    )
}

const LegendItem = ({ label, value, color, style, ...props }: { label: React.ReactNode, value: React.ReactNode, color: string } & React.HTMLProps<HTMLDivElement>) => {
    return (
        <div style={{ display: "flex", alignItems: "center", ...style }} { ...props }>
            <Circle color={ color } style={{ marginRight: 4 }} />
            { label }&nbsp;
            <span style={{ color: "var(--jp-ui-font-color2)" }}>{ value }</span>
        </div>
    )
}

const SubmissionLegend = ({ graded, submitted, unsubmitted, resubmitted }: SubmissionLegendProps) => {
    const gradedTitle = useMemo<string>(() => {
        const resubmittedOnyens = new Set(resubmitted.map((s) => s[0].onyen))
        return graded.map((s) => `${ s[0].onyen }${ resubmittedOnyens.has(s[0].onyen) ? " (stale)" : "" }`).join(", ")
    }, [graded, resubmitted])
    
    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: 8, fontSize: 13, marginTop: 2, marginBottom: 4 }}>
                <Tooltip title={ gradedTitle }>
                    <LegendItem label="Graded" value={ `${ graded.length }${ resubmitted.length > 0 ? "*" : ""}` } color="var(--md-green-500)" />
                </Tooltip>
                <Tooltip title={ submitted.map((s) => s[0].onyen).join(", ") }>
                    <LegendItem label="Submitted" value={ submitted.length } color="var(--md-yellow-500)" />
                </Tooltip>
                <Tooltip title={ unsubmitted.map((s) => s.onyen).join(", ") }>
                    <LegendItem label="Unsubmitted" value={ unsubmitted.length } color="var(--md-red-500)" />
                </Tooltip>
            </div>
            { resubmitted.length > 0 && (
                <div style={{ fontSize: 12, fontStyle: "italic", color: "var(--jp-ui-font-color2)" }}>
                    *{ resubmitted.length } grade{ resubmitted.length > 1 ? "s are" : " is" } out of date
                </div>
            ) }
        </div>
    )
}

export const AssignmentSubmissionInfo = ({ }: AssignmentSubmissionInfoProps) => {
    const { assignment, students } = useAssignment()!

    const [gradingActive, setGradingActive] = useState<boolean>(false)

    const [graded, submitted, unsubmitted, resubmitted, total] = useMemo(() => {
        if (!assignment || !students) return [[], [], [], [], 0]
        let graded: [IStudent, ISubmission][] = []
        let submitted: [IStudent, ISubmission][] = []
        let unsubmitted: IStudent[] = []
        let resubmitted: [IStudent, ISubmission][] = []

        Object.keys(assignment.studentSubmissions).forEach((onyen) => {
            const submissions = assignment.studentSubmissions[onyen]
            const student = students.find((s) => s.onyen === onyen)!
            if (submissions.length === 0) unsubmitted.push(student)
            else submitted.push([
                student,
                submissions.sort((a, b) => b.submissionTime.getTime() - a.submissionTime.getTime())[0]
            ])
        })

        graded.forEach(([student, submission]) => {
            const submissions = assignment.studentSubmissions[student.onyen]
            const newestSubmission = submissions.sort((a, b) => b.submissionTime.getTime() - a.submissionTime.getTime())[0]
            if (submission.id !== newestSubmission.id) resubmitted.push([student, newestSubmission])
        })
        return [graded, submitted, unsubmitted, resubmitted, graded.length + submitted.length + unsubmitted.length]
    }, [assignment?.studentSubmissions, students])

    const gradingDisabled = useMemo<boolean>(() => {
        return gradingActive || (graded.length === 0 && submitted.length === 0)
    }, [graded, submitted, gradingActive])

    const grade = useCallback(async () => {
        setGradingActive(true)
        await new Promise((resolve) => setTimeout(resolve, 2500))
        setGradingActive(false)
    }, [])

    const abort = useCallback(async () => {
        setGradingActive(false)
    }, [])

    if (!assignment?.isAvailable) return (
        <div className={ assignmentSubmissionInfoClass }>
            <TextDivider innerStyle={{ fontSize: 16 }} style={{ marginBottom: 8 }}>Submissions</TextDivider>
            The assignment is not open to submissions yet.
        </div>
    )
    return (
        <div className={ assignmentSubmissionInfoClass }>
            <TextDivider innerStyle={{ fontSize: 16 }} style={{ marginBottom: 8 }}>Submissions</TextDivider>
            <Progress
                percent={ ( graded.length + submitted.length ) / total * 100 }
                strokeColor="var(--md-yellow-500)"
                success={{ percent: graded.length / total * 100, strokeColor: "var(--md-green-500)" }}
                trailColor='var(--md-red-500)'
                showInfo={ false }
                size={ ["100%", 8] }
            />
            <SubmissionLegend graded={ graded } submitted={ submitted } unsubmitted={ unsubmitted } resubmitted={ resubmitted } />
            <Tooltip
                title={ gradingActive ? `Currently grading, this may take a while...` : gradingDisabled ? `There are no submissions to grade yet` : "" }
                placement="bottom"
            >
                <button
                    className={ classes(assignmentSubmitButton) }
                    style={{
                        marginTop: 16,
                        height: 28,
                        backgroundColor: gradingDisabled ? 'var(--jp-layout-color3)' : undefined
                    }}
                    onClick={ !gradingActive ? grade : abort }
                >
                    { gradingActive ? (
                        <CircularProgress size={ 12 } style={{ color: "white", marginRight: 8 }} />
                    ) : (
                        <PlayArrowOutlined style={{ fontSize: 20 }} />
                    ) }
                    &nbsp;
                    { gradingActive
                        ? `Cancel`
                        : `${ submitted.length === 0 && graded.length > 0 ? "Regrade" : "Grade" } and Upload Submissions` }
                </button>
            </Tooltip>
            
        </div>
    )
}