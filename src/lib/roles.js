import { supabase } from './supabase'

// ── MENTOR ────────────────────────────────────────

export async function submitMentorApplication({ subject, experience, motivation, whatsapp, location }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Harus login dulu')

  // Cek sudah pernah apply belum
  const { data: existing } = await supabase
    .from('mentor_applications')
    .select('id, status')
    .eq('user_id', user.id)
    .order('applied_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing?.status === 'pending') {
    throw new Error('Permohonan kamu sedang dalam review. Tunggu konfirmasi admin.')
  }
  if (existing?.status === 'approved') {
    throw new Error('Kamu sudah menjadi mentor!')
  }

  const { data, error } = await supabase
    .from('mentor_applications')
    .insert({ user_id: user.id, subject, experience, motivation, whatsapp, location })
    .select()
    .single()

  if (error) throw error

  // Update profile: tandai sedang pending
  await supabase
    .from('profiles')
    .update({
      mentor_status: 'pending',
      mentor_subject: subject,
      mentor_bio: motivation,
      mentor_experience: experience,
      mentor_whatsapp: whatsapp,
      mentor_location: location,
      mentor_applied_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  return data
}

export async function getMentorApplicationStatus(userId) {
  const { data } = await supabase
    .from('mentor_applications')
    .select('status, applied_at, admin_note')
    .eq('user_id', userId)
    .order('applied_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}

// ── ORANG TUA ─────────────────────────────────────

export async function connectParentToChild(inviteCode) {
  const { data, error } = await supabase
    .rpc('connect_parent_to_child', { code: inviteCode.trim().toUpperCase() })
  if (error) throw error
  return data
}

export async function getMyChildren(parentId) {
  const { data, error } = await supabase
    .from('parent_child')
    .select(`
      child_id,
      connected_at,
      profiles!parent_child_child_id_fkey (
        id, name, email, level_num, level_name, xp, streak,
        school, grade, invite_code
      )
    `)
    .eq('parent_id', parentId)
  if (error) throw error
  return data?.map(d => ({ ...d.profiles, connected_at: d.connected_at })) || []
}

export async function getChildProgress(childId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      progress_pct, episodes_done, updated_at, completed_at,
      courses (id, title, subject_id, episode_count,
        subjects (label, color)
      )
    `)
    .eq('user_id', childId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getChildActivity(childId, limit = 10) {
  const { data, error } = await supabase
    .from('episode_completions')
    .select(`
      completed_at,
      episodes (title, duration_text,
        courses (title, subject_id)
      )
    `)
    .eq('user_id', childId)
    .order('completed_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function getChildInviteCode(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('invite_code')
    .eq('id', userId)
    .single()
  return data?.invite_code
}