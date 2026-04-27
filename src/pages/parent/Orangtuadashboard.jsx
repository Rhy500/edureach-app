import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { connectParentToChild, getMyChildren, getChildProgress, getChildActivity, getChildInviteCode } from '../../lib/roles'

const subjectMeta = {
  matematika: { color: 'bg-violet-100 text-violet-800', bar: 'bg-violet-500' },
  ipa:        { color: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500' },
  coding:     { color: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500' },
  digital:    { color: 'bg-pink-100 text-pink-800', bar: 'bg-pink-500' },
  bahasa:     { color: 'bg-sky-100 text-sky-800', bar: 'bg-sky-500' },
  ips:        { color: 'bg-orange-100 text-orange-800', bar: 'bg-orange-500' },
}

function ConnectChildCard({ onConnected }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleConnect() {
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await connectParentToChild(code)
      if (!result.success) throw new Error(result.error)
      onConnected(result.child_name)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="text-sm font-black text-gray-800 mb-1">Hubungkan akun anak</h3>
      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
        Minta anak membuka EduReach → Profil → Salin kode undangan, lalu masukkan di sini.
      </p>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-2.5 rounded-xl mb-3">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Contoh: AB12CD34"
          maxLength={8}
          className="flex-1 px-4 py-3 text-sm font-mono border border-gray-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-gray-50 transition-all tracking-widest uppercase"
        />
        <button
          onClick={handleConnect}
          disabled={loading || code.length < 6}
          className="bg-violet-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-violet-700 text-white font-black px-5 py-3 rounded-xl text-sm active:scale-95 transition-all"
        >
          {loading ? '...' : 'Hubungkan'}
        </button>
      </div>
    </div>
  )
}

function ChildCard({ child, isSelected, onSelect }) {
  const initials = child.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '??'
  return (
    <button
      onClick={() => onSelect(child)}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all
        ${isSelected ? 'border-violet-400 bg-violet-50' : 'border-gray-100 bg-white hover:border-violet-200'}`}
    >
      <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-black flex-shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-gray-800 truncate">{child.name}</p>
        <p className="text-xs text-gray-400">{child.grade || 'Jenjang belum diisi'}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xs font-black text-amber-600">Lv.{child.level_num}</div>
        <div className="text-[10px] text-gray-400">{child.xp} XP</div>
      </div>
    </button>
  )
}

function ChildDashboard({ child }) {
  const [progress, setProgress] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [prog, act] = await Promise.all([
        getChildProgress(child.id),
        getChildActivity(child.id, 8),
      ])
      setProgress(prog)
      setActivity(act)
      setLoading(false)
    }
    load()
  }, [child.id])

  const done = progress.filter(p => p.progress_pct === 100).length
  const inProg = progress.filter(p => p.progress_pct > 0 && p.progress_pct < 100).length

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { val: child.streak || 0, label: 'Hari streak', color: 'text-violet-600', sub: '🔥' },
          { val: child.xp || 0, label: 'Total XP', color: 'text-amber-600', sub: '⭐' },
          { val: inProg, label: 'Sedang belajar', color: 'text-sky-600', sub: '📖' },
          { val: done, label: 'Kursus selesai', color: 'text-emerald-600', sub: '✓' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 text-center">
            <div className="text-lg mb-0.5">{s.sub}</div>
            <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
            <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress kursus */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-black text-gray-800 mb-4">Progress kursus</h3>
        {progress.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">Belum ada kursus yang dimulai</p>
        ) : (
          <div className="space-y-3">
            {progress.map(p => {
              const meta = subjectMeta[p.courses?.subject_id] || subjectMeta.matematika
              const isDone = p.progress_pct === 100
              return (
                <div key={p.courses?.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.color}`}>
                        {p.courses?.subjects?.label}
                      </span>
                      <span className="text-xs text-gray-700 font-medium truncate">{p.courses?.title}</span>
                      {isDone && <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full ml-auto flex-shrink-0">Selesai ✓</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${meta.bar} transition-all`} style={{ width: `${p.progress_pct}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-gray-500 w-7 text-right flex-shrink-0">{p.progress_pct}%</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {p.episodes_done} dari {p.courses?.episode_count} episode
                      {p.completed_at && ` · Selesai ${new Date(p.completed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Aktivitas terbaru */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-black text-gray-800 mb-4">Aktivitas terbaru</h3>
        {activity.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">Belum ada aktivitas</p>
        ) : (
          <div className="space-y-1">
            {activity.map((a, i) => {
              const meta = subjectMeta[a.episodes?.courses?.subject_id] || subjectMeta.matematika
              return (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${meta.color}`}>
                    ▶
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{a.episodes?.title}</p>
                    <p className="text-[10px] text-gray-400 truncate">{a.episodes?.courses?.title}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {new Date(a.completed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Komponen kode undangan untuk siswa
export function InviteCodeCard({ userId }) {
  const [code, setCode] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getChildInviteCode(userId).then(setCode)
  }, [userId])

  function handleCopy() {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="text-sm font-black text-gray-800 mb-1">Kode undangan</h3>
      <p className="text-xs text-gray-400 mb-4">Bagikan kode ini ke orang tuamu agar bisa memantau progress belajarmu</p>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-lg font-black text-gray-800 tracking-widest text-center">
          {code || '········'}
        </div>
        <button
          onClick={handleCopy}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all active:scale-95
            ${copied ? 'bg-emerald-500 text-white' : 'bg-violet-600 text-white hover:bg-violet-700'}`}
        >
          {copied ? '✓ Disalin!' : 'Salin'}
        </button>
      </div>
    </div>
  )
}

// Halaman utama dashboard orang tua
export default function OrangTuaDashboard({ onNavigate }) {
  const { user, profile } = useAuth()
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [justConnected, setJustConnected] = useState(null)

  useEffect(() => {
    if (!user) return
    loadChildren()
  }, [user])

  async function loadChildren() {
    setLoading(true)
    const data = await getMyChildren(user.id)
    setChildren(data)
    if (data.length > 0 && !selectedChild) setSelectedChild(data[0])
    setLoading(false)
  }

  function handleConnected(childName) {
    setJustConnected(childName)
    loadChildren()
    setTimeout(() => setJustConnected(null), 4000)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Kamu harus login dulu.</p>
          <button onClick={() => onNavigate('/login')} className="bg-violet-600 text-white font-bold px-6 py-3 rounded-2xl text-sm">Masuk</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Dashboard Orang Tua</h1>
            <p className="text-sm text-gray-400 mt-0.5">Pantau progress belajar anak kamu</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-black">
            {profile?.name?.[0]?.toUpperCase() || '?'}
          </div>
        </div>

        {/* Notif berhasil connect */}
        {justConnected && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-5 py-3 rounded-2xl mb-5 flex items-center gap-2">
            <span>🎉</span> Berhasil terhubung dengan <strong>{justConnected}</strong>!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Sidebar kiri — daftar anak */}
          <div className="space-y-4">
            <ConnectChildCard onConnected={handleConnected} />

            {loading ? (
              <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            ) : children.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                  Anak terhubung ({children.length})
                </p>
                <div className="space-y-2">
                  {children.map(child => (
                    <ChildCard
                      key={child.id}
                      child={child}
                      isSelected={selectedChild?.id === child.id}
                      onSelect={setSelectedChild}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                <div className="text-4xl mb-3">👶</div>
                <p className="text-sm font-bold text-gray-700">Belum ada anak</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Masukkan kode undangan anak kamu di atas untuk mulai memantau
                </p>
              </div>
            )}
          </div>

          {/* Konten kanan — detail anak */}
          <div className="lg:col-span-2">
            {selectedChild ? (
              <div>
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-black flex-shrink-0">
                    {selectedChild.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black text-amber-900">{selectedChild.name}</p>
                    <p className="text-xs text-amber-600">
                      {selectedChild.grade || 'Jenjang belum diisi'}
                      {selectedChild.school && ` · ${selectedChild.school}`}
                      {` · Level ${selectedChild.level_num} — ${selectedChild.level_name}`}
                    </p>
                  </div>
                </div>
                <ChildDashboard child={selectedChild} />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <div className="text-4xl mb-3">👆</div>
                <p className="text-sm font-bold text-gray-700">Pilih anak</p>
                <p className="text-xs text-gray-400 mt-1">Klik salah satu nama anak untuk lihat detail progress</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}