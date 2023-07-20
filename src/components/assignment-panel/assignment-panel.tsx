import React, { Fragment, ReactNode, useMemo } from 'react'
import { ArrowBackSharp } from '@material-ui/icons'
import {
    panelWrapperClass,
    panelHeaderClass
} from './style'
import { AssignmentContent } from './assignment-content'
import { useAssignment, useCommands } from '../../contexts'

interface IAssignmentPanelProps {
}

export const AssignmentPanel = ({}: IAssignmentPanelProps) => {
    const commands = useCommands()!
    const { course, assignment } = useAssignment()!
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
            </header>
            <AssignmentContent />
        </div>
    )
}