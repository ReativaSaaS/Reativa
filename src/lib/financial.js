import { supabase } from './supabase'

export async function getFinancialEntries(userId, filters = {}) {
  let query = supabase
    .from('financial_entries')
    .select('*')
    .eq('user_id', userId)
    .order('entry_date', { ascending: false })

  if (filters.type) query = query.eq('type', filters.type)
  if (filters.category) query = query.eq('category', filters.category)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createFinancialEntry(userId, entry) {
  const { data, error } = await supabase
    .from('financial_entries')
    .insert({
      user_id: userId,
      description: entry.description,
      category: entry.category,
      category_color: entry.categoryColor,
      amount: entry.amount,
      type: entry.type,
      entry_date: entry.date || new Date().toISOString().split('T')[0]
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteFinancialEntry(entryId) {
  const { error } = await supabase.from('financial_entries').delete().eq('id', entryId)
  if (error) throw error
}

export async function getFinancialMonths(userId) {
  const { data, error } = await supabase
    .from('financial_months')
    .select('*')
    .eq('user_id', userId)
    .order('year', { ascending: true })
    .order('month', { ascending: true })
  if (error) throw error
  return data || []
}

export async function upsertFinancialMonth(userId, monthData) {
  const { data, error } = await supabase
    .from('financial_months')
    .upsert({
      user_id: userId,
      month: monthData.month,
      year: monthData.year,
      revenue: monthData.revenue,
      expense: monthData.expense
    }, { onConflict: 'user_id,month,year' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getFinancialSummary(userId) {
  const { data: entries, error } = await supabase
    .from('financial_entries')
    .select('amount, type')
    .eq('user_id', userId)

  if (error) throw error

  const revenue = entries?.filter(e => e.type === 'revenue').reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0
  const expense = entries?.filter(e => e.type === 'expense').reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0

  return { revenue, expense, profit: revenue - expense }
}
