export default function Navbar({ activePage, onNavigate }) {
  const links = [
    { id: "landing", label: "Beranda" },
    { id: "kursus", label: "Kursus" },
    { id: "performa", label: "Performa" },
    { id: "mentor", label: "Mentor" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <button onClick={() => onNavigate("landing")} className="text-xl font-bold tracking-tight">
          <span className="text-violet-600">Edu</span><span className="text-emerald-500">Reach</span>
        </button>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              className={`text-sm px-4 py-2 rounded-lg transition-all ${
                activePage === l.id
                  ? "bg-violet-50 text-violet-700 font-semibold"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("login")}
            className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
          >
            Masuk
          </button>
          <button
            onClick={() => onNavigate("register")}
            className="text-sm bg-violet-600 hover:bg-violet-700 active:scale-95 transition-all text-white font-semibold px-5 py-2 rounded-full"
          >
            Daftar gratis
          </button>
        </div>
      </div>
    </nav>
  );
}