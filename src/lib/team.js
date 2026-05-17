import { supabase } from './supabase'

export async function getTeamMembers(userId) {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createTeamMember(userId, member) {
  const { data, error } = await supabase
    .from('team_members')
    .insert({
      user_id: userId,
      name: member.name,
      role: member.role,
      initials: member.initials,
      gradient: member.gradient,
      status: member.status || 'offline',
      tag: member.tag,
      tag_color: member.tagColor,
      email: member.email,
      position: member.position || 0
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTeamMember(memberId, updates) {
  const { data, error } = await supabase
    .from('team_members')
    .update(updates)
    .eq('id', memberId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTeamMember(memberId) {
  const { error } = await supabase.from('team_members').delete().eq('id', memberId)
  if (error) throw error
}
