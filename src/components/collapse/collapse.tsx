import React, { ReactNode } from 'react'
import { CollapsePanelProps } from './collapse-panel'
import { collapseContainerClass } from './style'

interface CollapseProps extends React.HTMLProps<HTMLDivElement> {
    children: React.ReactElement<CollapsePanelProps>[] | React.ReactElement<CollapsePanelProps>
}

export const Collapse = ({ children, ...other }: CollapseProps) => {
    if (!Array.isArray(children)) children = [children]
    return (
        <div className={ collapseContainerClass } { ...other }>
            { children }
        </div>
    )
}