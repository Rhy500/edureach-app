import { useState } from "react";
import { SUBJECTS, COURSES } from "../data";

const stats = [
  { num: "2.400+", label: "Siswa aktif" },
  { num: "120+", label: "Video gratis" },
  { num: "34", label: "Kabupaten" },
  { num: "12", label: "Mata pelajaran" },
];

const features = [
  { icon: "◎", title: "100% Gratis", desc: "Tidak ada biaya, tidak ada iklan. Murni untuk pendidikan.", color: "bg-violet-50 text-violet-600" },
  { icon: "↓", title: "Mode Offline", desc: "Unduh materi, belajar tanpa koneksi internet.", color: "bg-emerald-50 text-emerald-600" },
  { icon: "★", title: "Gamifikasi", desc: "Kumpulkan XP, raih badge, naik level setiap hari.", color: "bg-amber-50 text-amber-600" },
  { icon: "♦", title: "Microlearning", desc: "Video 1–10 menit, satu topik, mudah dicerna.", color: "bg-pink-50 text-pink-600" },
  { icon: "◈", title: "Literasi Digital", desc: "Coding, AI, internet sehat — bekal masa depan.", color: "bg-sky-50 text-sky-600" },
  { icon: "☻", title: "Mentor Aktif", desc: "Komunitas mentor sukarela siap bantu via Discord.", color: "bg-orange-50 text-orange-600" },
];

export default function LandingPage({ onNavigate }) {
  const [hoveredSubject, setHoveredSubject] = useState(null);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 text-center overflow-hidden">
        <div className="absolute -top-16 left-1/4 w-80 h-80 bg-violet-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-emerald-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-amber-50 rounded-full opacity-60 blur-2xl pointer-events-none" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-violet-100">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            2.400+ siswa sudah bergabung hari ini
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Belajar lebih seru,<br />
            <span className="text-violet-600">tanpa batas</span>{" "}
            <span className="text-emerald-500">geografis</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed">
            Platform belajar digital gratis untuk siswa SD–SMA di seluruh Indonesia. Video singkat, mentor aktif, offline-friendly.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-14">
            <button
              onClick={() => onNavigate("register")}
              className="bg-violet-600 hover:bg-violet-700 active:scale-95 transition-all text-white font-bold px-8 py-4 rounded-2xl text-sm shadow-lg shadow-violet-200"
            >
              Mulai belajar — gratis
            </button>
            <button
              onClick={() => onNavigate("kursus")}
              className="bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all text-gray-700 font-semibold px-8 py-4 rounded-2xl text-sm"
            >
              Lihat semua materi →
            </button>
          </div>

          {/* Stats */}
          <div className="inline-flex items-center gap-8 bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 flex-wrap justify-center">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-black text-gray-900">{s.num}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                </div>
                {i < stats.length - 1 && <div className="w-px h-8 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Pilih mata pelajaran</h2>
            <p className="text-gray-400 text-sm">Dari pelajaran sekolah hingga skill digital masa depan</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {SUBJECTS.filter(s => s.id !== "semua").map((s) => (
              <button
                key={s.id}
                onClick={() => onNavigate("kursus")}
                onMouseEnter={() => setHoveredSubject(s.id)}
                onMouseLeave={() => setHoveredSubject(null)}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-200
                  ${hoveredSubject === s.id
                    ? "border-violet-300 bg-white shadow-md -translate-y-1"
                    : "border-gray-100 bg-white hover:-translate-y-0.5"}`}
              >
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-lg font-bold`}>
                  {s.icon}
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-800">{s.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {COURSES.filter(c => c.subject === s.id).length} kursus
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Kenapa EduReach?</h2>
          <p className="text-gray-400 text-sm">Dirancang khusus untuk siswa Indonesia, dari kota hingga pelosok desa</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-violet-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 max-w-6xl mx-auto px-6">
        <div className="relative bg-violet-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-violet-500 rounded-full opacity-50" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-500 rounded-full opacity-20" />
          <div className="absolute top-6 right-6 w-24 h-24 bg-amber-400 rounded-full opacity-20" />
          <div className="relative">
            <h2 className="text-4xl font-black text-white mb-4">Siap belajar tanpa batas?</h2>
            <p className="text-violet-200 text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Bergabung dengan ribuan siswa dari seluruh Indonesia. Gratis selamanya, tanpa syarat apapun.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => onNavigate("register")}
                className="bg-white hover:bg-gray-50 active:scale-95 transition-all text-violet-700 font-bold px-8 py-3.5 rounded-2xl text-sm"
              >
                Daftar gratis sekarang
              </button>
              <button
                onClick={() => onNavigate("kursus")}
                className="border border-white/30 hover:bg-white/10 active:scale-95 transition-all text-white font-semibold px-8 py-3.5 rounded-2xl text-sm"
              >
                Jelajahi materi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-lg font-black"><span className="text-violet-600">Edu</span><span className="text-emerald-500">Reach</span></div>
          <p className="text-xs text-gray-400 text-center italic">"Pendidikan berkualitas untuk seluruh siswa Indonesia — tanpa batas ekonomi maupun geografis."</p>
          <div className="flex gap-6">
            {["Tentang", "Komunitas", "Kontak"].map(l => (
              <span key={l} className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}