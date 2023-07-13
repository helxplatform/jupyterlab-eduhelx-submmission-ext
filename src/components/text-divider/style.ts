import { style } from 'typestyle'

export const textDividerContainerClass = (style as any)({
    display: 'flex',
    alignItems: 'center',
    color: 'var(--jp-ui-font-color0)',
    fontWeight: 500,
    textAlign: 'center',

    '&::before, &::after': {
        content: '""',
        position: 'relative',
        width: '100%',
        borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
        transform: 'translateY(50%)'
    },
    // Left-align adjustments
    '&.left::before': {
        width: 'var(--orientation-margin)'
    },
    // Right-align adjustmments'
    '&.right::after': {
        width: 'var(--orientation-margin)'
    }

})

export const textDividerTextClass = style({
    display: 'inline-block'
})