import { useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtimeClients(userId, onUpdate) {
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('clients-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'clients',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        onUpdate(payload)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, onUpdate])
}

export function useRealtimeAlerts(userId, onUpdate) {
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('alerts-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alerts',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        onUpdate(payload)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, onUpdate])
}

export function useRealtimeMessages(userId, onUpdate) {
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        onUpdate(payload)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, onUpdate])
}

export function useRealtimeCampaigns(userId, onUpdate) {
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('campaigns-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'campaigns',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        onUpdate(payload)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, onUpdate])
}
