import { style } from 'typestyle'

export const assignmentSubmissionsContainerClass = style({

})

export const assignmentSubmimssionsHeaderClass = style({
    margin: '0',
    marginBottom: '8px',
    padding: '0 12px',
    fontWeight: 600,
    color: 'var(--jp-ui-font-color0)',
    fontSize: 'var(--jp-ui-font-size2)'
})

export const noSubmissionsTextContainerClass = style({
    width: '100%',
    color: 'var(--jp-ui-font-color2)',
    fontSize: 'var(--jp-ui-font-size1)',
    lineHeight: 'var(--jp-content-line-height)',
    textAlign: 'left',
    padding: '0 12px'
})

export const assignmentsTableClass = (style as any)({
    '& th, & td': {
        height: 42,
        fontSize: 13,
    }
})

export const activateSubmissionButtonClass = style({
    fontSize: 13,
    backgroundColor: 'var(--jp-layout-color0)',
    color: 'var(--jp-ui-font-color0)',
    borderRadius: 3,
    border: '1px solid var(--jp-border-color2)',
    padding: '4px 10px',
    cursor: 'pointer'
})