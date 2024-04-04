import { style } from 'typestyle'

export const submitFormContainerClass = style({
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 8px',
    borderTop: 'var(--jp-border-width) solid var(--jp-border-color2)'
})

export const submitRootClass = style({
    color: 'var(--jp-ui-font-color1) !important',
    fontSize: 'var(--jp-ui-font-size1) !important',
    fontFamily: 'var(--jp-ui-font-family) !important',
    backgroundColor: 'var(--jp-layout-color1) !important'
})

export const summaryClass = style({
    minHeight: '2em',
    resize: 'vertical',
    alignItems: 'flex-start',

    marginBottom: '1em',
    padding: 'var(--jp-code-padding)',

    outline: 'none',
    overflowX: 'auto',

    border: 'var(--jp-border-width) solid var(--jp-border-color2)',
    borderRadius: 3,

    $nest: {
        '&.Mui-error': {
            border: 'calc(2 * var(--jp-border-width)) solid var(--jp-error-color1)'
        }
    }
})

export const descriptionClass = style({
    marginBottom: '1em',
    padding: 'var(--jp-code-padding)',
    paddingLeft: '5px !important',
    paddingRight: '5px !important',

    outline: 'none',
    overflowX: 'auto',
    resize: 'none',

    border: 'var(--jp-border-width) solid var(--jp-border-color2)',
    borderRadius: 3,

    $nest: {
        '&>*::placeholder': {
            color: 'var(--jp-ui-font-color3)'
        },
        '&>*::-webkit-input-placeholder': {
            color: 'var(--jp-ui-font-color3)'
        },
        '&>*::-moz-placeholder': {
            color: 'var(--jp-ui-font-color3)'
        },
        '&>*::-ms-input-placeholder': {
            color: 'var(--jp-ui-font-color3)'
        }
    }
})

export const activeStyle = style({
    outline: 'none',
    border: 'var(--jp-border-width) solid var(--jp-brand-color1)'
})

export const disabledStyle = style({
    cursor: 'not-allowed !important',
    color: 'var(--jp-ui-font-color2) !important',
    backgroundColor: 'var(--jp-layout-color3) !important',
    pointerEvents: 'auto !important' as any
});