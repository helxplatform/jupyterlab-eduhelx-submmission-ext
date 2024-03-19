import React, { Fragment, useMemo } from 'react'
import { 
    Table, TableHead, TableBody, TableRow, TableCell,
    List, ListItem, ListItemText, ListItemIcon, Divider,
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails,
    Card, CardContent, Typography
} from '@material-ui/core'
import { CheckSharp, DescriptionSharp, ExpandMoreSharp, PersonSharp } from '@material-ui/icons'
import {
    noSubmissionsTextContainerClass, assignmentsTableClass,
    assignmentSubmissionsContainerClass, assignmentSubmissionsHeaderClass,
    activateSubmissionButtonClass,
    assignmentsListClass
} from './style'
import { TextDivider } from '../../text-divider'
import { useAssignment } from '../../../contexts'
import { DateFormat } from '../../../utils'

interface AssignmentSubmissionsProps extends React.HTMLProps<HTMLDivElement> {

}

export const AssignmentSubmissions = ({ ...props }: AssignmentSubmissionsProps) => {
    const { assignment } = useAssignment()!

    const submissionSource = useMemo(() => (
        assignment?.submissions.sort((a, b) => b.submissionTime.getTime() - a.submissionTime.getTime())
    ), [assignment])
    
    if (!assignment) return null
    if (assignment.submissions.length === 0) return (
        <div className={ noSubmissionsTextContainerClass }>
            <div style={{ marginTop: 12, textAlign: "center" }}>
                You haven't made any submissions for this assignment yet.
                To submit your work, press the "Submit" button at the bottom of the page.
            </div>
        </div>
    )
    return (
        <div className={ assignmentSubmissionsContainerClass } { ...props }>
            {/* <TextDivider innerStyle={{ fontSize: 'var(--jp-ui-font-size2)' }} style={{ padding: '0 12px' }}>Submissions</TextDivider> */}
            <div className={ assignmentsListClass }>
                { submissionSource!.map((submission, i) => (
                    <ExpansionPanel key={ submission.id } square>
                        <ExpansionPanelSummary expandIcon={ <ExpandMoreSharp /> }>
                            <ListItem>
                                <ListItemIcon style={{ minWidth: 0, marginRight: 16 }}>
                                    <span>{ `#${ submissionSource!.length - i }` }</span>
                                </ListItemIcon>
                                <ListItemText disableTypography>
                                    <div style={{ fontSize: 12, color: 'var(--jp-ui-font-color2)', marginBottom: 4 }}>
                                        { new DateFormat(submission.submissionTime).toBasicDatetime() }
                                    </div>
                                    <div style={{ fontSize: 13 }}>
                                        { submission.commit.summary } 
                                    </div>
                                </ListItemText>
                            </ListItem>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Card variant="outlined">
                                <CardContent style={{ padding: 0 }}>
                                    <Typography variant="h5" component="h5" style={{ fontSize: 13, fontFamily: "inherit" }}>
                                        { submission.commit.authorName }
                                    </Typography>
                                    <Typography style={{ fontSize: 12, marginBottom: 4, fontFamily: "inherit" }} color="textSecondary">
                                        { submission.commit.idShort }
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        component="p"
                                        style={{
                                            fontSize: 12,
                                            fontFamily: "inherit",
                                            wordBreak: "break-word",
                                            fontStyle: submission.commit.description ? "normal" : "italic"
                                        }}
                                    >
                                        { submission.commit.description || "No description" }
                                    </Typography>
                                </CardContent>
                            </Card>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )) }
            </div>
            {/* { assignment.submissions.map((submission) => (
                <Fragment>
                <div key={ submission.id } style={{ display: "flex", flexDirection: "column", padding: "8px 12px" }}>
                    <small style={{ fontSize: 12, color: 'var(--jp-ui-font-color2)', marginBottom: 8 }}>
                        { new DateFormat(submission.submissionTime).toBasicDatetime() }
                    </small>
                    <div style={{ fontSize: 13 }}>
                        { submission.commit.summary } 
                    </div>
                </div>
                <Divider style={{ margin: '4px 0' }} />
                </Fragment>
            )) } */}
        </div>
    )
}