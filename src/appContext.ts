import { createContext } from 'react'
import { Session } from '@supabase/supabase-js'
import { MessageType } from './api.js'

export const AppContext = createContext({
    appContext: {} as AppContextType,
    setAppContext: (obj: Partial<AppContextType>) => obj
})

// @ts-ignore
function setAppContext(
    new_ctx: Partial<AppContextType>,
    appContext: AppContextType,
    setter: React.Dispatch<React.SetStateAction<AppContextType>>
) {
    let ex_ctx = { ...appContext }
    Object.assign(ex_ctx, new_ctx)
    setter(ex_ctx)
    return new_ctx
}

export interface AppContextType {
    user: Session
    loading: boolean
    read: MessageType | null
}