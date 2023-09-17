import { createClient } from '@supabase/supabase-js'
import storage from './storageProvider.js'
const supabase = createClient(process.env['SUPABASE_URL']!, process.env['SUPABASE_ANON_KEY']!, { auth: { storage } })


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

  return { data, error }
}
