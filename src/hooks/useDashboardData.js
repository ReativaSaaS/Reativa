import { useState, useEffect, useCallback } from 'react'
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from '../lib/tasks'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../lib/goals'
import { getKanbanColumns, getKanbanCards, createKanbanColumn, createKanbanCard, updateKanbanCard, moveKanbanCard, deleteKanbanCard, deleteKanbanColumn } from '../lib/kanban'
import { getFinancialEntries, createFinancialEntry, deleteFinancialEntry, getFinancialSummary, getFinancialMonths } from '../lib/financial'
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../lib/team'

// TASKS HOOK
export function useTasks(userId) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    try { setTasks(await getTasks(userId)) } catch (e) { console.error('Tasks error:', e) } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  const add = async (task) => { const d = await createTask(userId, task); setTasks(prev => [...prev, d]); return d }
  const toggle = async (taskId, done) => { const d = await toggleTask(taskId, done); setTasks(prev => prev.map(t => t.id === taskId ? d : t)); return d }
  const update = async (taskId, updates) => { const d = await updateTask(taskId, updates); setTasks(prev => prev.map(t => t.id === taskId ? d : t)); return d }
  const remove = async (taskId) => { await deleteTask(taskId); setTasks(prev => prev.filter(t => t.id !== taskId)) }

  return { tasks, loading, refresh, add, toggle, update, remove }
}

// GOALS HOOK
export function useGoals(userId) {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    try { setGoals(await getGoals(userId)) } catch (e) { console.error('Goals error:', e) } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  const add = async (goal) => { const d = await createGoal(userId, goal); setGoals(prev => [...prev, d]); return d }
  const update = async (goalId, updates) => { const d = await updateGoal(goalId, updates); setGoals(prev => prev.map(g => g.id === goalId ? d : g)); return d }
  const remove = async (goalId) => { await deleteGoal(goalId); setGoals(prev => prev.filter(g => g.id !== goalId)) }

  return { goals, loading, refresh, add, update, remove }
}

// KANBAN HOOK
export function useKanban(userId) {
  const [columns, setColumns] = useState([])
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    try {
      const [cols, crds] = await Promise.all([getKanbanColumns(userId), getKanbanCards(userId)])
      setColumns(cols)
      setCards(crds)
    } catch (e) { console.error('Kanban error:', e) } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  const addColumn = async (col) => { const d = await createKanbanColumn(userId, col); setColumns(prev => [...prev, d]); return d }
  const removeColumn = async (colId) => { await deleteKanbanColumn(colId); setColumns(prev => prev.filter(c => c.id !== colId)); setCards(prev => prev.filter(c => c.column_id !== colId)) }
  const addCard = async (card) => { const d = await createKanbanCard(userId, card); setCards(prev => [...prev, d]); return d }
  const updateCard = async (cardId, updates) => { const d = await updateKanbanCard(cardId, updates); setCards(prev => prev.map(c => c.id === cardId ? d : c)); return d }
  const moveCard = async (cardId, newColId, newPos) => { const d = await moveKanbanCard(cardId, newColId, newPos); setCards(prev => prev.map(c => c.id === cardId ? d : c)); return d }
  const removeCard = async (cardId) => { await deleteKanbanCard(cardId); setCards(prev => prev.filter(c => c.id !== cardId)) }

  const getColumnCards = (colId) => cards.filter(c => c.column_id === colId).sort((a, b) => a.position - b.position)

  return { columns, cards, loading, refresh, addColumn, removeColumn, addCard, updateCard, moveCard, removeCard, getColumnCards }
}

// FINANCIAL HOOK
export function useFinancial(userId) {
  const [entries, setEntries] = useState([])
  const [months, setMonths] = useState([])
  const [summary, setSummary] = useState({ revenue: 0, expense: 0, profit: 0 })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    try {
      const [e, m, s] = await Promise.all([getFinancialEntries(userId), getFinancialMonths(userId), getFinancialSummary(userId)])
      setEntries(e)
      setMonths(m)
      setSummary(s)
    } catch (e) { console.error('Financial error:', e) } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  const addEntry = async (entry) => { const d = await createFinancialEntry(userId, entry); setEntries(prev => [d, ...prev]); refresh(); return d }
  const removeEntry = async (entryId) => { await deleteFinancialEntry(entryId); setEntries(prev => prev.filter(e => e.id !== entryId)); refresh() }

  return { entries, months, summary, loading, refresh, addEntry, removeEntry }
}

// TEAM HOOK
export function useTeam(userId) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    try { setMembers(await getTeamMembers(userId)) } catch (e) { console.error('Team error:', e) } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  const add = async (member) => { const d = await createTeamMember(userId, member); setMembers(prev => [...prev, d]); return d }
  const update = async (memberId, updates) => { const d = await updateTeamMember(memberId, updates); setMembers(prev => prev.map(m => m.id === memberId ? d : m)); return d }
  const remove = async (memberId) => { await deleteTeamMember(memberId); setMembers(prev => prev.filter(m => m.id !== memberId)) }

  return { members, loading, refresh, add, update, remove }
}
