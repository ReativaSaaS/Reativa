import { useState, useEffect, useCallback } from 'react'
import { getDashboardMetrics, generateInsights } from '../lib/metrics'
import { getClients, getClientsByStatus } from '../lib/clients'
import { getUnreadAlerts, getAlertCount, generateAlerts } from '../lib/alerts'
import { getCampaigns, getCampaignStats } from '../lib/campaigns'

export function useMetrics(userId) {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    try {
      const data = await getDashboardMetrics(userId)
      setMetrics(data)
    } catch (e) {
      console.error('Metrics error:', e)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  return { metrics, loading, refresh }
}

export function useClients(userId, filters = {}) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    try {
      const data = await getClients(userId, filters)
      setClients(data)
    } catch (e) {
      console.error('Clients error:', e)
    } finally {
      setLoading(false)
    }
  }, [userId, JSON.stringify(filters)])

  useEffect(() => { refresh() }, [refresh])

  return { clients, loading, refresh }
}

export function useAlerts(userId) {
  const [alerts, setAlerts] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    try {
      await generateAlerts(userId)
      const [alertData, alertCount] = await Promise.all([
        getUnreadAlerts(userId),
        getAlertCount(userId)
      ])
      setAlerts(alertData)
      setCount(alertCount)
    } catch (e) {
      console.error('Alerts error:', e)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  return { alerts, count, loading, refresh }
}

export function useCampaigns(userId) {
  const [campaigns, setCampaigns] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    try {
      const [campaignData, statsData] = await Promise.all([
        getCampaigns(userId),
        getCampaignStats(userId)
      ])
      setCampaigns(campaignData)
      setStats(statsData)
    } catch (e) {
      console.error('Campaigns error:', e)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  return { campaigns, stats, loading, refresh }
}

export function useInsights(userId) {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    try {
      const data = await generateInsights(userId)
      setInsights(data)
    } catch (e) {
      console.error('Insights error:', e)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  return { insights, loading, refresh }
}
