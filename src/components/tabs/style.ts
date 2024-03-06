import { style } from 'typestyle'

export const tabsClass = style({

})

export const tabsHeaderClass = style({
    display: 'flex',
    alignItems: 'center',
    color: 'var(--jp-ui-font-color0)',
    position: 'relative',
    padding: 2,
    marginBottom: 8
})

export const tabsHeaderTabClass = (style as any)({
    fontSize: 15,
    fontWeight: 500,
    padding: '8px',
    borderRadius: 4,
    textAlign: 'center',
    cursor: 'pointer',
    border: 'none !important',
})

export const tabsHeaderTabActiveClass = (style as any)({
    position: "relative",
    color: "var(--jp-ui-font-color0)",
    border: "2px solid var(--jp-border-color2)",
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,

    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '100%',
        width: '100%',
        borderBottom: '2.5px solid #1890ff',
    },

    '&:first-child': {
        borderLeftWidth: 0,
        borderTopLeftRadius: 0
    },
    '&:last-child': {
        borderRightWidth: 0,
        borderTopRightRadius: 0
    }
})

export const tabsHeaderTabInactiveClass = (style as any)({
    position: "relative",
    color: "var(--jp-ui-font-color2)",

    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '100%',
        width: '100%',
        // borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
        border: 'none !important'
    }
})