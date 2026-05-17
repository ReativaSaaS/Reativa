import { supabase } from './supabase'

export async function getGoals(userId) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createGoal(userId, goal) {
  const { data, error } = await supabase
    .from('goals')
    .insert({ user_id: userId, name: goal.name, target: goal.target, current_value: goal.currentValue, percentage: goal.percentage, color: goal.color, position: goal.position || 0 })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateGoal(goalId, updates) {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteGoal(goalId) {
  const { error } = await supabase.from('goals').delete().eq('id', goalId)
  if (error) throw error
}
