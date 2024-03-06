import React, { ReactNode, useMemo, useState } from 'react'
import { classes } from 'typestyle'
import { tabsClass, tabsHeaderClass, tabsHeaderTabActiveClass, tabsHeaderTabClass, tabsHeaderTabInactiveClass } from './style'

interface TabItem {
    key: string | number
    label: ReactNode
    content: ReactNode
    containerProps?: React.HTMLAttributes<HTMLSpanElement>
}

interface TabItemProps extends React.HTMLAttributes<HTMLSpanElement> {
    tab: TabItem
    active: boolean
}

interface TabsHeaderProps {
    tabs: TabItem[],
    activeTabKey: string | number,
    onChange: (tabKey: string | number) => void
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    tabs: TabItem[]
    defaultActiveTabKey?: string | number
}

const TabItem = ({ tab, active, ...props }: TabItemProps) => {
    return (
        <span
            key={ tab.key }
            className={ classes(tabsHeaderTabClass, active ? tabsHeaderTabActiveClass : tabsHeaderTabInactiveClass) }
            { ...(tab.containerProps ?? {}) }
            { ...props }
        >
            { tab.label }
        </span>
    )
}

const TabsHeader = ({ tabs, activeTabKey, onChange }: TabsHeaderProps) => {
    return (
        <div className={ tabsHeaderClass }>
            { tabs.map((tab) => (
                <TabItem
                    tab={ tab }
                    active={ tab.key === activeTabKey }
                    onClick={ () => onChange(tab.key) }
                />
            )) }
        </div>
    )
}

export const Tabs = ({ tabs, defaultActiveTabKey, ...props }: TabsProps) => {
    const [activeTabKey, setActiveTabKey] = useState<string|number>(defaultActiveTabKey ?? tabs[0].key)
    const activeTab = useMemo<TabItem|undefined>(() => tabs.find((tab) => tab.key === activeTabKey), [tabs, activeTabKey])

    return (
        <div className={ tabsClass } { ...props }>
            <TabsHeader
                tabs={ tabs }
                activeTabKey={ activeTabKey }
                onChange={ setActiveTabKey }
            />
            { activeTab?.content }
        </div>
    )
}