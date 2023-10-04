import '../lib/env.js'
import { createClient } from '@supabase/supabase-js'
import storage from '../lib/storageProvider.js'
const supabase = createClient(process.env['SUPABASE_URL']!, process.env['SUPABASE_ANON_KEY']!, { auth: { storage } })
const apiUrl = process.env['API_URL']!

export async function getUser() {
    return await supabase.auth.getSession()
}

export async function createLogin(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
    }
  })

  return { data, error }
}

export async function verify(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email'})

  if (!error && data.user) {
    supabase.from('users')
        .upsert({
            email: data.user.email,

        }, {
            onConflict: 'email'
        })
  }

  return { data, error }
}

export async function createUser() {
    let session = await getUser()
    let res = await fetch(apiUrl + '/user/create', {
        headers: {
            'Authorization': session.data.session?.access_token || ''
        },
        method: 'POST'
    })
    return await res.json()
}

export async function fetchCurrentUser() {
    let session = await getUser()
    let res = await fetch(apiUrl + '/user/me', {
        headers: {
            'Authorization': session.data.session?.access_token || ''
        },
        method: 'GET'
    })
    return await res.json() as ProfileType
}

export async function fetchMessageList(tag?: 'inbox'|'archived') {
    let session = await getUser()
    let res = await fetch(apiUrl + '/mail/list' + (tag ? `?tag=${tag}` : ''), {
        method: 'GET',
        headers: {
            'Authorization': session.data.session?.access_token || ''
        }
    })
    return await res.json() as ApiResponse<MessageType[]>
}

export async function archiveMessage(id: string) {
    let session = await getUser()
    let res = await fetch(apiUrl + '/mail/' + id, {
        headers: {
            'Authorization': session.data.session?.access_token || ''
        },
        method: 'PATCH',
        body: `{
            "action": "archive"
        }`
    })
    return await res.json()
}

export async function deleteMessage(id: string) {
    let session = await getUser()
    let res = await fetch(apiUrl + '/mail/' + id, {
        headers: {
            'Authorization': session.data.session?.access_token || ''
        },
        method: 'DELETE'
    })
    return await res.json()
}

export { supabase }

type ApiResponse<T> = {
    success: boolean
    data: T
}
export interface MessageType {
    id: string
    subject: string
    receivedAt: Date
    textSignedUrl: string
    htmlSignedUrl: string
    Publication: {
        id: string
        name?: string
        fromEmail: string
        logoUrl?: string
        subscribeUrl?: string
        description?: string
    }
}

export interface ProfileType {
    id: string
    email: string
    fwdAddress: string
    isProUntil: Date | null
}