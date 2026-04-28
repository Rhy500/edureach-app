import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";

const subjectMeta = {
  matematika: { label:"Matematika",       color:"bg-violet-100 text-violet-800",  bar:"bg-violet-500" },
  ipa:        { label:"IPA",              color:"bg-emerald-100 text-emerald-800", bar:"bg-emerald-500" },
  coding:     { label:"Coding",           color:"bg-amber-100 text-amber-800",    bar:"bg-amber-500" },
  digital:    { label:"Literasi Digital", color:"bg-pink-100 text-pink-800",      bar:"bg-pink-500" },
  bahasa:     { label:"Bahasa Indonesia", color:"bg-sky-100 text-sky-800",        bar:"bg-sky-500" },
  ips:        { label:"IPS",             color:"bg-orange-100 text-orange-800",   bar:"bg-orange-500" },
};

const WEEK  = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];
const BADGES = [
  { key:"streak7",  icon:"🔥", name:"Streak 7 hari",   check: s => s.streak >= 7 },
  { key:"score90",  icon:"⭐", name:"Nilai 90+",        check: s => s.bestQuiz >= 90 },
  { key:"vid10",    icon:"🚀", name:"10 video selesai", check: s => s.totalEp >= 10 },
  { key:"course1",  icon:"🏅", name:"Kursus pertama",   check: s => s.doneCourses >= 1 },
  { key:"streak30", icon:"🔒", name:"Streak 30 hari",   check: s => s.streak >= 30 },
  { key:"vid50",    icon:"🔒", name:"50 video",         check: s => s.totalEp >= 50 },
  { key:"allsubj",  icon:"🔒", name:"Semua mapel",      check: s => s.activeSubj >= 6 },
  { key:"lv10",     icon:"🔒", name:"Level 10",         check: s => s.levelNum >= 10 },
];

function Skel({ className = "h-8 w-full" }) {
  return <div className={`bg-gray-100 animate-pulse rounded-xl ${className}`} />;
}

