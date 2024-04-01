import React, { Fragment, useMemo, useState } from 'react'
import {
    Avatar, List, ListItem, ListItemAvatar as _ListItemAvatar, ListItemText,
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails
} from '@material-ui/core'
import { OpenInNewSharp, QueryBuilderOutlined, ExpandMoreSharp } from '@material-ui/icons'
import { classes } from 'typestyle'
import { assignmentBucketContainerClass, assignmentListHeaderClass, assignmentListItemClass, downloadAssignmentButtonClass } from './style'
import { TextDivider } from '../../text-divider'
import { useAssignment, useCommands } from '../../../contexts'
import type { IAssignment } from '../../../api'
import { DateFormat } from '../../../utils'
import { assignmentsListClass } from '../assignment-submissions/style'
import { disabledButtonClass } from '../../style'

const ListItemAvatar = _ListItemAvatar as any

interface ListHeaderProps {
    title: string
}

interface AssignmentListItemProps {
    assignment: IAssignment
}

interface AssignmentsBucketProps {
    title: string
    assignments?: IAssignment[]
    emptyText?: string
    defaultExpanded?: boolean
}

const ListHeader = ({ title }: ListHeaderProps) => {
    return (
        <span className={ assignmentListHeaderClass }>
            { title }
        </span>
    )
}

const AssignmentListItem = ({ assignment }: AssignmentListItemProps) => {
    const commands = useCommands()!
    return (
        <ListItem
            key={ assignment.id }
            className={ assignmentListItemClass }
            dense
            style={{
                padding: '4px 8px'
            }}
        >
            <ListItemText disableTypography>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                    { assignment.name }
                </div>
                <div style={{ fontSize: 13, color: 'var(--jp-ui-font-color2' }}>
                    {
                        !assignment.isCreated ? (
                            <span>No release date yet</span>
                        ) :
                        assignment.isClosed ? (
                            <span title={ new DateFormat(assignment.dueDate!).toBasicDatetime() }>
                                Closed on { new DateFormat(assignment.dueDate!).toBasicDatetime() }
                            </span>
                        ) : assignment.isAvailable ? (
                            <span title={ new DateFormat(assignment.dueDate!).toBasicDatetime() }>
                                Closes in { new DateFormat(assignment.dueDate!).toRelativeDatetime() }
                                { assignment.isExtended && (
                                    <i>&nbsp;(extended)</i>
                                ) }
                            </span>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div
                                    title={ new DateFormat(assignment.availableDate!).toBasicDatetime() }
                                >
                                    { (console.log(assignment, "foobar", "fix this to work for past dates..."),"foobar") }
                                    Opens in { new DateFormat(assignment.availableDate!).toRelativeDatetime() }
                                </div>
                                <div
                                    title={ new DateFormat(assignment.dueDate!).toBasicDatetime() }
                                    style={{ marginTop: 4, fontSize: 12, display: 'flex', alignItems: 'center' }}
                                >
                                    <QueryBuilderOutlined style={{ fontSize: 16 }} />
                                    &nbsp;Lasts { new DateFormat(assignment.dueDate!).toRelativeDatetime(assignment.availableDate!) }
                                </div>
                            </div>
                        )
                    }
                </div>
            </ListItemText>
            <ListItemAvatar style={{ minWidth: 0, marginLeft: 16 }}>
                <Avatar variant="square">
                    <button
                        className={ classes(downloadAssignmentButtonClass, !assignment.isCreated && disabledButtonClass) }
                        disabled={ !assignment.isCreated }
                        onClick={ () => commands.execute('filebrowser:go-to-path', {
                            path: assignment.absoluteDirectoryPath,
                            dontShowBrowser: true
                        }) }
                    >
                        <OpenInNewSharp />
                    </button>
                </Avatar>
            </ListItemAvatar>
        </ListItem>
    )
}

const AssignmentsBucket = ({
    title,
    assignments,
    emptyText="There are currently no assignments to work on.",
    defaultExpanded=false,
}: AssignmentsBucketProps) => {
    const [expanded, setExpanded] = useState<boolean>(defaultExpanded)

    const assignmentsSource = useMemo(() => (
        assignments?.sort((a, b) => (a.availableDate?.getTime() ?? 0) - (b.availableDate?.getTime() ?? 0))
    ), [assignments])

    const isEmpty = useMemo(() => !assignmentsSource || assignmentsSource.length === 0, [assignmentsSource])

    return (
        <ExpansionPanel
            className={ assignmentBucketContainerClass }
            square
            expanded={ expanded }
            onChange={ () => setExpanded(!expanded) }
        >
            <ExpansionPanelSummary
                expandIcon={ <ExpandMoreSharp /> }
                style={{ paddingLeft: 11 }}
            >
                <ListHeader title={ title } />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
                style={{ display: 'flex', flexDirection: 'column', paddingTop: 0, paddingLeft: 11, paddingRight: 11 }}
            >
                { !isEmpty ? (
                    assignmentsSource?.map((assignment) => (
                        <AssignmentListItem key={ assignment.id } assignment={ assignment } />
                    ))
                ) : (
                    <span style={{ color: 'var(--jp-ui-font-color1)' }}>
                        { emptyText }
                    </span>
                ) }
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}

export const AssignmentsList = () => {
    const { assignments } = useAssignment()!

    const publishedAssignments = useMemo(() => assignments?.filter((assignment) => assignment.isCreated), [assignments])
    const unpublishedAssignments = useMemo(() => assignments?.filter((assignment) => !assignment.isCreated), [assignments])
    
    return (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: 'calc(100% + 22px)' }}>
            <div className={ assignmentsListClass }>
                <AssignmentsBucket
                    title={ `Published${ publishedAssignments ? " (" + publishedAssignments.length + ")" : "" }` }
                    assignments={ publishedAssignments }
                    emptyText="There are not any published assignments currently."
                    defaultExpanded={ true }
                />
                <AssignmentsBucket
                    title={ `Unpublished${ unpublishedAssignments ? " (" + unpublishedAssignments.length + ")" : "" }` }
                    assignments={ unpublishedAssignments }
                    emptyText="There are not any unpublished assignments currently."
                    defaultExpanded={ true }
                />
            </div>
        </div>
    )
}