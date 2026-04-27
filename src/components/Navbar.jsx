import { useAuth } from '../hooks/useAuth'
import { signOut } from '../lib/supabase'

export default function Navbar({ activePage, onNavigate }) {
  const { user, profile } = useAuth()

  async function handleSignOut() {
    await signOut()
    onNavigate('/')
  }

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  const links = [
    { id: 'kursus', label: 'Kursus', path: '/kursus' },
    { id: 'mentor', label: 'Mentor', path: '/mentor' },
    ...(user ? [{ id: 'performa', label: 'Performa', path: '/performa' }] : []),
  ]

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">

        <button onClick={() => onNavigate('/')} className="text-xl font-black tracking-tight">
          <span className="text-violet-600">Edu</span><span className="text-emerald-500">Reach</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button key={l.id} onClick={() => onNavigate(l.path)}
              className={`text-sm px-4 py-2 rounded-lg transition-all
                ${activePage === l.id
                  ? 'bg-violet-50 text-violet-700 font-semibold'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {profile && (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-xs text-gray-400">{profile.xp} XP</span>
                  <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                    Lv.{profile.level_num}
                  </span>
                </div>
              )}
              <button onClick={() => onNavigate('/performa')}
                className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-black hover:bg-violet-200 transition-colors">
                {initials}
              </button>
              <button onClick={handleSignOut}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors hidden md:block">
                Keluar
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => onNavigate('/login')}
                className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all">
                Masuk
              </button>
              <button onClick={() => onNavigate('/register')}
                className="text-sm bg-violet-600 hover:bg-violet-700 active:scale-95 transition-all text-white font-semibold px-5 py-2 rounded-full">
                Daftar gratis
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}