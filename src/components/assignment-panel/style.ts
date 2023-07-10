import { style } from 'typestyle'

export const panelWrapperClass = (style as any)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: 'var(--jp-ui-font-color1)',
    fontSize: 'var(--jp-ui-font-size1)',
    background: 'var(--jp-layout-color1) !important',
    '&, & *': { boxSizing: 'border-box' } 
})

export const panelHeaderClass = style({
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    flex: '0 0 auto',
    fontSize: 'var(--jp-ui-font-size0)',
    fontWeight: 600,
    letterSpacing: 1,
    margin: 0,
    padding: '8px 12px',
    textTransform: 'uppercase'
})