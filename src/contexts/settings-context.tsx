import React, { createContext, useContext, ReactNode } from 'react'
import { IServerSettings } from '../api'

interface ISettingsProviderProps {
    settings: IServerSettings
    children?: ReactNode
}

export const SettingsContext = createContext<IServerSettings|undefined>(undefined)

export const SettingsProvider = ({ settings, children }: ISettingsProviderProps) => {
    return (
        <SettingsContext.Provider value={ settings }>
            { children }
        </SettingsContext.Provider>
    )
}
export const useSettingsContext = () => useContext(SettingsContext)