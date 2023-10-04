import { createContext } from 'react'
import { Session } from '@supabase/supabase-js'
import { MessageType, ProfileType } from './api.js'

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
    profile: ProfileType
    loading: boolean
    unmount: boolean
    list: { inbox: MessageType[], archived: MessageType[] }
    read: MessageType | null
}