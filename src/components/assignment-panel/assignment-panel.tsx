import React, { Fragment, ReactNode, useEffect, useMemo } from 'react'
import { ArrowBackSharp, SupervisorAccountOutlined, SyncOutlined } from '@material-ui/icons'
import {
    panelWrapperClass,
    panelHeaderClass
} from './style'
import { AssignmentContent } from './assignment-content'
import { useAssignment, useCommands, useSettings } from '../../contexts'

interface IAssignmentPanelProps {
}

export const AssignmentPanel = ({}: IAssignmentPanelProps) => {
    const commands = useCommands()!
    const { repoRoot } = useSettings()!
    const { course, students, assignment } = useAssignment()!
    const headerName = useMemo<ReactNode>(() => {
        const headerFragments = []
        // if (assignment) headerFragments.push(assignment.name)
        if (course) headerFragments.push(course.name)
        headerFragments.push('EduHeLx')
        return (
            <Fragment>
                { headerFragments.join(' • ') }
            </Fragment>
        )
    }, [course])

    /** On page load, we want to `cd` to the repo root. */
    useEffect(() => {
        console.log("CDing to repo root", repoRoot)
        commands.execute('filebrowser:go-to-path', {
            path: repoRoot,
            dontShowBrowser: true
        })
    }, [repoRoot])
    return (
        <div className={ panelWrapperClass }>
            <header className={ panelHeaderClass }>
                { assignment && (
                    <ArrowBackSharp
                        onClick={ () => commands.execute('filebrowser:go-to-path', {
                            path: `${ assignment.absoluteDirectoryPath }/../`,
                            dontShowBrowser: true
                        }) }
                        style={{ marginRight: 8, fontSize: 16, cursor: 'pointer' }}
                    />
                ) }
                { headerName }
                { students && (
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }} title="Immediately sync to servers">
                        { students.length } <SupervisorAccountOutlined style={{ fontSize: 20, marginLeft: 4 }} />
                    </div>
                ) }
                { students && (
                    <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
                        <SyncOutlined style={{ fontSize: 20 }} />
                    </div>
                ) }
            </header>
            <AssignmentContent />
        </div>
    )
}