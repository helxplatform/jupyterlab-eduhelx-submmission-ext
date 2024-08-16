import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Button } from 'antd'
import { folderIcon, fileIcon } from '@jupyterlab/ui-components'
import { assignmentStagedChangesClass, assignmentStagedChangesFolderIconClass, largeBulletClass, modifiedTypeBadgeClass, showMoreBtnClass, stagedChangeListItemClass, stagedChangesListClass } from './style'
import { TextDivider } from '../../text-divider'
import { InfoPopover, InfoTooltip } from '../../info-tooltip'
import { useAssignment, useCommands } from '../../../contexts'
import { IStagedChange } from '../../../api/staged-change'
import { capitalizedTitlePopoverOverlayClass } from '../style'

const SHOW_MORE_CUTOFF = Infinity

interface ModifiedTypeBadgeProps {
    modificationType: IStagedChange["modificationType"]
}

interface AssignmentStagedChangesProps extends React.HTMLAttributes<HTMLDivElement> {
}

const ModifiedTypeBadge = ({ modificationType }: ModifiedTypeBadgeProps) => {
    const [text, title, color] = useMemo(() => {
        switch (modificationType) {
            case "??": {
                return [
                    <span style={{ fontWeight: 500 }}>+</span>,
                    "Added (untracked)",
                    "var(--md-green-500)"
                ]
            }
            case "M": {
                return [
                    <span className={ largeBulletClass } style={{ backgroundColor: "var(--md-orange-500)" }} />,
                    "Modified",
                    undefined
                ]
            }
            case "D": {
                return [
                    // Could also use a minus and boost its font-size to like 18px and make its line-height to 1
                    // but its too small at normal font size
                    <span style={{ fontWeight: 500}}>D</span>,
                    "Deleted",
                    "var(--md-red-500)"
                ]
            }
            default: {
                return [
                    modificationType.slice(0, 3),
                    modificationType,
                    undefined
                ]
            }
        }
    }, [modificationType])

    return (
        <div
            className={ modifiedTypeBadgeClass }
            style={{ color }}
            title={ title }
        >
            { text }
        </div>
    )
}

export const AssignmentStagedChanges = ({ ...props }: AssignmentStagedChangesProps) => {
    const { assignment } = useAssignment()!
    const commands = useCommands()
    const [showMore, setShowMore] = useState<boolean>(false)

    const stagedChangesSource = useMemo<IStagedChange[]>(() => {
        if (!assignment) return []
        return assignment.stagedChanges
    }, [assignment?.stagedChanges, showMore])
    
    const hideShowMoreButton = useMemo(() => !showMore && stagedChangesSource.length <= SHOW_MORE_CUTOFF, [showMore, stagedChangesSource])

    const ignoredFilesInfoPopover = useMemo(() => {
        if (!assignment) return null
        return (
            <InfoPopover
                title={
                    <span>Ignored Files</span>
                }
                content={
                    assignment.ignoredFiles.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                        { assignment.ignoredFiles.map((fileName) => (
                            <li key={ fileName }>
                                { fileName }
                            </li>
                        )) } 
                        </ul>
                    ) : (
                        <span>No files are being ignored.</span>
                    )
                }
                overlayClassName={ capitalizedTitlePopoverOverlayClass }
                trigger="hover"
                placement="right"
                iconProps={{ style: { fontSize: 13, marginLeft: 6, color: "var(--jp-content-font-color2)" } }}
            />
        )
        }, [assignment])
    
    const openAssignmentGitignore = useCallback(() => {
        if (!commands || !assignment) return
        const gitignorePath = assignment.absoluteDirectoryPath + "/.gitignore"
        commands.execute('docmanager:open', { path: gitignorePath })
    }, [commands, assignment])
    
    useEffect(() => {
        if (stagedChangesSource.length <= SHOW_MORE_CUTOFF) setShowMore(false)
    }, [stagedChangesSource])

    if (stagedChangesSource.length === 0) return (
        <div className={ assignmentStagedChangesClass } { ...props }>
            <div style={{
                color: "var(--jp-content-font-color2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "8px 12px",
                paddingTop: 4
            }}>
                <h3 style={{ fontSize: 15, marginTop: 0, marginBottom: 12, fontWeight: 500 }}>
                    No Changes
                    { ignoredFilesInfoPopover }
                </h3>
                <p style={{ fontSize: 13, margin: 0 }}>
                    Files you've changed since your last submission will appear here.
                    Anything listed under your&nbsp;
                    <Button
                        type="link"
                        size="small"
                        onClick={ openAssignmentGitignore }
                        style={{ padding: 0 }}
                    >gitignore</Button>
                    &nbsp;is excluded from this list. 
                </p>
                <p style={{ fontSize: 13 }}>
                    Don't worry if you've only changed master notebooks, you can still submit and
                    the student version will be generated and uploaded upon submission.
                </p>
            </div>
        </div>
    )
    return (
        <div className={ assignmentStagedChangesClass } { ...props }>
            <TextDivider innerStyle={{ fontSize: 15 }} style={{ marginBottom: 8 }}>
                Staged changes
                { ignoredFilesInfoPopover }
            </TextDivider>
            <div className={ stagedChangesListClass }>
            {
                stagedChangesSource.slice(0, showMore ? undefined : SHOW_MORE_CUTOFF).map((change) => (
                    <div className={ stagedChangeListItemClass }>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            { change.type === "directory" ? (
                                <folderIcon.react
                                    className={ assignmentStagedChangesFolderIconClass }
                                    tag="span"
                                /> 
                            ) : (
                                <fileIcon.react tag="span" />
                            ) }
                            <span style={{ marginLeft: 8 }}>
                                { change.pathFromAssignmentRoot }
                                { change.type === "directory" && !change.pathFromAssignmentRoot.endsWith("/") ? "/*" : "" }
                            </span>
                        </div>
                        <ModifiedTypeBadge modificationType={ change.modificationType } />
                    </div>
                ))
            }
            { assignment && !hideShowMoreButton && (
                <button
                    className={ showMoreBtnClass }
                    onClick={ () => setShowMore(!showMore) }
                    style={{ marginTop: 2 }}
                >
                    { showMore ? "Show less" : `Show ${ stagedChangesSource.length - SHOW_MORE_CUTOFF  } more` }
                </button>
            ) }
            </div>
        </div>
    )
}