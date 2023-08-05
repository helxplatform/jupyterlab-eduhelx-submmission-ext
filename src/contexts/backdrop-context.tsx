import React, { createContext, useContext, ReactNode, useState } from 'react'
import { CircularProgress, Modal } from '@material-ui/core'

interface IBackdropContext {
    setLoading: (loading: boolean) => void
}

interface IBackdropProviderProps {
    children?: ReactNode
}

export const BackdropContext = createContext<IBackdropContext|undefined>(undefined)

export const BackdropProvider = ({ children }: IBackdropProviderProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    return (
        <BackdropContext.Provider value={{
            setLoading
        }}>
            { children }
            <Modal
                open={ loading }
                disableAutoFocus
                disableEnforceFocus
            >
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    color: 'var(--jp-ui-inverse-font-color0)',
                    textAlign: 'center'
                }}>
                    <CircularProgress color="inherit" />
                </div>
            </Modal>
        </BackdropContext.Provider>
    )
}
export const useBackdrop = () => useContext(BackdropContext)