import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function VideoPage({ onNavigate, courseId }) {
  const { user } = useAuth();

  const [course,     setCourse]     = useState(null);
  const [episodes,   setEpisodes]   = useState([]);
  const [activeEp,   setActiveEp]   = useState(null);
  const [doneEpIds,  setDoneEpIds]  = useState(new Set());
  const [progress,   setProgress]   = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [liked,      setLiked]      = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [completing, setCompleting] = useState(false);

  // ── ambil data kursus + episode ──────────────
  useEffect(() => {
    if (courseId) fetchCourse();
    else fetchFirstCourse(); // fallback: ambil kursus pertama
  }, [courseId]);

  // ── ambil episode yang sudah selesai user ────
  useEffect(() => {
    if (user && episodes.length > 0) fetchDoneEpisodes();
  }, [user, episodes]);

  async function fetchFirstCourse() {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*, subjects(label, icon, color)")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (error) throw error;
      setCourse(data);
      fetchEpisodes(data.id);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  async function fetchCourse() {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*, subjects(label, icon, color)")
        .eq("id", courseId)
        .single();
      if (error) throw error;
      setCourse(data);
      fetchEpisodes(data.id);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  async function fetchEpisodes(cId) {
    try {
      const { data, error } = await supabase
        .from("episodes")
        .select("*")
        .eq("course_id", cId)
        .order("order_num", { ascending: true });
      if (error) throw error;
      setEpisodes(data || []);
      if (data && data.length > 0) setActiveEp(data[0]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDoneEpisodes() {
    if (!user || !course) return;
    const { data } = await supabase
      .from("episode_completions")
      .select("episode_id")
      .eq("user_id", user.id)
      .in("episode_id", episodes.map(e => e.id));

    const doneSet = new Set((data || []).map(d => d.episode_id));
    setDoneEpIds(doneSet);

    // hitung progress
    const pct = episodes.length > 0
      ? Math.round((doneSet.size / episodes.length) * 100)
      : 0;
    setProgress(pct);
  }

  // ── tandai episode selesai ───────────────────
  async function markDone() {
    if (!user || !activeEp || completing) return;
    setCompleting(true);
    try {
      // simpan ke episode_completions
      await supabase
        .from("episode_completions")
        .upsert(
          { user_id: user.id, episode_id: activeEp.id },
          { onConflict: "user_id,episode_id" }
        );

      const newDone = new Set([...doneEpIds, activeEp.id]);
      setDoneEpIds(newDone);
      const pct = Math.round((newDone.size / episodes.length) * 100);
      setProgress(pct);

      // update user_progress
      await supabase
        .from("user_progress")
        .upsert(
          {
            user_id:         user.id,
            course_id:       course.id,
            progress_pct:    pct,
            episodes_done:   newDone.size,
            last_episode_id: activeEp.id,
            updated_at:      new Date().toISOString(),
            ...(pct === 100 ? { completed_at: new Date().toISOString() } : {})
          },
          { onConflict: "user_id,course_id" }
        );

      // tambah XP ke profil
      const xp = activeEp.xp_reward || 20;
      const { data: prof } = await supabase
        .from("profiles")
        .select("xp")
        .eq("id", user.id)
        .single();
      if (prof) {
        await supabase
          .from("profiles")
          .update({ xp: (prof.xp || 0) + xp })
          .eq("id", user.id);
      }
    } catch (e) {
      console.error("Gagal simpan progress:", e.message);
    } finally {
      setCompleting(false);
    }
  }

  function goNextEp() {
    const idx = episodes.findIndex(e => e.id === activeEp?.id);
    if (idx < episodes.length - 1) {
      setActiveEp(episodes[idx + 1]);
      setIsPlaying(false);
    }
  }

  const allDone     = episodes.length > 0 && doneEpIds.size === episodes.length;
  const isActiveDone = activeEp ? doneEpIds.has(activeEp.id) : false;
  const activeIdx   = episodes.findIndex(e => e.id === activeEp?.id);
  const subjectMeta = {
    matematika: "bg-violet-100 text-violet-800",
    ipa:        "bg-emerald-100 text-emerald-800",
    coding:     "bg-amber-100 text-amber-800",
    literasi_digital:    "bg-pink-100 text-pink-800",
    bahasa:     "bg-sky-100 text-sky-800",
    ips:        "bg-orange-100 text-orange-800",
  };
  const tagColor = subjectMeta[course?.subject_id] || "bg-gray-100 text-gray-700";

  // ── loading ──────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">🎬</div>
        <p className="text-gray-400 text-sm animate-pulse">Memuat video...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-sm">
        <p className="text-4xl mb-3">😕</p>
        <p className="font-black text-gray-800 mb-2">Gagal memuat video</p>
        <p className="text-sm text-gray-400 mb-4">{error}</p>
        <button onClick={() => onNavigate && onNavigate("/kursus")}
          className="bg-violet-600 text-white font-bold px-6 py-2.5 rounded-2xl text-sm">
          Kembali ke kursus
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <button onClick={() => onNavigate && onNavigate("/kursus")}
            className="hover:text-violet-600 transition-colors">Kursus</button>
          <span>›</span>
          <span className="text-gray-500 font-medium truncate max-w-xs">{course?.title}</span>
          <span>›</span>
          <span className="text-violet-600 font-semibold">Ep. {activeIdx + 1}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── KIRI: player + info ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Player */}
            <div className="rounded-2xl overflow-hidden bg-gray-900 aspect-video relative group">
              {activeEp?.youtube_url ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeEp.youtube_id || extractYoutubeId(activeEp.youtube_url)}?autoplay=0`}
                  title={activeEp.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center mb-3 mx-auto active:scale-90 transition-all"
                    >
                      {isPlaying
                        ? <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        : <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                      }
                    </button>
                    <p className="text-white/50 text-xs">Video belum tersedia</p>
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                Episode {activeIdx + 1} dari {episodes.length}
              </div>
            </div>

            {/* Info episode */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-xl font-black text-gray-900 leading-tight">
                    Ep. {activeIdx + 1} — {activeEp?.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tagColor}`}>
                      {course?.subjects?.label}
                    </span>
                    <span className="text-xs text-gray-400">{activeEp?.duration_text}</span>
                    <span className="text-xs text-gray-400">+{activeEp?.xp_reward || 20} XP</span>
                    {isActiveDone && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">✓ Selesai</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setLiked(!liked)}
                    className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all active:scale-95
                      ${liked ? "bg-pink-50 text-pink-600 border-pink-200" : "bg-white text-gray-500 border-gray-200 hover:border-pink-200"}`}>
                    {liked ? "♥" : "♡"} Suka
                  </button>
                  <button onClick={() => setSaved(!saved)}
                    className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all active:scale-95
                      ${saved ? "bg-violet-50 text-violet-600 border-violet-200" : "bg-white text-gray-500 border-gray-200"}`}>
                    {saved ? "★ Tersimpan" : "☆ Simpan"}
                  </button>
                </div>
              </div>

              {/* Deskripsi */}
              {activeEp?.description && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="text-sm font-black text-gray-800 mb-2">Tentang episode ini</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{activeEp.description}</p>
                </div>
              )}
            </div>

            {/* Tombol aksi */}
            {!isActiveDone ? (
              <button onClick={markDone} disabled={completing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 active:scale-[0.99] transition-all text-white font-black py-4 rounded-2xl text-sm">
                {completing ? "Menyimpan..." : "✓ Tandai episode ini selesai (+20 XP)"}
              </button>
            ) : activeIdx < episodes.length - 1 ? (
              <button onClick={goNextEp}
                className="w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.99] transition-all text-white font-black py-4 rounded-2xl text-sm">
                Lanjut ke Episode {activeIdx + 2} — {episodes[activeIdx + 1]?.title} →
              </button>
            ) : allDone ? (
              <button onClick={() => onNavigate && onNavigate("/kuis")}
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] transition-all text-white font-black py-4 rounded-2xl text-sm">
                🏆 Semua episode selesai — Ambil Kuis Sekarang →
              </button>
            ) : null}
          </div>

          {/* ── KANAN: sidebar ── */}
          <div className="space-y-4">

            {/* Progress kursus */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-black text-gray-800">Progress kursus</h3>
                <span className="text-sm font-black text-violet-600">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-400">
                {doneEpIds.size} dari {episodes.length} episode selesai
              </p>
            </div>

            {/* Daftar episode */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-black text-gray-800 mb-4">Daftar episode</h3>
              <div className="space-y-1">
                {episodes.map((ep, i) => {
                  const isDone   = doneEpIds.has(ep.id);
                  const isActive = activeEp?.id === ep.id;
                  return (
                    <button key={ep.id} onClick={() => { setActiveEp(ep); setIsPlaying(false); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                        ${isActive ? "bg-violet-50 border border-violet-200" : "hover:bg-gray-50"}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
                        ${isDone ? "bg-emerald-500 text-white"
                          : isActive ? "bg-violet-600 text-white"
                          : "bg-gray-100 text-gray-400"}`}>
                        {isDone ? "✓" : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate leading-tight
                          ${isActive ? "text-violet-700" : "text-gray-700"}`}>
                          {ep.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{ep.duration_text}</p>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// helper: ekstrak YouTube ID dari URL
function extractYoutubeId(url) {
  if (!url) return "";
  const match = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : "";
}