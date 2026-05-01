import { useState } from 'react'
import { signIn, signUp, signInWithGoogle } from "../../lib/supabase" 

// ── LOGIN ─────────────────────────────────────────
export function LoginPage({ onNavigate }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await Supabase.signIn({ email, password })
      onNavigate('performa')
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email atau password salah. Coba lagi.'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    try { await Supabase.signInWithGoogle() }
    catch (err) { setError(err.message) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <button onClick={() => onNavigate('landing')} className="text-3xl font-black">
            <span className="text-violet-600">Edu</span><span className="text-emerald-500">Reach</span>
          </button>
          <p className="text-gray-400 text-sm mt-2">Selamat datang kembali 👋</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
          <h2 className="text-xl font-black text-gray-900 mb-6">Masuk ke akun</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-2xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="namakamu@email.com" required
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-600">Password</label>
                <button type="button" className="text-xs text-violet-600 hover:underline">Lupa password?</button>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter" required
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 active:scale-[0.99] transition-all text-white font-black py-3.5 rounded-2xl text-sm mt-2">
              {loading ? 'Masuk...' : 'Masuk sekarang'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">atau</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.99] transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Masuk dengan Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          Belum punya akun?{' '}
          <button onClick={() => onNavigate('register')} className="text-violet-600 font-bold hover:underline">
            Daftar gratis
          </button>
        </p>
      </div>
    </div>
  )
}

// ── REGISTER ──────────────────────────────────────
export function RegisterPage({ onNavigate }) {
  const [step, setStep]     = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: '', grade: '' })

  const roles = [
    { id: 'siswa',  label: 'Siswa',       icon: '📚', desc: 'Ingin belajar & berkembang' },
    { id: 'mentor', label: 'Mentor',      icon: '🎓', desc: 'Ingin berbagi ilmu' },
    { id: 'ortu',   label: 'Orang Tua',   icon: '👨‍👩‍👧', desc: 'Memantau perkembangan anak' },
  ]
  const grades = ['SD Kelas 1–3', 'SD Kelas 4–6', 'SMP Kelas 7–9', 'SMA Kelas 10–12', 'Umum']

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      await Supabase.signUp({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        grade: form.grade,
      })
      onNavigate('performa')
    } catch (err) {
      const msg = err.message.includes('already registered')
        ? 'Email ini sudah terdaftar. Coba masuk.'
        : err.message
      setError(msg)
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="text-center mb-6">
          <button onClick={() => onNavigate('landing')} className="text-3xl font-black">
            <span className="text-violet-600">Edu</span><span className="text-emerald-500">Reach</span>
          </button>
          <p className="text-gray-400 text-sm mt-2">Buat akun gratis kamu sekarang</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all
                ${s < step ? 'bg-emerald-500 text-white' : s === step ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {s < step ? '✓' : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 rounded-full ${s < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-2xl mb-4">
              {error}
            </div>
          )}

          {/* Step 1 — Data diri */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-black text-gray-900 mb-1">Data diri</h2>
              <p className="text-xs text-gray-400 mb-5">Langkah 1 dari 3</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Nama lengkap</label>
                  <input type="text" placeholder="Nama kamu" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-gray-50 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Email</label>
                  <input type="email" placeholder="namakamu@email.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-gray-50 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Password</label>
                  <input type="password" placeholder="Minimal 8 karakter" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-gray-50 transition-all" />
                </div>
                <button
                  onClick={() => form.name && form.email && form.password.length >= 8 && setStep(2)}
                  disabled={!form.name || !form.email || form.password.length < 8}
                  className="w-full bg-violet-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-violet-700 active:scale-[0.99] transition-all text-white font-black py-3.5 rounded-2xl text-sm">
                  Lanjut →
                </button>
              </div>
            </>
          )}

          {/* Step 2 — Peran */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-black text-gray-900 mb-1">Kamu siapa?</h2>
              <p className="text-xs text-gray-400 mb-5">Langkah 2 dari 3</p>
              <div className="space-y-3 mb-5">
                {roles.map(r => (
                  <button key={r.id} onClick={() => setForm({ ...form, role: r.id })}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.99]
                      ${form.role === r.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-violet-200'}`}>
                    <span className="text-2xl">{r.icon}</span>
                    <div>
                      <p className="text-sm font-black text-gray-800">{r.label}</p>
                      <p className="text-xs text-gray-400">{r.desc}</p>
                    </div>
                    {form.role === r.id && <span className="ml-auto text-violet-600 font-black">✓</span>}
                  </button>
                ))}
              </div>
              <button onClick={() => form.role && setStep(3)} disabled={!form.role}
                className="w-full bg-violet-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-violet-700 active:scale-[0.99] transition-all text-white font-black py-3.5 rounded-2xl text-sm">
                Lanjut →
              </button>
            </>
          )}

          {/* Step 3 — Jenjang */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-black text-gray-900 mb-1">Jenjang kelas</h2>
              <p className="text-xs text-gray-400 mb-5">Langkah 3 dari 3</p>
              <div className="space-y-2.5 mb-5">
                {grades.map(g => (
                  <button key={g} onClick={() => setForm({ ...form, grade: g })}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all active:scale-[0.99]
                      ${form.grade === g ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-700 hover:border-emerald-200'}`}>
                    <span className="text-sm font-semibold">{g}</span>
                    {form.grade === g && <span className="text-emerald-600 font-black">✓</span>}
                  </button>
                ))}
              </div>
              <button onClick={handleSubmit} disabled={!form.grade || loading}
                className="w-full bg-emerald-500 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-emerald-600 active:scale-[0.99] transition-all text-white font-black py-3.5 rounded-2xl text-sm">
                {loading ? 'Membuat akun...' : '🚀 Buat akun gratis!'}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          Sudah punya akun?{' '}
          <button onClick={() => onNavigate('login')} className="text-violet-600 font-bold hover:underline">
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  )
}