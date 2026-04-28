import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diisi di file .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── AUTH ──────────────────────────────────────────

export async function signUp({ name, email, password, role, grade }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role, grade } },
  });
  if (error) throw error;
  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ── PROFILE ───────────────────────────────────────

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── COURSES ───────────────────────────────────────

export async function getCourses({ subject, level } = {}) {
  let query = supabase
    .from("courses")
    .select("*, subjects(label, icon, color)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (subject && subject !== "semua") query = query.eq("subject_id", subject);
  if (level   && level   !== "Semua") query = query.eq("level", level);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getCourse(courseId) {
  const { data, error } = await supabase
    .from("courses")
    .select("*, subjects(label, icon, color), episodes(*)")
    .eq("id", courseId)
    .single();
  if (error) throw error;
  return data;
}

// ── PROGRESS ──────────────────────────────────────

export async function getUserProgress(userId) {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*, courses(id, title, subject_id, subjects(label, color))")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function upsertProgress(userId, courseId, { progressPct, episodesDone, lastEpisodeId }) {
  const { data, error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id:         userId,
        course_id:       courseId,
        progress_pct:    progressPct,
        episodes_done:   episodesDone,
        last_episode_id: lastEpisodeId,
        updated_at:      new Date().toISOString(),
        ...(progressPct === 100 ? { completed_at: new Date().toISOString() } : {}),
      },
      { onConflict: "user_id,course_id" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── QUIZ ──────────────────────────────────────────

export async function saveQuizResult(userId, courseId, { score, total, pct }) {
  const xpEarned = pct >= 80 ? 50 : pct >= 60 ? 30 : 10;
  const { data, error } = await supabase
    .from("quiz_results")
    .insert({
      user_id:         userId,
      course_id:       courseId,
      score,
      total_questions: total,
      pct,
      xp_earned:       xpEarned,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}