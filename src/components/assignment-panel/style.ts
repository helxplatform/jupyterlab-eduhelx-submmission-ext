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
    display: 'flex',
    alignItems: 'center',
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    flex: '0 0 auto',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 1,
    margin: 0,
    // It appears slightly off-center vertically, so this is just a small adjustment to fix that.
    marginTop: 2,
    padding: '8px 12px',
    textTransform: 'uppercase'
})