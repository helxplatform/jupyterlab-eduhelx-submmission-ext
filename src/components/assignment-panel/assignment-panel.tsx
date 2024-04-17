import React, { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { CircularProgress } from '@material-ui/core'
import { ArrowBackSharp, SupervisorAccountOutlined, SyncOutlined } from '@material-ui/icons'
import {
    panelWrapperClass,
    panelHeaderClass
} from './style'
import { AssignmentContent } from './assignment-content'
import { useAssignment, useCommands, useSettings, useSnackbar } from '../../contexts'
import { syncToLMS } from '../../api'

interface IAssignmentPanelProps {
}

export const AssignmentPanel = ({}: IAssignmentPanelProps) => {
    const commands = useCommands()!
    const snackbar = useSnackbar()!
    const { repoRoot } = useSettings()!
    const { course, students, assignment } = useAssignment()!

    const [syncLoading, setSyncLoading] = useState<boolean>(false);
    (window as any).x = setSyncLoading
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

    const doSync = useCallback(async () => {
        setSyncLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000))
            await syncToLMS()
        } catch (e: any) {
            snackbar.open({
                type: 'error',
                message: 'Failed to sync with LMS!'
            })
        }
        setSyncLoading(false)
    }, [snackbar])

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
                <div style={{ flexGrow: 1 }} />
                { students && (
                    <div style={{ display: "flex", alignItems: "center" }} title="Immediately sync to servers">
                        { students.length } <SupervisorAccountOutlined style={{ fontSize: 20, marginLeft: 4 }} />
                    </div>
                ) }
                { students && (
                    <div
                        title={ !syncLoading ? "Immediately sync with LMS" : "Syncing..." }
                        style={{ display: "flex", alignItems: "center", marginLeft: 8, cursor: !syncLoading ? "pointer" : "default" }}
                        onClick={ !syncLoading ? doSync : undefined }
                    >
                        { !syncLoading ? (
                            <SyncOutlined style={{ fontSize: 20 }} />
                        ) : (
                            <div style={{ width: 20, height: 20, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <CircularProgress color="inherit" size={ 16 } />
                            </div>
                        ) }
                    </div>
                ) }
            </header>
            <AssignmentContent />
        </div>
    )
}