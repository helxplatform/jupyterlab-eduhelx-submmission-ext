import { style } from 'typestyle'

export const containerClass = style({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '13px 11px 4px 11px',
})

export const textContainerClass = style({
    width: '100%',
    fontSize: 'var(--jp-ui-font-size1)',
    lineHeight: 'var(--jp-content-line-height)',
    textAlign: 'left',
})

export const openFileBrowserButtonClass = style({
    backgroundColor: 'var(--md-blue-500)',
    border: 0,
    borderRadius: 3,
    cursor: 'pointer',
    color: 'white',
    fontSize: 'var(--jp-ui-font-size1)',
    height: 28,
    margin: '8px 0',
    width: 200,
})

export const warningTextContainerClass = style({
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--jp-warn-color0)',
    margin: '8px 0'
})