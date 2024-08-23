import { style } from 'typestyle'

export const assignmentInfoClass = style({
    fontSize: 'var(--jp-ui-font-size1)',
    color: 'var(--jp-ui-font-color2)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 12px'
})

export const assignmentNameClass = style({
    flex: '0 0 auto',
    color: 'var(--jp-ui-font-color1)',
    fontSize: 'var(--jp-ui-font-size3)',
    fontWeight: 600,
    marginTop: 6,
    padding: '8px 0',
    marginBottom: 0,
    paddingBottom: 0
})

export const assignmentInfoSectionClass = (style as any)({
    color: 'var(--jp-ui-font-color1)',
    marginBottom: 16,
    '&:last-child': {
        marginBottom: 8
    },
    '& > *': {
        fontSize: 14
    },
    '& > *:first-child': {
        fontSize: 12
    }
})

export const assignmentInfoSectionHeaderClass = style({
    margin: 0,
    marginBottom: 4,
    fontWeight: 600,
})

export const assignmentInfoSectionWarningClass = style({
    color: "var(--jp-warn-color-normal)"
})

export const tagClass = style({
    height: "auto",
    // border: "1px solid #d9d9d9",
    borderRadius: 2,
    display: "inline-block",
    fontSize: 12,
    lineHeight: "20px",
    padding: "0 7px",
    whiteSpace: "nowrap"
})
