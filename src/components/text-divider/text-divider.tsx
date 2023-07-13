import React, { CSSProperties, ReactNode } from 'react'
import { classes } from 'typestyle'
import { textDividerContainerClass, textDividerTextClass } from './style'



interface TextDividerProps extends React.HTMLProps<HTMLDivElement> {
    orientation?: 'left' | 'right' | 'center'
    // Only valid if orientation isn't center
    orientationMargin?: number
    innerStyle?: CSSProperties
    children: ReactNode
}

export const TextDivider = ({
    orientation='left',
    orientationMargin=0,
    innerStyle={},
    style={},
    children,
    ...props
}: TextDividerProps) => {
    const textStyle = orientation === 'left' ? {
        marginLeft: orientationMargin,
        paddingLeft: orientationMargin !== 0 ? 12 : 0,
        paddingRight: 12
    } : orientation === 'right' ? {
        marginRight: orientationMargin,
        paddingRight: orientationMargin !== 0 ? 12 : 0,
        paddingLeft: 12
    } : {
        paddingLeft: 12,
        paddingRight: 12
    }
    return (
        <div
            className={ classes(textDividerContainerClass, orientation) }
            style={{
                '--orientation-margin': `${ orientationMargin }px`,
                ...style
            } as any}
            { ...props }
        >
            <span
                className={ textDividerTextClass }
                style={{
                    ...textStyle,
                    ...innerStyle
                }}
            >
                { children }
            </span>
        </div>
    )
}