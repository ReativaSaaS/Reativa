import { supabase } from './supabase'

export async function getTasks(userId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createTask(userId, task) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ user_id: userId, text: task.text, tag: task.tag, tag_color: task.tagColor, done: false, position: task.position || 0 })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTask(taskId, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleTask(taskId, done) {
  return updateTask(taskId, { done })
}

export async function deleteTask(taskId) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) throw error
}
