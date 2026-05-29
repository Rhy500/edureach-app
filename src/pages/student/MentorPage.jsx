import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

const subjectMeta = {
  matematika: { color: "bg-violet-100 text-violet-800",  avatar: "bg-violet-100 text-violet-700"  },
  ipa:        { color: "bg-emerald-100 text-emerald-800", avatar: "bg-emerald-100 text-emerald-700" },
  coding:     { color: "bg-amber-100 text-amber-800",     avatar: "bg-amber-100 text-amber-700"    },
  digital:    { color: "bg-pink-100 text-pink-800",       avatar: "bg-pink-100 text-pink-700"      },
  bahasa:     { color: "bg-sky-100 text-sky-800",         avatar: "bg-sky-100 text-sky-700"        },
  ips:        { color: "bg-orange-100 text-orange-800",   avatar: "bg-orange-100 text-orange-700"  },
};

function MentorCard({ mentor, selected, onSelect }) {
  const meta     = subjectMeta[mentor.mentor_subject] || { color: "bg-gray-100 text-gray-700", avatar: "bg-gray-100 text-gray-700" };
  const initials = mentor.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div onClick={() => onSelect(mentor)}
      className={`bg-white rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg p-5
        ${selected ? "border-violet-400 shadow-md shadow-violet-100" : "border-gray-100"}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-12 h-12 rounded-2xl ${meta.avatar} flex items-center justify-center text-sm font-black flex-shrink-0`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-gray-900 text-sm leading-tight">{mentor.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{mentor.mentor_subject ? `Mentor ${mentor.mentor_subject}` : "Mentor"}</p>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {mentor.mentor_location && (
              <span className="text-[9px] text-gray-400">📍 {mentor.mentor_location}</span>
            )}
          </div>
        </div>
      </div>

      {mentor.mentor_bio && (
        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">{mentor.mentor_bio}</p>
      )}

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
        {[
          { val: mentor.totalStudents || 0,    label: "Siswa" },
          { val: `${mentor.avgRating || "—"}★`, label: "Rating" },
          { val: mentor.totalCourses || 0,     label: "Kursus" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="text-sm font-black text-gray-900">{s.val}</div>
            <div className="text-[10px] text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MentorPage({ onNavigate }) {
  const { user } = useAuth();

  const [mentors,        setMentors]        = useState([]);
  const [subjects,       setSubjects]       = useState([]);
  const [selected,       setSelected]       = useState(null);
  const [filterSubject,  setFilterSubject]  = useState("semua");
  const [loading,        setLoading]        = useState(true);
  const [message,        setMessage]        = useState("");
  const [sent,           setSent]           = useState(false);
  const [sending,        setSending]        = useState(false);
  const [mentorCourses,  setMentorCourses]  = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selected) fetchMentorCourses(selected.id);
  }, [selected]);

  async function fetchData() {
    setLoading(true);
    try {
      // ambil mentor yang sudah approved
      const { data: mentorData } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "mentor")
        .eq("mentor_status", "approved")
        .order("mentor_approved_at", { ascending: false });

      // ambil mata pelajaran
      const { data: subjData } = await supabase
        .from("subjects")
        .select("*")
        .order("order_num");

      setMentors(mentorData || []);
      setSubjects(subjData || []);
    } catch (e) {
      console.error("Gagal load mentor:", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMentorCourses(mentorId) {
    // ambil kursus yang dibuat oleh mentor ini
    // (berdasarkan created_by kalau ada, atau subject yang sama)
    const mentor = mentors.find(m => m.id === mentorId);
    if (!mentor?.mentor_subject) return;

    const { data } = await supabase
      .from("courses")
      .select("id, title, subject_id, level, episode_count")
      .eq("subject_id", mentor.mentor_subject)
      .eq("is_published", true)
      .limit(3);

    setMentorCourses(data || []);
  }

  async function handleSendMessage() {
    if (!message.trim() || !selected) return;
    setSending(true);
    // simpan pesan ke tabel (bisa dibuat tabel messages nanti)
    // untuk sekarang simulasi kirim
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  }

  const filtered = filterSubject === "semua"
    ? mentors
    : mentors.filter(m => m.mentor_subject === filterSubject);

  const totalStudents = mentors.reduce((a, m) => a + (m.totalStudents || 0), 0);
  const avgRating = mentors.length
    ? (mentors.reduce((a, m) => a + (m.avgRating || 4.8), 0) / mentors.length).toFixed(1)
    : "—";

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
            { val: loading ? "..." : mentors.length, label: "Mentor aktif",      color: "text-violet-600" },
            { val: loading ? "..." : totalStudents,  label: "Total siswa",       color: "text-emerald-600" },
            { val: loading ? "..." : `${avgRating}★`, label: "Rata-rata rating", color: "text-amber-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter mapel */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button onClick={() => setFilterSubject("semua")}
            className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all active:scale-95
              ${filterSubject === "semua" ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"}`}>
            Semua
          </button>
          {subjects.map(s => (
            <button key={s.id} onClick={() => setFilterSubject(s.id)}
              className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all active:scale-95
                ${filterSubject === s.id ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"}`}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Grid mentor */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-48 bg-white border border-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <div className="text-4xl mb-3">🎓</div>
                <p className="font-bold text-gray-700 mb-1">Belum ada mentor</p>
                <p className="text-xs text-gray-400">
                  {filterSubject === "semua"
                    ? "Belum ada mentor yang bergabung."
                    : "Belum ada mentor untuk mata pelajaran ini."}
                </p>
                {user && (
                  <button onClick={() => onNavigate && onNavigate("/mentor/daftar")}
                    className="mt-4 text-sm font-bold text-violet-600 border border-violet-200 px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors">
                    Jadilah mentor pertama →
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map(m => (
                  <MentorCard key={m.id} mentor={m}
                    selected={selected?.id === m.id}
                    onSelect={setSelected} />
                ))}
              </div>
            )}
          </div>

          {/* Panel detail + kirim pesan */}
          <div className="space-y-4">
            {selected ? (
              <>
                {/* Detail mentor */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-2xl ${subjectMeta[selected.mentor_subject]?.avatar || "bg-gray-100 text-gray-700"} flex items-center justify-center text-sm font-black`}>
                      {selected.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">{selected.name}</p>
                      <p className="text-xs text-gray-400">{selected.mentor_subject ? `Bidang: ${selected.mentor_subject}` : ""}</p>
                    </div>
                  </div>

                  {mentorCourses.length > 0 && (
                    <>
                      <h4 className="text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Kursus terkait</h4>
                      <div className="space-y-1.5 mb-2">
                        {mentorCourses.map(c => (
                          <button key={c.id} onClick={() => onNavigate && onNavigate("/video")}
                            className="w-full flex items-center gap-2 text-xs text-gray-600 hover:text-violet-600 cursor-pointer transition-colors p-2 rounded-lg hover:bg-violet-50 text-left">
                            <span className="text-gray-300">►</span>
                            <span className="font-medium truncate">{c.title}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Form kirim pesan */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h4 className="text-sm font-black text-gray-800 mb-3">Kirim pesan</h4>
                  {!user ? (
                    <div className="text-center py-3">
                      <p className="text-xs text-gray-400 mb-3">Login dulu untuk kirim pesan</p>
                      <button onClick={() => onNavigate && onNavigate("/login")}
                        className="text-sm font-bold text-violet-600 border border-violet-200 px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors">
                        Login
                      </button>
                    </div>
                  ) : sent ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                      <div className="text-2xl mb-2">✉️</div>
                      <p className="text-sm font-black text-emerald-700">Pesan terkirim!</p>
                      <p className="text-xs text-emerald-600 mt-1">Mentor akan membalas dalam 1×24 jam</p>
                      <button onClick={() => { setSent(false); setMessage(""); }}
                        className="mt-3 text-xs text-emerald-600 underline">Kirim lagi</button>
                    </div>
                  ) : (
                    <>
                      <textarea value={message} onChange={e => setMessage(e.target.value)}
                        placeholder={`Halo ${selected.name?.split(" ")[0]}, saya ingin bertanya...`}
                        rows={4}
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50 resize-none" />
                      <button onClick={handleSendMessage}
                        disabled={!message.trim() || sending}
                        className="w-full mt-3 bg-violet-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-violet-700 active:scale-[0.99] transition-all text-white font-black py-3 rounded-2xl text-sm">
                        {sending ? "Mengirim..." : "Kirim pesan"}
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <div className="text-4xl mb-3">👆</div>
                <p className="text-sm font-bold text-gray-700">Pilih mentor</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Klik kartu mentor untuk lihat detail dan kirim pesan
                </p>
              </div>
            )}

            {/* CTA jadi mentor */}
            <div className="bg-violet-600 rounded-2xl p-5 text-white">
              <p className="text-sm font-black mb-1">Ingin jadi mentor?</p>
              <p className="text-xs text-violet-200 mb-4 leading-relaxed">
                Bagikan ilmumu ke ribuan siswa di seluruh Indonesia. Gratis, fleksibel, bermakna.
              </p>
              <button onClick={() => onNavigate && onNavigate("/mentor/daftar")}
                className="w-full bg-white text-violet-700 font-black text-xs py-2.5 rounded-xl hover:bg-violet-50 active:scale-95 transition-all">
                Daftar jadi mentor →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}