import React, { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { CircularProgress } from '@material-ui/core'
import { Popover, Tooltip } from 'antd'
import { ArrowBackSharp, SupervisorAccountOutlined, SyncOutlined } from '@material-ui/icons'
import {
    panelWrapperClass,
    panelHeaderClass,
    studentManagementPopoverOverlayClass
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
    const { course, students, assignment, triggerImmediateUpdate } = useAssignment()!
    
    const [syncLoading, setSyncLoading] = useState<boolean>(false)

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
            await syncToLMS()
            await triggerImmediateUpdate()
            snackbar.open({
                type: 'success',
                message: 'Successfully synced with LMS'
            })
        } catch (e: any) {
            snackbar.open({
                type: 'error',
                message: 'Failed to sync with LMS!'
            })
        }
        setSyncLoading(false)
    }, [triggerImmediateUpdate, snackbar])

    /** On page load, we want to `cd` to the repo root. */
    useEffect(() => {
        // console.log("CDing to repo root", repoRoot)
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
                    <Popover title={
                        <span style={{
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            textTransform: "uppercase"
                        }}>Students</span>
                    } content={
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                           { students.map((student) => (
                            <li key={ student.onyen }>
                                { student.name } ({ student.onyen })
                            </li>
                           )) } 
                        </ul>
                    } overlayClassName={ studentManagementPopoverOverlayClass }>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            { students.length } <SupervisorAccountOutlined style={{ fontSize: 20, marginLeft: 4 }} />
                        </div>
                    </Popover>
                ) }
                { students && (
                    <Tooltip  title={ !syncLoading ? "Immediately sync with LMS" : "Syncing..." }>
                        <div
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
                    </Tooltip>
                ) }
            </header>
            <AssignmentContent />
        </div>
    )
}