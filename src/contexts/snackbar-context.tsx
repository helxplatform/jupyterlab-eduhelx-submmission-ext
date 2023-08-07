import React, { createContext, useContext, ReactNode, useState, Fragment } from 'react'
import { Portal, Snackbar, SnackbarOrigin } from '@material-ui/core'
import { Alert, Color } from '@material-ui/lab'
import { v4 as uuidv4 } from 'uuid'

interface CreateSnackbarProps {
    key?: string
    className?: string
    duration?: number
    type?: Color
    message?: string
    alignment?: SnackbarOrigin
    // Override type/message
    content?: ReactNode
}

interface CreateSnackbar {
    (props: CreateSnackbarProps): string
}

interface ISnackbarContext {
    open: CreateSnackbar
    destroy: (key: string) => void
} 

interface ISnackbarProviderProps {
    children?: ReactNode
}

export const SnackbarContext = createContext<ISnackbarContext|undefined>(undefined)

export const SnackbarProvider = ({ children }: ISnackbarProviderProps) => {
    const [snackbars, setSnackbars] = useState<{
        [key: string]: CreateSnackbarProps
    }>({})

    const createSnackbar: CreateSnackbar = (props: CreateSnackbarProps) => {
        props.duration = props.duration ?? 2500
        props.key = props.key ?? uuidv4()
        props.alignment = props.alignment ?? { vertical: 'bottom', horizontal: 'right' }
        console.log(props, props.type)
        if (!props.content) props.content = (
            <Alert
                variant="filled"
                color={ props.type }
                style={{ 
                    // Bug with Mui, Paper class overrides color/severity class styles
                    backgroundColor: props.type === 'error' ? 'rgb(253, 236, 234)'
                        : props.type === 'info' ? 'rgb(232, 244, 253)'
                        : props.type === 'success' ? 'rgb(237, 247, 237)'
                        : props.type === 'warning' ? 'rgb(255, 248, 230)'
                        : undefined,
                    color: props.type === 'error' ? 'rgb(97, 26, 21)'
                        : props.type === 'info' ? 'rgb(13, 60, 97)'
                        : props.type === 'success' ? 'rgb(30, 70, 32)'
                        : props.type === 'warning' ? 'rgb(102, 77, 2)'
                        : undefined
                }}
                onClose={ () => destroySnackbar(props.key!) }
            >
                { props.message }
            </Alert>
        )
        setSnackbars((prevSnackbars) => ({
                ...prevSnackbars,
                [props.key!]: props
        }))
        return props.key
    }

    const destroySnackbar = (key: string) => {
        setSnackbars((prevSnackbars) => {
            const newSnackbars = { ...prevSnackbars }
            delete newSnackbars[key]
            return newSnackbars
        })
    }
    (window as any).open = createSnackbar
    
    return (
        <SnackbarContext.Provider value={{
            open: createSnackbar,
            destroy: destroySnackbar
        }}>
            <Fragment>
                { children }
                <Portal>
                    { Object.keys(snackbars).map((key) => {
                        const { className, duration, alignment, content } = snackbars[key]
                        return (
                            <Snackbar
                                key={ key }
                                className={ className }
                                open={ true }
                                autoHideDuration={ duration }
                                anchorOrigin={ alignment }
                                onClose={ () => destroySnackbar(key) }
                            >
                                { content }
                            </Snackbar>
                        )
                    }) }
                </Portal>
            </Fragment>
        </SnackbarContext.Provider>
    )
}
export const useSnackbar = () => useContext(SnackbarContext)