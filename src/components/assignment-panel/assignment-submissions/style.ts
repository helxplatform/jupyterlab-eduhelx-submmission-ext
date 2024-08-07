import { style } from 'typestyle'

export const assignmentSubmissionsContainerClass = style({
    display: 'flex',
    flexDirection: 'column'
})

export const assignmentSubmissionsHeaderClass = style({
    margin: '0',
    marginBottom: '2px',
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
    padding: '0 12px',
    flexGrow: 1
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

export const assignmentsListClass = (style as any)({
    flexGrow: 1,
    height: 0,
    overflowY: 'auto',
    padding: 0,
    /** Adjusting clashing styles caused by using accordion summaries as ListItem components */
    '& .MuiExpansionPanel-root, & .MuiExpansionPanel-root.Mui-expanded': {
        boxShadow: 'none',
        margin: 0,
    },
    '& .MuiExpansionPanel-root::before, & > div.MuiExpansionPanel-root.Mui-expanded::before': {
        top: -1,
        left: 0,
        right: 0,
        height: 1,
        content: '""',
        opacity: 1,
        position: 'absolute',
        display: 'block !important'
    },
    '& .MuiExpansionPanel-root:first-child::before, & > div.MuiExpansionPanel-root.Mui-expanded:first-child::before': {
        display: 'none !important'
    },
    '& .MuiExpansionPanelSummary-root, & .MuiExpansionPanelSummary-root.Mui-expanded': {
        padding: 0,
        minHeight: 'unset'
    },
    '& .MuiExpansionPanelSummary-content, & .MuiExpansionPanelSummary-content.Mui-expanded': {
        margin: 0
    },
    '& .MuiListItem-root': {
        paddingLeft: 12,
        paddingRight: 12
    },
    '& .MuiExpansionPanelSummary-expandIcon': {
        marginRight: 0
    },
    '& .MuiExpansionPanelDetails-root': {
        paddingLeft: 12,
        paddingRight: 12
    },
    '& .MuiExpansionPanelDetails-root > .MuiCard-root': {
        borderWidth: 0,
        borderLeftWidth: '2px !important',
        // So that the border aligns with the assignment number,
        // and the text aligns with the commit summary
        paddingLeft: 22,
        marginLeft: 8,
        borderRadius: 0
    },
    '& .MuiExpansionPanelDetails-root > .MuiCard-root > .MuiCardContent-root': {
        paddingLeft: 0
    }
})