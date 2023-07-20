import { style } from 'typestyle'

export const assignmentBucketContainerClass = (style as any)({
    '& .MuiExpansionPanelSummary-expandIcon': {
        paddingLeft: 6,
        paddingRight: 6
    }
})

export const assignmentListItemClass = (style as any)({
    '&:first-child': {
        paddingTop: '0 !important',
    },
    '&:first-child > .MuiListItemText-root': {
        marginTop: '0 !important'
    }
})

export const assignmentListHeaderClass = style({
    color: 'var(--jp-ui-font-color0)',
    fontSize: 13,
    fontWeight: 500
})

export const downloadAssignmentButtonClass = style({
    backgroundColor: 'var(--md-blue-500)',
    border: 0,
    borderRadius: 0,
    cursor: 'pointer',
    color: 'white',
    fontSize: 'var(--jp-ui-font-size1)',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
})