export default function PerformaPage({ onNavigate }) {
  const { user, profile } = useAuth();
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [progress, setProgress] = useState([]);
  const [activity, setActivity] = useState([]);
  const [quizzes,  setQuizzes]  = useState([]);
  const [week,     setWeek]     = useState([]);

  useEffect(() => { if (user) fetchAll(); }, [user]);

  async function fetchAll() {
    setLoading(true); setError(null);
    try {
      const [p, a, q] = await Promise.all([
        supabase.from("user_progress")
          .select("progress_pct,episodes_done,updated_at,completed_at,courses(id,title,subject_id,episode_count)")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false }),

        supabase.from("episode_completions")
          .select("completed_at,episodes(title,courses(title,subject_id))")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false })
          .limit(10),

        supabase.from("quiz_results")
          .select("score,total_questions,pct,xp_earned,created_at,courses(title)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);
      if (p.error) throw p.error;
      if (a.error) throw a.error;
      if (q.error) throw q.error;

      setProgress(p.data || []);
      setActivity(a.data || []);
      setQuizzes(q.data  || []);

      // hitung aktivitas 7 hari
      const now = new Date();
      const days = Array(7).fill(0).map((_, i) => {
        const d = new Date(now); d.setDate(now.getDate() - (6 - i));
        const dow = d.getDay();
        return { label: WEEK[dow === 0 ? 6 : dow - 1], date: d.toDateString(), count: 0 };
      });
      (a.data || []).forEach(act => {
        const f = days.find(d => d.date === new Date(act.completed_at).toDateString());
        if (f) f.count++;
      });
      setWeek(days);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ── computed ─────────────────────────────────────
  const streak      = profile?.streak    || 0;
  const xp          = profile?.xp        || 0;
  const levelNum    = profile?.level_num  || 1;
  const levelName   = profile?.level_name || "Pemula";
  const totalEp     = activity.length;
  const doneCourses = progress.filter(p => p.progress_pct === 100).length;
  const inProgress  = progress.filter(p => p.progress_pct > 0 && p.progress_pct < 100).length;
  const avgQuiz     = quizzes.length ? Math.round(quizzes.reduce((s,q) => s+q.pct,0)/quizzes.length) : 0;
  const bestQuiz    = quizzes.length ? Math.max(...quizzes.map(q=>q.pct)) : 0;

  const subjMastery = Object.entries(subjectMeta).map(([id, meta]) => {
    const rows = progress.filter(p => p.courses?.subject_id === id);
    const avg  = rows.length ? Math.round(rows.reduce((s,r)=>s+r.progress_pct,0)/rows.length) : 0;
    return { id, ...meta, pct: avg };
  }).filter(s => s.pct > 0);

  const badgeStats  = { streak, bestQuiz, totalEp, doneCourses, activeSubj: subjMastery.length, levelNum };
  const badges      = BADGES.map(b => ({ ...b, earned: b.check(badgeStats) }));
  const xpToNext    = 100 - (xp % 100);
  const initials    = profile?.name?.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase() || "?";
  const maxCount    = Math.max(...week.map(d=>d.count), 1);

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Kamu harus login dulu.</p>
        <button onClick={() => onNavigate("/login")}
          className="bg-violet-600 text-white font-bold px-6 py-3 rounded-2xl text-sm">Masuk</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-4 rounded-2xl mb-5 flex items-center gap-3">
            <span>Gagal memuat data: {error}</span>
            <button onClick={fetchAll} className="text-xs underline ml-auto">Coba lagi</button>
          </div>
        )}

        {/* ── profile ── */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 flex items-center gap-5 flex-wrap">
          {loading ? (
            <><Skel className="h-16 w-16 flex-shrink-0"/><div className="flex-1 space-y-2"><Skel className="h-5 w-40"/><Skel className="h-3 w-56"/><Skel className="h-3 w-44"/></div></>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center text-2xl font-black flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black text-gray-900">{profile?.name || "—"}</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {profile?.school ? `${profile.school} · ` : ""}{profile?.grade || ""}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"/>
                    Level {levelNum} — {levelName}
                  </span>
                  <span className="text-xs text-gray-400">{xp} XP total</span>
                </div>
                <div className="mt-2 max-w-xs">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width:`${Math.min(xp%100,100)}%` }}/>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{xpToNext} XP lagi untuk Level {levelNum+1}</p>
                </div>
              </div>
              <button onClick={() => onNavigate("/kursus")}
                className="text-sm font-bold bg-violet-600 text-white px-5 py-2.5 rounded-2xl hover:bg-violet-700 active:scale-95 transition-all flex-shrink-0">
                Lanjut belajar →
              </button>
            </>
          )}
        </div>

        {/* ── stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { val: totalEp,     label:"Video selesai",  sub:`${doneCourses} kursus tuntas`,   c:"text-emerald-600" },
            { val:`${streak}🔥`, label:"Hari streak",    sub:`${inProgress} kursus aktif`,     c:"text-violet-600" },
            { val: xp,          label:"Total XP",        sub:"+20 XP per episode",             c:"text-emerald-600" },
            { val: avgQuiz?`${avgQuiz}%`:"—", label:"Rata-rata kuis",
              sub: avgQuiz>=80?"Di atas rata-rata 🎉":avgQuiz>0?"Terus semangat!":"Belum ada kuis",
              c: avgQuiz>=80?"text-emerald-600":"text-amber-500" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              {loading
                ? <><Skel className="h-7 w-12 mb-1"/><Skel className="h-3 w-20 mb-1"/><Skel className="h-3 w-16"/></>
                : <><div className="text-2xl font-black text-gray-900">{s.val}</div>
                    <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                    <div className={`text-xs font-semibold mt-1 ${s.c}`}>{s.sub}</div></>
              }
            </div>
          ))}
        </div>

        {/* ── streak + bars ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-800">Streak minggu ini</h3>
              <span className="text-2xl font-black text-violet-600">{streak} 🔥</span>
            </div>
            {loading
              ? <div className="flex gap-2">{Array(7).fill(0).map((_,i)=><Skel key={i} className="flex-1 h-10"/>)}</div>
              : <div className="grid grid-cols-7 gap-1.5">
                  {week.map((d,i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black
                        ${i===6&&d.count>0?"bg-violet-600 text-white":d.count>0?"bg-emerald-500 text-white":"bg-gray-100 text-gray-300"}`}>
                        {d.count>0?(i===6?"◎":"✓"):"–"}
                      </div>
                      <span className={`text-[10px] font-semibold ${i===6?"text-violet-600":"text-gray-400"}`}>{d.label}</span>
                    </div>
                  ))}
                </div>
            }
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-800">Aktivitas minggu ini</h3>
              <span className="text-xs text-gray-400">episode per hari</span>
            </div>
            {loading ? <Skel className="h-20"/>
              : <div className="flex items-end gap-2 h-20">
                  {week.map((d,i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className={`w-full rounded-t-lg ${i===6?"bg-violet-500":d.count>0?"bg-violet-200":"bg-gray-100"}`}
                        style={{ height:`${Math.max((d.count/maxCount)*68, d.count>0?6:4)}px` }}/>
                      <span className={`text-[9px] font-semibold ${i===6?"text-violet-600":"text-gray-400"}`}>{d.label}</span>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>

        {/* ── penguasaan + kursus aktif ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-black text-gray-800 mb-4">Penguasaan per mata pelajaran</h3>
            {loading ? <div className="space-y-3">{Array(3).fill(0).map((_,i)=><Skel key={i} className="h-6"/>)}</div>
              : subjMastery.length===0
                ? <p className="text-xs text-gray-400 text-center py-6">Mulai belajar untuk lihat statistik!</p>
                : <div className="space-y-3">
                    {subjMastery.map(s=>(
                      <div key={s.id} className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color} w-28 text-center flex-shrink-0`}>{s.label}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.bar}`} style={{ width:`${s.pct}%` }}/>
                        </div>
                        <span className="text-xs font-black text-gray-600 w-8 text-right">{s.pct}%</span>
                      </div>
                    ))}
                  </div>
            }
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-black text-gray-800 mb-4">Kursus aktif</h3>
            {loading ? <div className="space-y-3">{Array(3).fill(0).map((_,i)=><Skel key={i} className="h-8"/>)}</div>
              : progress.length===0
                ? <div className="text-center py-6">
                    <p className="text-xs text-gray-400 mb-3">Belum ada kursus</p>
                    <button onClick={()=>onNavigate("/kursus")}
                      className="text-xs font-bold text-violet-600 border border-violet-200 px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors">
                      Jelajahi kursus →
                    </button>
                  </div>
                : <div className="space-y-3">
                    {progress.map((p,i)=>{
                      const m = subjectMeta[p.courses?.subject_id];
                      return (
                        <div key={i} onClick={()=>onNavigate("/video")}
                          className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${m?.bar||"bg-gray-400"}`}/>
                          <p className="text-xs text-gray-700 flex-1 group-hover:text-violet-600 transition-colors truncate font-semibold">{p.courses?.title}</p>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                            <div className={`h-full rounded-full ${m?.bar||"bg-gray-400"}`} style={{ width:`${p.progress_pct}%` }}/>
                          </div>
                          <span className="text-[10px] font-black text-gray-500 w-7 text-right">{p.progress_pct}%</span>
                        </div>
                      );
                    })}
                  </div>
            }
          </div>
        </div>

        {/* ── hasil kuis ── */}
        {!loading && quizzes.length>0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
            <h3 className="text-sm font-black text-gray-800 mb-4">Hasil kuis terbaru</h3>
            {quizzes.slice(0,5).map((q,i)=>{
              const cls = q.pct>=80?"text-emerald-600 bg-emerald-50 border-emerald-200"
                :q.pct>=60?"text-amber-600 bg-amber-50 border-amber-200"
                :"text-red-500 bg-red-50 border-red-200";
              return (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className={`text-xs font-black px-3 py-1 rounded-full border flex-shrink-0 ${cls}`}>{q.pct}%</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{q.courses?.title||"Kuis"}</p>
                    <p className="text-[10px] text-gray-400">{q.score}/{q.total_questions} benar · +{q.xp_earned} XP</p>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {new Date(q.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"short"})}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── badges ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-800">Pencapaian</h3>
            <span className="text-xs text-gray-400">{badges.filter(b=>b.earned).length}/{badges.length} badge</span>
          </div>
          {loading
            ? <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">{Array(8).fill(0).map((_,i)=><Skel key={i} className="h-20"/>)}</div>
            : <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {badges.map(b=>(
                  <div key={b.key} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border
                    ${b.earned?"bg-amber-50 border-amber-200":"bg-gray-50 border-gray-100 opacity-40"}`}>
                    <span style={{fontSize:24}}>{b.icon}</span>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-gray-700 leading-tight">{b.name}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">{b.earned?"Didapat ✓":"Terkunci"}</p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* ── aktivitas terbaru ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-black text-gray-800 mb-4">Aktivitas terbaru</h3>
          {loading
            ? <div className="space-y-2">{Array(5).fill(0).map((_,i)=><Skel key={i} className="h-10"/>)}</div>
            : activity.length===0
              ? <p className="text-xs text-gray-400 text-center py-6">Belum ada aktivitas. Yuk mulai belajar! 🚀</p>
              : activity.map((a,i)=>{
                  const m = subjectMeta[a.episodes?.courses?.subject_id];
                  return (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${m?.color||"bg-gray-100 text-gray-500"}`}>▶</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{a.episodes?.title}</p>
                        <p className="text-[10px] text-gray-400 truncate">{a.episodes?.courses?.title}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {new Date(a.completed_at).toLocaleDateString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
                      </span>
                    </div>
                  );
                })
          }
        </div>

      </div>
    </div>
  );
}