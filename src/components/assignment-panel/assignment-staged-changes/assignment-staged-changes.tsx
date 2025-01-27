import React, { useEffect, useMemo, useState } from 'react'
import { folderIcon, fileIcon } from '@jupyterlab/ui-components'
import { assignmentStagedChangesClass, assignmentStagedChangesFolderIconClass, largeBulletClass, modifiedTypeBadgeClass, showMoreBtnClass, stagedChangeListItemClass, stagedChangesListClass } from './style'
import { TextDivider } from '../../text-divider'
import { InfoTooltip } from '../../info-tooltip'
import { useAssignment } from '../../../contexts'
import { IStagedChange } from '../../../api/staged-change'

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
                    <span key={ 1 } style={{ fontWeight: 500 }}>+</span>,
                    "Added (untracked)",
                    "var(--md-green-500)"
                ]
            }
            case "M": {
                return [
                    <span key={ 2 } className={ largeBulletClass } style={{ backgroundColor: "var(--md-orange-500)" }} />,
                    "Modified",
                    undefined
                ]
            }
            case "D": {
                return [
                    // Could also use a minus and boost its font-size to like 18px and make its line-height to 1
                    // but its too small at normal font size
                    <span key={ 3 } style={{ fontWeight: 500}}>D</span>,
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
    const [showMore, setShowMore] = useState<boolean>(false)

    const stagedChangesSource = useMemo<IStagedChange[]>(() => {
        if (!assignment) return []
        return assignment.stagedChanges
    }, [assignment?.stagedChanges, showMore])

    const hideShowMoreButton = useMemo(() => !showMore && stagedChangesSource.length <= SHOW_MORE_CUTOFF, [showMore, stagedChangesSource])

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
                <h3 style={{ fontSize: 15, marginBottom: 12, fontWeight: 500 }}>
                    No Changes
                    <InfoTooltip
                        title="Files included in your .gitignore will not appear here."
                        trigger="hover"
                        placement="right"
                        iconProps={{ style: { fontSize: 13, marginLeft: 6, color: "var(--jp-content-font-color2)" } }}
                    />
                </h3>
                <p style={{ fontSize: 13, marginTop: 0 }}>
                    Files you&apos;ve changed since your last submission will appear here.
                </p>
            </div>
        </div>
    )
    return (
        <div className={ assignmentStagedChangesClass } { ...props }>
            {/* <TextDivider innerStyle={{ fontSize: 'var(--jp-ui-font-size2)' }} style={{ marginBottom: 4 }}>Unsubmitted changes</TextDivider> */}
            <div className={ stagedChangesListClass }>
            {
                stagedChangesSource.slice(0, showMore ? undefined : SHOW_MORE_CUTOFF).map((change, i) => (
                    <div key={ change.pathFromAssignmentRoot } className={ stagedChangeListItemClass }>
                        <div style={{ display: "flex", alignItems: "center", marginTop: i === 0 ? 4 : 0 }}>
                            { change.type === "directory" ? (
                                <folderIcon.react
                                    className={ assignmentStagedChangesFolderIconClass }
                                    tag="span"
                                /> 
                            ) : (
                                <fileIcon.react tag="span" />
                            ) }
                            <span style={{ marginLeft: 8 }}>
                                { !change.pathFromAssignmentRoot.startsWith("/") ? "/" : "" }
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