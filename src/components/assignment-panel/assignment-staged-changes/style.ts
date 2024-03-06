import { style } from 'typestyle'

export const assignmentStagedChangesClass = style({
    fontSize: 'var(--jp-ui-font-size1)',
    color: 'var(--jp-ui-font-color2)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 12px'
})

export const stagedChangesListClass = style({
    marginTop: 0,
    marginBottom: 12
})

export const stagedChangeListItemClass = (style as any)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
    
    "&:last-child": {
        marginBottom: 0
    }
})

export const modifiedTypeBadgeClass = style({
    width: 24,
    height: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
})

export const largeBulletClass = style({
    borderRadius: "50%",
    display: "inline-block",
    height: 6,
    width: 6
})

export const assignmentStagedChangesFolderIconClass = (style as any)({
    "& > svg > path": {
        fill: "rgba(0, 0, 0, 0) !important",
        stroke: "var(--jp-inverse-layout-color3)",
        strokeWidth: "2.5px"
    }
})