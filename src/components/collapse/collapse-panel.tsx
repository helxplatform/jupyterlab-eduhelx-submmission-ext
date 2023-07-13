import React, { ReactNode } from 'react'
import { collapsePanelContainerClass, collapsePanelHeaderClass } from './style'

export interface CollapsePanelProps extends React.HTMLProps<HTMLDivElement> {
    header: ReactNode
    expanded?: boolean
}

export const CollapsePanel: React.FC<CollapsePanelProps> = ({ header, expanded=false, ...other }: CollapsePanelProps) => {
    return (
        <div className={ collapsePanelContainerClass } { ...other } >
            <div className={ collapsePanelHeaderClass }>
                { header }
            </div>
        </div>
    )
}