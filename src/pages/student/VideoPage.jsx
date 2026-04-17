import { useState } from "react";
import { EPISODES, SUBJECTS } from "../data";

export default function VideoPage({ onNavigate }) {
  const [activeEp, setActiveEp] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const subject = SUBJECTS.find(s => s.id === "matematika");
  const currentEp = EPISODES.find(e => e.id === activeEp);
  const doneCount = EPISODES.filter(e => e.done).length;
  const totalProgress = Math.round((doneCount / EPISODES.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <button onClick={() => onNavigate("kursus")} className="hover:text-violet-600 transition-colors">Kursus</button>
          <span>›</span>
          <span className="text-gray-500 font-medium">Aljabar dasar untuk pemula</span>
          <span>›</span>
          <span className="text-violet-600 font-semibold">Ep. {activeEp}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main */}
          <div className="lg:col-span-2 space-y-5">

            {/* Player */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative group">
              <div className="text-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90
                    ${isPlaying ? "bg-white/20 hover:bg-white/30" : "bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900"}`}
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  ) : (
                    <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                  )}
                </button>
                <p className="text-white/50 text-xs mt-3">{isPlaying ? "Sedang diputar..." : "Klik untuk memutar"}</p>
              </div>

              {/* Progress bar overlay */}
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: isPlaying ? "35%" : "0%" }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-white/50 text-[10px]">{isPlaying ? "2:41" : "0:00"}</span>
                  <span className="text-white/50 text-[10px]">7:42</span>
                </div>
              </div>

              {/* Episode badge */}
              <div className="absolute top-4 left-4 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                Episode {activeEp} dari {EPISODES.length}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-xl font-black text-gray-900 leading-tight">
                    Ep. {activeEp} — {currentEp?.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${subject?.color}`}>
                      {subject?.label}
                    </span>
                    <span className="text-xs text-gray-400">4.218 ditonton</span>
                    <span className="text-xs text-gray-400">{currentEp?.duration} menit</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all active:scale-95
                      ${liked ? "bg-pink-50 text-pink-600 border-pink-200" : "bg-white text-gray-500 border-gray-200 hover:border-pink-200"}`}
                  >
                    {liked ? "♥" : "♡"} {liked ? "1.234" : "1.233"}
                  </button>
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all active:scale-95
                      ${saved ? "bg-violet-50 text-violet-600 border-violet-200" : "bg-white text-gray-500 border-gray-200 hover:border-violet-200"}`}
                  >
                    {saved ? "★ Tersimpan" : "☆ Simpan"}
                  </button>
                </div>
              </div>

              {/* Description card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Tentang episode ini</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Di episode ini kamu akan belajar cara memecahkan persamaan linear satu variabel dengan metode yang mudah dipahami.
                  Kita akan bahas step-by-step dari bentuk paling sederhana sampai yang lebih kompleks, disertai contoh soal nyata.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 text-sm">◎</span>
                    <span className="text-xs text-gray-500">Gratis selamanya</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-violet-500 text-sm">↓</span>
                    <span className="text-xs text-gray-500">Bisa diunduh</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500 text-sm">★</span>
                    <span className="text-xs text-gray-500">+20 XP setelah selesai</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next episode CTA */}
            {activeEp < EPISODES.length && (
              <button
                onClick={() => setActiveEp(activeEp + 1)}
                className="w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.99] transition-all text-white font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2"
              >
                Lanjut ke Episode {activeEp + 1} — {EPISODES.find(e => e.id === activeEp + 1)?.title} →
              </button>
            )}

            {activeEp === EPISODES.length && (
              <button
                onClick={() => onNavigate("kuis")}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] transition-all text-white font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2"
              >
                ✓ Semua episode selesai — Ambil Kuis Sekarang →
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Course Progress */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-black text-gray-800">Progress kursus</h3>
                <span className="text-sm font-black text-violet-600">{totalProgress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${totalProgress}%` }} />
              </div>
              <p className="text-xs text-gray-400">{doneCount} dari {EPISODES.length} episode selesai</p>
            </div>

            {/* Episode List */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-black text-gray-800 mb-4">Daftar episode</h3>
              <div className="space-y-1">
                {EPISODES.map(ep => (
                  <button
                    key={ep.id}
                    onClick={() => setActiveEp(ep.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                      ${activeEp === ep.id ? "bg-violet-50 border border-violet-200" : "hover:bg-gray-50"}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
                      ${ep.done ? "bg-emerald-500 text-white" : activeEp === ep.id ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                      {ep.done ? "✓" : ep.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate leading-tight ${activeEp === ep.id ? "text-violet-700" : "text-gray-700"}`}>
                        {ep.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{ep.duration} menit</p>
                    </div>
                    {activeEp === ep.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mentor Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-black text-gray-800 mb-3">Mentor kursus ini</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-black flex-shrink-0">DP</div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Pak Dimas Pratama</p>
                  <p className="text-xs text-gray-400">★ 4.9 · 142 siswa</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate("mentor")}
                className="w-full text-xs font-semibold text-violet-600 border border-violet-200 py-2.5 rounded-xl hover:bg-violet-50 transition-colors"
              >
                Lihat profil mentor →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}