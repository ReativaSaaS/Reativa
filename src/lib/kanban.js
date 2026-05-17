import { supabase } from './supabase'

export async function getKanbanColumns(userId) {
  const { data, error } = await supabase
    .from('kanban_columns')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createKanbanColumn(userId, column) {
  const { data, error } = await supabase
    .from('kanban_columns')
    .insert({ user_id: userId, title: column.title, color: column.color, position: column.position || 0 })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateKanbanColumn(columnId, updates) {
  const { data, error } = await supabase
    .from('kanban_columns')
    .update(updates)
    .eq('id', columnId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteKanbanColumn(columnId) {
  const { error } = await supabase.from('kanban_columns').delete().eq('id', columnId)
  if (error) throw error
}

export async function getKanbanCards(userId) {
  const { data, error } = await supabase
    .from('kanban_cards')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createKanbanCard(userId, card) {
  const { data, error } = await supabase
    .from('kanban_cards')
    .insert({
      user_id: userId,
      column_id: card.columnId,
      title: card.title,
      description: card.description,
      tag: card.tag,
      tag_color: card.tagColor,
      avatars: card.avatars || [],
      date_text: card.date,
      urgent: card.urgent || false,
      done: card.done || false,
      position: card.position || 0
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateKanbanCard(cardId, updates) {
  const { data, error } = await supabase
    .from('kanban_cards')
    .update(updates)
    .eq('id', cardId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function moveKanbanCard(cardId, newColumnId, newPosition) {
  return updateKanbanCard(cardId, { column_id: newColumnId, position: newPosition })
}

export async function deleteKanbanCard(cardId) {
  const { error } = await supabase.from('kanban_cards').delete().eq('id', cardId)
  if (error) throw error
}
