import React, { createContext, useContext, ReactNode } from 'react'
import { CommandRegistry } from '@lumino/commands'

interface ICommandsProviderProps {
    commands: CommandRegistry
    children?: ReactNode
}

export const CommandsContext = createContext<CommandRegistry|undefined>(undefined)

export const CommandsProvider = ({ commands, children }: ICommandsProviderProps) => {
    return (
        <CommandsContext.Provider value={ commands }>
            { children }
        </CommandsContext.Provider>
    )
}
export const useCommands = () => useContext(CommandsContext)