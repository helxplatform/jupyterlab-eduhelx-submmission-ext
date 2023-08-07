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

        if (!props.content) props.content = (
            <Alert
                variant="filled"
                severity={ props.type }
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