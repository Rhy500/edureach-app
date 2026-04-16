import { SUBJECTS, COURSES } from "../data";

const weekDays = [
  { label: "Sen", done: true, mins: 40 },
  { label: "Sel", done: true, mins: 55 },
  { label: "Rab", done: true, mins: 30 },
  { label: "Kam", done: false, mins: 0 },
  { label: "Jum", done: true, mins: 60 },
  { label: "Sab", done: true, mins: 45 },
  { label: "Min", done: true, mins: 35, today: true },
];
const maxMins = 60;

const badges = [
  { icon: "🔥", name: "Streak 7 hari", sub: "Didapat", earned: true, color: "bg-amber-50 border-amber-200" },
  { icon: "⭐", name: "Nilai 90+", sub: "Didapat", earned: true, color: "bg-violet-50 border-violet-200" },
  { icon: "🚀", name: "10 video selesai", sub: "Didapat", earned: true, color: "bg-emerald-50 border-emerald-200" },
  { icon: "🏅", name: "Jagoan Aljabar", sub: "Didapat", earned: true, color: "bg-pink-50 border-pink-200" },
  { icon: "🔒", name: "Streak 30 hari", sub: "Butuh 18 hari lagi", earned: false, color: "bg-gray-50 border-gray-200" },
  { icon: "🔒", name: "100 video", sub: "52 video lagi", earned: false, color: "bg-gray-50 border-gray-200" },
  { icon: "🔒", name: "Semua mapel", sub: "Mulai 3 mapel lagi", earned: false, color: "bg-gray-50 border-gray-200" },
  { icon: "🔒", name: "Level 10", sub: "Level 5 sekarang", earned: false, color: "bg-gray-50 border-gray-200" },
];

const activities = [
  { icon: "✓", color: "bg-emerald-100 text-emerald-600", text: "Menyelesaikan Ep. 3 — Persamaan linear", time: "Hari ini, 09:41" },
  { icon: "★", color: "bg-violet-100 text-violet-600", text: "Kuis Aljabar dasar — skor 92", time: "Kemarin, 20:15" },
  { icon: "◈", color: "bg-pink-100 text-pink-600", text: "Menyelesaikan kursus Internet sehat", time: "Sabtu, 15:30" },
  { icon: "⚡", color: "bg-amber-100 text-amber-600", text: "Naik ke Level 5 — Penjelajah Ilmu", time: "Sabtu, 15:31" },
  { icon: "►", color: "bg-sky-100 text-sky-600", text: "Mulai kursus Python pemula", time: "Jumat, 18:00" },
];

const subjPerformance = [
  { id: "matematika", pct: 78 },
  { id: "ipa", pct: 65 },
  { id: "digital", pct: 90 },
  { id: "coding", pct: 40 },
  { id: "bahasa", pct: 80 },
];

export default function PerformaPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 flex items-center gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center text-2xl font-black flex-shrink-0">
            AR
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-gray-900">Arif Rahmadan</h1>
            <p className="text-sm text-gray-400 mt-0.5">Bergabung sejak Januari 2025 · SMP Negeri 3 Surabaya</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                Level 5 — Penjelajah Ilmu
              </span>
              <span className="text-xs text-gray-400">340 XP · butuh 160 XP lagi untuk Level 6</span>
            </div>
            {/* XP bar */}
            <div className="mt-2 max-w-xs">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: "68%" }} />
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate("kursus")}
            className="text-sm font-bold bg-violet-600 text-white px-5 py-2.5 rounded-2xl hover:bg-violet-700 active:scale-95 transition-all flex-shrink-0"
          >
            Lanjut belajar →
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { val: "48", label: "Video selesai", sub: "+6 minggu ini", subColor: "text-emerald-600" },
            { val: "12", label: "Hari streak", sub: "Rekor: 21 hari", subColor: "text-violet-600" },
            { val: "340", label: "Poin XP", sub: "+40 hari ini", subColor: "text-emerald-600" },
            { val: "87%", label: "Rata-rata kuis", sub: "Di atas rata-rata", subColor: "text-emerald-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <div className="text-2xl font-black text-gray-900">{s.val}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              <div className={`text-xs font-semibold mt-1 ${s.subColor}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

          {/* Streak calendar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-800">Streak minggu ini</h3>
              <span className="text-2xl font-black text-violet-600">12 🔥</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(d => (
                <div key={d.label} className="flex flex-col items-center gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black
                    ${d.done && d.today ? "bg-violet-600 text-white"
                      : d.done ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-300"}`}>
                    {d.done ? (d.today ? "◎" : "✓") : "–"}
                  </div>
                  <span className={`text-[10px] font-semibold ${d.today ? "text-violet-600" : "text-gray-400"}`}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity bar chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-800">Menit belajar</h3>
              <span className="text-xs text-gray-400">rata-rata 38 mnt/hari</span>
            </div>
            <div className="flex items-end gap-2 h-20">
              {weekDays.map(d => (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full rounded-t-lg transition-all ${d.today ? "bg-violet-500" : d.done ? "bg-violet-200" : "bg-gray-100"}`}
                    style={{ height: `${(d.mins / maxMins) * 72}px`, minHeight: d.done ? "4px" : "4px" }}
                  />
                  <span className={`text-[9px] font-semibold ${d.today ? "text-violet-600" : "text-gray-400"}`}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

          {/* Subject mastery */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-black text-gray-800 mb-4">Penguasaan per mapel</h3>
            <div className="space-y-3">
              {subjPerformance.map(sp => {
                const s = SUBJECTS.find(s => s.id === sp.id);
                return (
                  <div key={sp.id} className="flex items-center gap-3">
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s?.color} w-24 text-center flex-shrink-0`}>
                      {s?.label}
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s?.bar}`} style={{ width: `${sp.pct}%` }} />
                    </div>
                    <span className="text-xs font-black text-gray-600 w-8 text-right">{sp.pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course progress */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-black text-gray-800 mb-4">Kursus aktif</h3>
            <div className="space-y-3">
              {COURSES.filter(c => c.progress > 0).map(c => {
                const s = SUBJECTS.find(s => s.id === c.subject);
                return (
                  <div
                    key={c.id}
                    onClick={() => onNavigate("video")}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s?.bar}`} />
                    <p className="text-xs text-gray-700 flex-1 group-hover:text-violet-600 transition-colors truncate font-semibold">{c.title}</p>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                      <div className={`h-full rounded-full ${s?.bar}`} style={{ width: `${c.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 w-7 text-right">{c.progress}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-800">Pencapaian</h3>
            <span className="text-xs text-gray-400">{badges.filter(b => b.earned).length}/{badges.length} badge</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {badges.map(b => (
              <div key={b.name} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${b.color} ${b.earned ? "" : "opacity-50"}`}>
                <span className="text-2xl">{b.icon}</span>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-700 leading-tight">{b.name}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-black text-gray-800 mb-4">Aktivitas terbaru</h3>
          <div className="space-y-1">
            {activities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${a.color}`}>
                  {a.icon}
                </div>
                <p className="text-xs text-gray-700 flex-1 font-medium">{a.text}</p>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}