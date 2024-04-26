import React, { useEffect, useMemo, useState } from 'react'
import { Progress, Tooltip } from 'antd'
import { assignmentSubmissionInfoClass } from './style'
import { TextDivider } from '../../text-divider'
import { tagClass } from '../assignment-info/style'
import { assignmentSubmitButton } from '../assignment-submit-form/assignment-submit-button/style'
import { useAssignment } from '../../../contexts'
import { IStudent, ISubmission } from '../../../api'

interface SubmissionLegendProps {
    graded: [IStudent, ISubmission][]
    submitted: [IStudent, ISubmission][]
    unsubmitted: IStudent[]
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

const LegendItem = ({ label, value, color, style, ...props }: { label: string, value: number, color: string } & React.HTMLProps<HTMLDivElement>) => {
    return (
        <div style={{ display: "flex", alignItems: "center", ...style }} { ...props }>
            <Circle color={ color } style={{ marginRight: 4 }} />
            { label }&nbsp;
            <span style={{ color: "var(--jp-ui-font-color2)" }}>{ value }</span>
        </div>
    )
}

const SubmissionLegend = ({ graded, submitted, unsubmitted }: SubmissionLegendProps) => {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: 8, fontSize: 13, marginTop: 2, marginBottom: 4 }}>
            <Tooltip title={ graded.map((s) => s[0].onyen).join(", ") }>
                <LegendItem label="Graded" value={ graded.length } color="var(--md-green-500)" />
            </Tooltip>
            <Tooltip title={ submitted.map((s) => s[0].onyen).join(", ") }>
                <LegendItem label="Submitted" value={ submitted.length } color="var(--md-yellow-500)" />
            </Tooltip>
            <Tooltip title={ unsubmitted.map((s) => s.onyen).join(", ") }>
                <LegendItem label="Unsubmitted" value={ unsubmitted.length } color="var(--md-red-500)" />
            </Tooltip>
        </div>
    )
}

export const AssignmentSubmissionInfo = ({ }: AssignmentSubmissionInfoProps) => {
    const { assignment, students } = useAssignment()!
    const [graded, submitted, unsubmitted, total] = useMemo(() => {
        if (!assignment || !students) return [[], [], [], 0]
        let graded: [IStudent, ISubmission][] = []
        let submitted: [IStudent, ISubmission][] = []
        let unsubmitted: IStudent[] = []
        Object.keys(assignment.studentSubmissions).forEach((onyen) => {
            const submissions = assignment.studentSubmissions[onyen]
            const student = students.find((s) => s.onyen === onyen)!
            if (submissions.length === 0) unsubmitted.push(student)
            else submitted.push([
                student,
                submissions.sort((a, b) => b.submissionTime.getTime() - a.submissionTime.getTime())[0]
            ])
            // else submissions.forEach((submission) => {
                
            // })
        })
        return [graded, submitted, unsubmitted, graded.length + submitted.length + unsubmitted.length]
    }, [assignment?.studentSubmissions, students])
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
            <SubmissionLegend graded={ graded } submitted={ submitted } unsubmitted={ unsubmitted } />
            <button
                className={ assignmentSubmitButton }
                style={{ marginTop: 8, height: 28 }}
                disabled={ graded.length === 0 && submitted.length === 0 }
                onClick={ () => {} }
            >
                { `${ submitted.length === 0 && graded.length > 0 ? "Regrade" : "Grade" } and Upload Submissions` }
            </button>
            
        </div>
    )
}