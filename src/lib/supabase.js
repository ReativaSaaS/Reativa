import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://rakskzfzmxloqiziwetu.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJha3NremZ6bXhsb3Fpeml3ZXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDA4OTQsImV4cCI6MjA5NDUxNjg5NH0.jEzeEnRxTIjcUq6RFXaAjhXVfbB8bhd6lvPHojhGeRw"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function register(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  })

  if (error) throw error

  if (data.user) {
    try {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: email,
        full_name: name
      })
    } catch (e) {
      console.warn('Profile might already exist from trigger')
    }
  }

  return data
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard'
    }
  })

  if (error) throw error
  return data
}

export async function loginWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin + '/dashboard'
    }
  })

  if (error) throw error
  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  window.location.href = '/'
}

export async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function requireAuth() {
  const session = await checkSession()
  if (!session) {
    window.location.href = '/login'
    return null
  }
  return session
}
