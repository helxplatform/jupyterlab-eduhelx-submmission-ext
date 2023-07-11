import React, { Fragment } from 'react'
import { Divider, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Card } from '@material-ui/core'
import { CheckSharp } from '@material-ui/icons'
import { useAssignment } from '../../../contexts'
import {
    noSubmissionsTextContainerClass, assignmentsTableClass,
    assignmentSubmissionsContainerClass, assignmentSubmimssionsHeaderClass,
    activateSubmissionButtonClass
} from './style'

interface AssignmentSubmissionsProps {

}

export const AssignmentSubmissions = ({ }: AssignmentSubmissionsProps) => {
    const { assignment } = useAssignment()!
    
    if (!assignment) return null
    if (assignment.submissions.length === 0) return (
        <div className={ noSubmissionsTextContainerClass }>
            You haven't made any submissions for this assignment yet.
            To submit your work, press the "Submit" button at the bottom of the page.
        </div>
    )
    return (
        <div className={ assignmentSubmissionsContainerClass }>
            <h3 className={ assignmentSubmimssionsHeaderClass }>Submissions</h3>
            <Table size="small" className={ assignmentsTableClass }>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Date</TableCell>
                        {/* <TableCell>Commit</TableCell> */}
                        <TableCell>Active</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { assignment.submissions.map((submission) => (
                        <TableRow>
                            <TableCell>{ submission.id }</TableCell>
                            <TableCell>{ submission.submissionTime.toDateString() }</TableCell>
                            {/* <TableCell>{ submission.commitIdShort }</TableCell> */}
                            <TableCell>
                                <div style={{ display: "flex", alignItems: "center", width: "100%", "height": "100%" }}>
                                    { submission.active ? (
                                        <CheckSharp style={{ fontSize: 16 }} />
                                    ) : (
                                        <button className={ activateSubmissionButtonClass }>Activate</button>
                                    ) }
                                </div>
                            </TableCell>
                        </TableRow>
                    )) }
                </TableBody>
            </Table>
        </div>
    )
}