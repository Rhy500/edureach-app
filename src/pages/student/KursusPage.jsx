import { useState, useMemo } from 'react'
import { useCourses } from '../hooks/useCourses'

const SUBJECTS = [
  { id: 'semua', label: 'Semua' },
  { id: 'matematika', label: 'Matematika' },
  { id: 'ipa', label: 'IPA' },
  { id: 'coding', label: 'Coding' },
  { id: 'digital', label: 'Literasi Digital' },
  { id: 'bahasa', label: 'Bahasa Indonesia' },
  { id: 'ips', label: 'IPS' },
]
const LEVELS = ['Semua', 'SD', 'SMP', 'SMA']

const subjectMeta = {
  matematika: { light: 'bg-violet-50', hex: '#7F77DD', bar: 'bg-violet-500', color: 'bg-violet-100 text-violet-800' },
  ipa:        { light: 'bg-emerald-50', hex: '#1D9E75', bar: 'bg-emerald-500', color: 'bg-emerald-100 text-emerald-800' },
  coding:     { light: 'bg-amber-50',  hex: '#BA7517', bar: 'bg-amber-500', color: 'bg-amber-100 text-amber-800' },
  digital:    { light: 'bg-pink-50',   hex: '#D4537E', bar: 'bg-pink-500', color: 'bg-pink-100 text-pink-800' },
  bahasa:     { light: 'bg-sky-50',    hex: '#378ADD', bar: 'bg-sky-500', color: 'bg-sky-100 text-sky-800' },
  ips:        { light: 'bg-orange-50', hex: '#D85A30', bar: 'bg-orange-500', color: 'bg-orange-100 text-orange-800' },
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-32 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-16" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-24 mt-3" />
      </div>
    </div>
  )
}

function CourseCard({ course, onNavigate }) {
  const meta = subjectMeta[course.subject_id] || subjectMeta.matematika
  const isDone = course.progress === 100
  const hasProgress = course.progress > 0
  const subjectLabel = course.subjects?.label || course.subject_id

  return (
    <div onClick={() => onNavigate('video', { courseId: course.id })}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 cursor-pointer flex flex-col">
      <div className={`${meta.light} h-32 flex items-center justify-center relative`}>
        <span className="text-4xl font-black" style={{ color: meta.hex }}>
          {course.thumbnail_icon || course.subjects?.icon || '📚'}
        </span>
        {course.is_new && !isDone && (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Baru</span>
        )}
        {isDone && (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓ Selesai</span>
        )}
        <span className="absolute bottom-3 left-3 bg-white/90 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {course.level}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${meta.color} inline-block w-fit mb-2`}>
          {subjectLabel}
        </span>
        <h3 className="text-sm font-bold text-gray-800 leading-snug mb-3 flex-1 group-hover:text-violet-700 transition-colors">
          {course.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-3">
          <span>{course.episode_count} episode</span>
          <span>·</span>
          <span>{course.duration_text}</span>
        </div>
        {hasProgress ? (
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] text-gray-400">Progress</span>
              <span className="text-[10px] font-bold" style={{ color: meta.hex }}>{course.progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${course.progress}%` }} />
            </div>
          </div>
        ) : (
          <button className="w-full text-xs font-semibold text-violet-600 border border-violet-200 hover:bg-violet-50 active:scale-95 transition-all py-2 rounded-xl">
            Mulai belajar →
          </button>
        )}
      </div>
    </div>
  )
}

export default function KursusPage({ onNavigate }) {
  const [activeSubject, setActiveSubject] = useState('semua')
  const [activeLevel, setActiveLevel]     = useState('Semua')
  const [search, setSearch]               = useState('')
  const [sort, setSort]                   = useState('default')

  const { courses, loading, error } = useCourses({ subject: activeSubject, level: activeLevel })

  const filtered = useMemo(() => {
    let r = courses
    if (search.trim()) r = r.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'progress') r = [...r].sort((a, b) => b.progress - a.progress)
    if (sort === 'episodes') r = [...r].sort((a, b) => b.episode_count - a.episode_count)
    if (sort === 'new') r = [...r].sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0))
    return r
  }, [courses, search, sort])

  const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100).length
  const done = courses.filter(c => c.progress === 100).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">Semua Kursus</h1>
          <p className="text-sm text-gray-400">Pilih topik yang ingin kamu pelajari hari ini</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Kursus tersedia', val: courses.length, color: 'text-gray-900' },
            { label: 'Sedang dipelajari', val: inProgress, color: 'text-violet-600' },
            { label: 'Sudah selesai', val: done, color: 'text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <div className={`text-2xl font-black ${s.color}`}>
                {loading ? <div className="h-7 w-8 bg-gray-100 rounded animate-pulse" /> : s.val}
              </div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
          <div className="flex gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">⌕</span>
              <input type="text" placeholder="Cari kursus..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50" />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-600 focus:outline-none focus:border-violet-400 transition-all">
              <option value="default">Urutan default</option>
              <option value="new">Terbaru</option>
              <option value="progress">Progress tertinggi</option>
              <option value="episodes">Episode terbanyak</option>
            </select>
          </div>

          <div className="mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Mata Pelajaran</p>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map(s => (
                <button key={s.id} onClick={() => setActiveSubject(s.id)}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all active:scale-95
                    ${activeSubject === s.id
                      ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Jenjang</p>
            <div className="flex gap-2">
              {LEVELS.map(l => (
                <button key={l} onClick={() => setActiveLevel(l)}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all active:scale-95
                    ${activeLevel === l
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-4 rounded-2xl mb-5">
            Gagal memuat kursus: {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">
            <span className="font-bold text-gray-700">{loading ? '...' : filtered.length}</span> kursus ditemukan
          </p>
          {(activeSubject !== 'semua' || activeLevel !== 'Semua' || search) && (
            <button onClick={() => { setActiveSubject('semua'); setActiveLevel('Semua'); setSearch('') }}
              className="text-xs text-red-400 hover:text-red-600 transition-colors">
              ✕ Reset filter
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(c => <CourseCard key={c.id} course={c} onNavigate={onNavigate} />)}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-bold text-gray-700 mb-1">Tidak ada kursus ditemukan</p>
            <p className="text-sm text-gray-400">Coba ubah filter atau kata kunci</p>
            <button onClick={() => { setActiveSubject('semua'); setActiveLevel('Semua'); setSearch('') }}
              className="mt-5 text-sm text-violet-600 border border-violet-200 px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors">
              Reset filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}