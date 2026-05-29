/*import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { submitMentorApplication, getMentorApplicationStatus } from '../../lib/roles'
import { useEffect } from 'react'

const SUBJECTS = [
  { id: 'matematika', label: 'Matematika', color: 'bg-violet-100 text-violet-800' },
  { id: 'ipa', label: 'IPA', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'coding', label: 'Coding', color: 'bg-amber-100 text-amber-800' },
  { id: 'digital', label: 'Literasi Digital', color: 'bg-pink-100 text-pink-800' },
  { id: 'bahasa', label: 'Bahasa Indonesia', color: 'bg-sky-100 text-sky-800' },
  { id: 'ips', label: 'IPS', color: 'bg-orange-100 text-orange-800' },
]

const steps = ['Bidang keahlian', 'Pengalaman', 'Motivasi', 'Konfirmasi']

function StatusCard({ status, appliedAt }) {
const cfg = {
    pending:  { bg: 'bg-amber-50 border-amber-200', icon: '⏳', title: 'Sedang diproses', color: 'text-amber-800', sub: 'Tim AkademikBelajar sedang mereview permohonanmu. Biasanya 1–3 hari kerja.' },
    approved: { bg: 'bg-emerald-50 border-emerald-200', icon: '🎉', title: 'Permohonan disetujui!', color: 'text-emerald-800', sub: 'Selamat! Kamu sudah resmi menjadi mentor AkademikBelajar.' },
    rejected: { bg: 'bg-red-50 border-red-200', icon: '❌', title: 'Permohonan ditolak', color: 'text-red-800', sub: 'Permohonanmu belum bisa diterima saat ini. Kamu bisa coba lagi 30 hari kemudian.' },
  }
  const c = cfg[status]
  return (
    <div className={`rounded-2xl border p-6 ${c.bg}`}>
      <div className="text-4xl mb-3">{c.icon}</div>
      <h2 className={`text-lg font-black mb-2 ${c.color}`}>{c.title}</h2>
      <p className="text-sm text-gray-600 mb-3">{c.sub}</p>
      {appliedAt && (
        <p className="text-xs text-gray-400">
          Diajukan: {new Date(appliedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}
    </div>
  )
}

export default function MentorApplyPage({ onNavigate }) {
  const { user, profile } = useAuth()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState(null)
  const [existingStatus, setExistingStatus] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    subject: '',
    experience: '',
    motivation: '',
    whatsapp: '',
    location: '',
  })

  useEffect(() => {
    if (!user) return
    getMentorApplicationStatus(user.id).then(data => {
      if (data) setExistingStatus(data)
      setChecking(false)
    })
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Kamu harus login dulu untuk mengajukan permohonan mentor.</p>
          <button onClick={() => onNavigate('/login')} className="bg-violet-600 text-white font-bold px-6 py-3 rounded-2xl text-sm hover:bg-violet-700 active:scale-95 transition-all">
            Masuk sekarang
          </button>
        </div>
      </div>
    )
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Mengecek status permohonan...</p>
      </div>
    )
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      await submitMentorApplication(form)
      setSubmitted(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const canNext = [
    form.subject !== '',
    form.experience.trim().length >= 30,
    form.motivation.trim().length >= 50 && form.whatsapp.trim().length >= 10,
    true,
  ][step]

  // Sudah ada status sebelumnya
  if (existingStatus && !submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto px-6 py-10">
          <button onClick={() => onNavigate('/')} className="text-3xl font-black mb-8 block">
            <span className="text-violet-600">Edu</span><span className="text-emerald-500">Reach</span>
          </button>
          <h1 className="text-xl font-black text-gray-900 mb-6">Status Permohonan Mentor</h1>
          <StatusCard status={existingStatus.status} appliedAt={existingStatus.applied_at} />
          {existingStatus.status === 'approved' && (
            <button onClick={() => onNavigate('/mentor/dashboard')}
              className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 rounded-2xl text-sm active:scale-[0.99] transition-all">
              Buka Dashboard Mentor →
            </button>
          )}
        </div>
      </div>
    )
  }

  // Berhasil submit
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Permohonan terkirim!</h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Tim AkademikBelajar akan menghubungi kamu via WhatsApp <strong>{form.whatsapp}</strong> dalam 1–3 hari kerja.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs font-black text-amber-800 mb-1">Yang perlu disiapkan</p>
            <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
              <li>Pastikan nomor WA aktif dan bisa dihubungi</li>
              <li>Siapkan 1–2 contoh video/materi yang pernah kamu buat</li>
              <li>Admin akan konfirmasi via WA maksimal 3 hari kerja</li>
            </ul>
          </div>
          <button onClick={() => onNavigate('/')}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-3.5 rounded-2xl text-sm active:scale-[0.99] transition-all">
            Kembali ke beranda
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-6 py-8">

        <button onClick={() => onNavigate('/')} className="text-2xl font-black mb-6 block">
          <span className="text-violet-600">Edu</span><span className="text-emerald-500">Reach</span>
        </button>

        <h1 className="text-2xl font-black text-gray-900 mb-1">Daftar jadi mentor</h1>
        <p className="text-sm text-gray-400 mb-6">Bagikan ilmumu ke ribuan siswa di seluruh Indonesia</p>

        {/* Step indicator */ /*}
        <div className="flex items-center gap-2 mb-7">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all
                ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full transition-all ${i < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-2xl mb-5">
              {error}
            </div>
          )}

          {/* Step 0 — Bidang keahlian */ /*}
          {step === 0 && (
            <>
              <h2 className="text-lg font-black text-gray-900 mb-1">Bidang keahlianmu</h2>
              <p className="text-xs text-gray-400 mb-5">Pilih satu mata pelajaran yang paling kamu kuasai</p>
              <div className="grid grid-cols-2 gap-3">
                {SUBJECTS.map(s => (
                  <button key={s.id} onClick={() => setForm({ ...form, subject: s.id })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98]
                      ${form.subject === s.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-violet-200'}`}>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${s.color} inline-block mb-2`}>{s.label}</span>
                    {form.subject === s.id && <span className="float-right text-violet-600 font-black text-sm">✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 1 — Pengalaman *//*}
          {step === 1 && (
            <>
              <h2 className="text-lg font-black text-gray-900 mb-1">Pengalamanmu</h2>
              <p className="text-xs text-gray-400 mb-5">Ceritakan latar belakang & pengalaman mengajarmu (min. 30 karakter)</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Latar belakang & pengalaman</label>
                  <textarea value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                    rows={5} placeholder="Contoh: Saya guru SMA dengan 8 tahun pengalaman mengajar Matematika. Saya juga pernah mengajar bimbel selama 3 tahun dan aktif membuat konten edukatif di YouTube..."
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50 resize-none" />
                  <p className={`text-xs mt-1 text-right ${form.experience.length >= 30 ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {form.experience.length}/30 min
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Lokasi</label>
                  <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="Contoh: Surabaya, Jawa Timur"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50" />
                </div>
              </div>
            </>
          )}

          {/* Step 2 — Motivasi & Kontak *//*}
          {step === 2 && (
            <>
              <h2 className="text-lg font-black text-gray-900 mb-1">Motivasi & kontak</h2>
              <p className="text-xs text-gray-400 mb-5">Nomor WA akan digunakan admin untuk konfirmasi</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Mengapa ingin jadi mentor? (min. 50 karakter)</label>
                  <textarea value={form.motivation} onChange={e => setForm({ ...form, motivation: e.target.value })}
Ceritakan kenapa kamu ingin berkontribusi di AkademikBelajar dan apa yang ingin kamu berikan untuk siswa di daerah...
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50 resize-none" />
                  <p className={`text-xs mt-1 text-right ${form.motivation.length >= 50 ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {form.motivation.length}/50 min
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Nomor WhatsApp aktif</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 font-mono">+62</span>
                    <input type="tel" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="812xxxxxxxx"
                      className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Admin akan hubungi kamu via WhatsApp ini untuk konfirmasi</p>
                </div>
              </div>
            </>
          )}

          {/* Step 3 — Konfirmasi *//*}
          {step === 3 && (
            <>
              <h2 className="text-lg font-black text-gray-900 mb-1">Konfirmasi permohonan</h2>
              <p className="text-xs text-gray-400 mb-5">Periksa kembali sebelum mengirim</p>
              <div className="space-y-3 mb-6">
                {[
                  { label: 'Nama', value: profile?.name || '-' },
                  { label: 'Bidang', value: SUBJECTS.find(s => s.id === form.subject)?.label },
                  { label: 'Lokasi', value: form.location || '-' },
                  { label: 'WhatsApp', value: `+62${form.whatsapp}` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2.5 border-b border-gray-100">
                    <span className="text-xs text-gray-400 font-semibold">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-2">
                <p className="text-xs text-violet-700 leading-relaxed">
Dengan mengirim permohonan ini, kamu setuju untuk menjaga kualitas konten dan mematuhi panduan mentor AkademikBelajar.
                </p>
              </div>
            </>
          )}

          {/* Navigation *//*}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-2xl text-sm hover:bg-gray-50 active:scale-[0.99] transition-all">
                ← Kembali
              </button>
            )}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} disabled={!canNext}
                className="flex-1 bg-violet-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-violet-700 active:scale-[0.99] transition-all text-white font-black py-3 rounded-2xl text-sm">
                Lanjut →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 bg-emerald-500 disabled:opacity-60 hover:bg-emerald-600 active:scale-[0.99] transition-all text-white font-black py-3 rounded-2xl text-sm">
                {loading ? 'Mengirim...' : '🚀 Kirim permohonan'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}*/