import { useState } from "react";
import { MENTORS, SUBJECTS, COURSES } from "../../data";

const subjectBadgeColor = {
  matematika: "bg-violet-100 text-violet-800",
  ipa: "bg-emerald-100 text-emerald-800",
  //coding: "bg-amber-100 text-amber-800",
  digital: "bg-pink-100 text-pink-800",
  bahasa: "bg-sky-100 text-sky-800",
  ips: "bg-orange-100 text-orange-800",
};

const avatarColors = [
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
];

function MentorCard({ mentor, onSelect, selected }) {
  const initials = mentor.name.split(" ").map(n => n[0]).slice(0, 2).join("");
  const avatarColor = avatarColors[mentor.id % avatarColors.length];
  const badgeColor = subjectBadgeColor[mentor.subject] || "bg-gray-100 text-gray-800";

  return (
    <div
      onClick={() => onSelect(mentor.id)}
      className={`bg-white rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg p-5
        ${selected ? "border-violet-400 shadow-md shadow-violet-100" : "border-gray-100"}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl ${avatarColor} flex items-center justify-center text-sm font-black flex-shrink-0`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-gray-900 text-sm leading-tight">{mentor.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{mentor.role}</p>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {mentor.badges?.map(b => (
              <span key={b} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed mb-4">{mentor.bio}</p>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
        {[
          { val: mentor.students, label: "Siswa" },
          { val: `${mentor.rating}★`, label: "Rating" },
          { val: mentor.courses, label: "Kursus" },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <div className="text-sm font-black text-gray-900">{stat.val}</div>
            <div className="text-[10px] text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <span>📍</span>
        <span>{mentor.location}</span>
      </div>
    </div>
  );
}

export default function MentorPage({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [filterSubject, setFilterSubject] = useState("semua");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const filtered = filterSubject === "semua" ? MENTORS : MENTORS.filter(m => m.subject === filterSubject);
  const selectedMentor = MENTORS.find(m => m.id === selected);

  // Dapatkan subject yang ada mentor
  const subjectsWithMentors = SUBJECTS.filter(s => MENTORS.some(m => m.subject === s.id));
  const filterButtons = [{ id: "semua", label: "Semua" }, ...subjectsWithMentors];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-black text-gray-900 mb-1">Mentor Sukarela</h1>
          <p className="text-sm text-gray-400">Terhubung langsung dengan mentor berpengalaman dari seluruh Indonesia</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { val: MENTORS.length, label: "Mentor aktif", color: "text-violet-600" },
            { val: MENTORS.reduce((a, m) => a + m.students, 0), label: "Total siswa", color: "text-emerald-600" },
            { val: MENTORS.length > 0 ? (MENTORS.reduce((a, m) => a + m.rating, 0) / MENTORS.length).toFixed(1) + "★" : "0★", label: "Rata-rata rating", color: "text-amber-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {filterButtons.map(s => (
            <button
              key={s.id}
              onClick={() => setFilterSubject(s.id)}
              className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all active:scale-95
                ${filterSubject === s.id
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Mentor grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(m => (
                <MentorCard key={m.id} mentor={m} onSelect={setSelected} selected={selected === m.id} />
              ))}
            </div>
          </div>

          {/* Detail / Contact Panel */}
          <div className="space-y-4">
            {selectedMentor ? (
              <>
                {/* Detail card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${avatarColors[selectedMentor.id % avatarColors.length]} flex items-center justify-center text-sm font-black`}>
                      {selectedMentor.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">{selectedMentor.name}</p>
                      <p className="text-xs text-gray-400">{selectedMentor.role}</p>
                    </div>
                  </div>

                  <h4 className="text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Kursus yang diajarkan</h4>
                  <div className="space-y-1.5 mb-4">
                    {COURSES?.filter(c => c.subject === selectedMentor.subject).slice(0, 3).map(c => (
                      <div
                        key={c.id}
                        onClick={() => onNavigate("video")}
                        className="flex items-center gap-2 text-xs text-gray-600 hover:text-violet-600 cursor-pointer transition-colors p-2 rounded-lg hover:bg-violet-50"
                      >
                        <span className="text-gray-300">►</span>
                        <span className="font-medium">{c.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h4 className="text-sm font-black text-gray-800 mb-3">Kirim pesan</h4>
                  {sent ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                      <div className="text-2xl mb-2">✉️</div>
                      <p className="text-sm font-black text-emerald-700">Pesan terkirim!</p>
                      <p className="text-xs text-emerald-600 mt-1">Mentor akan membalas dalam 1×24 jam</p>
                      <button onClick={() => setSent(false)} className="mt-3 text-xs text-emerald-600 underline">Kirim lagi</button>
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder={`Halo ${selectedMentor.name.split(" ")[1]}, saya ingin bertanya tentang...`}
                        rows={4}
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50 resize-none"
                      />
                      <button
                        onClick={() => message.trim() && setSent(true)}
                        disabled={!message.trim()}
                        className="w-full mt-3 bg-violet-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-violet-700 active:scale-[0.99] transition-all text-white font-black py-3 rounded-2xl text-sm"
                      >
                        Kirim pesan
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <div className="text-4xl mb-3">👆</div>
                <p className="text-sm font-bold text-gray-700">Pilih mentor</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">Klik salah satu kartu mentor untuk melihat detail dan mengirim pesan</p>
              </div>
            )}

            {/* Jadi mentor CTA */}
            <div className="bg-violet-600 rounded-2xl p-5 text-white">
              <p className="text-sm font-black mb-1">Ingin jadi mentor?</p>
              <p className="text-xs text-violet-200 mb-4 leading-relaxed">Bagikan ilmumu ke ribuan siswa di seluruh Indonesia. Gratis, fleksibel, bermakna.</p>
              <button className="w-full bg-white text-violet-700 font-black text-xs py-2.5 rounded-xl hover:bg-violet-50 active:scale-95 transition-all">
                Daftar jadi mentor →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}