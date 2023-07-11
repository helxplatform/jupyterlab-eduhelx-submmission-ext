import React from 'react'
import {
    panelWrapperClass,
    panelHeaderClass
} from './style'
import { AssignmentContent } from './assignment-content'

interface IAssignmentPanelProps {
}

export const AssignmentPanel = ({}: IAssignmentPanelProps) => {
    return (
        <div className={ panelWrapperClass }>
            <header className={ panelHeaderClass }>EduHeLx Assignments</header>
            <AssignmentContent />
        </div>
    )
}