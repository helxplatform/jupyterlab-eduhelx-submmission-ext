import React, { createContext, useContext, ReactNode, ReactElement, useState, Fragment } from 'react'
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
    content?: ReactElement
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
        [key: string]: [CreateSnackbarProps, number]
    }>({})

    const createSnackbar: CreateSnackbar = (props: CreateSnackbarProps) => {
        props.duration = props.duration ?? 2500
        props.key = props.key ?? uuidv4()
        props.alignment = props.alignment ?? { vertical: 'bottom', horizontal: 'right' }
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
                [props.key!]: [props, Date.now()]
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
                    <div style={{ display: "flex", flexDirection: "column-reverse", position: "fixed", bottom: 24, right: 24 }}>
                        { Object.entries(snackbars).sort((a, b) => {
                            const [keyA, [propsA, timeA]] = a
                            const [keyB, [propsB, timeB]] = b
                            return timeB - timeA
                        }).map(([key, [props, time]]) => {
                            const { className, duration, alignment, content } = props
                            return (
                                <Snackbar
                                    key={ key }
                                    className={ className }
                                    open={ true }
                                    autoHideDuration={ duration }
                                    anchorOrigin={ alignment }
                                    onClose={ (_, reason) => reason !== "clickaway" && destroySnackbar(key) }
                                    style={{ marginTop: 8, position: "initial" }}
                                >
                                    { content }
                                </Snackbar>
                            )
                        }) }
                    </div>
                </Portal>
            </Fragment>
        </SnackbarContext.Provider>
    )
}
export const useSnackbar = () => useContext(SnackbarContext)