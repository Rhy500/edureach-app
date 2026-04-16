import { useState } from "react";
import { QUIZ_QUESTIONS } from "../data";

export default function QuizPage({ onNavigate }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const q = QUIZ_QUESTIONS[current];
  const isCorrect = selected === q.correct;
  const score = answers.filter(a => a.correct).length;
  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  function handleConfirm() {
    if (selected === null) return;
    setConfirmed(true);
    setAnswers(prev => [...prev, { qid: q.id, selected, correct: selected === q.correct }]);
  }

  function handleNext() {
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    const grade = pct >= 80 ? "Luar biasa!" : pct >= 60 ? "Bagus!" : "Terus berlatih!";
    const gradeColor = pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-red-500";
    const gradeBg = pct >= 80 ? "bg-emerald-50 border-emerald-200" : pct >= 60 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
          <h1 className={`text-3xl font-black mb-1 ${gradeColor}`}>{grade}</h1>
          <p className="text-gray-400 text-sm mb-6">Kuis selesai — Aljabar dasar</p>

          <div className={`rounded-2xl border p-6 mb-6 ${gradeBg}`}>
            <div className={`text-5xl font-black mb-1 ${gradeColor}`}>{pct}%</div>
            <p className="text-sm text-gray-500">{score} dari {QUIZ_QUESTIONS.length} jawaban benar</p>
          </div>

          <div className="space-y-2 mb-6 text-left">
            {answers.map((a, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
                ${a.correct ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                <span className="font-black">{a.correct ? "✓" : "✗"}</span>
                <span className="font-medium">Soal {i + 1}</span>
                <span className="text-xs opacity-70">{a.correct ? "Benar" : "Salah"}</span>
              </div>
            ))}
          </div>

          {pct >= 80 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
              <span className="text-2xl">🏅</span>
              <div className="text-left">
                <p className="text-xs font-black text-amber-800">Badge Baru!</p>
                <p className="text-xs text-amber-600">Kamu mendapat badge "Jagoan Aljabar"</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setCurrent(0); setSelected(null); setConfirmed(false); setAnswers([]); setFinished(false); }}
              className="flex-1 text-sm font-semibold border border-gray-200 text-gray-600 py-3 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
            >
              Ulangi kuis
            </button>
            <button
              onClick={() => onNavigate("kursus")}
              className="flex-1 text-sm font-bold bg-violet-600 text-white py-3 rounded-2xl hover:bg-violet-700 active:scale-95 transition-all"
            >
              Kursus lain →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Kuis · Aljabar Dasar</p>
            <h1 className="text-lg font-black text-gray-900">Soal {current + 1} dari {QUIZ_QUESTIONS.length}</h1>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-violet-600">{score}</div>
            <div className="text-xs text-gray-400">poin</div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {QUIZ_QUESTIONS.map((_, i) => {
            const ans = answers[i];
            return (
              <div key={i} className={`h-2 flex-1 rounded-full transition-all
                ${i < answers.length
                  ? ans?.correct ? "bg-emerald-500" : "bg-red-400"
                  : i === current ? "bg-violet-400" : "bg-gray-200"}`}
              />
            );
          })}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-7 mb-5 shadow-sm">
          <p className="text-base font-black text-gray-900 leading-relaxed mb-6">{q.question}</p>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let style = "border-gray-200 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50";
              if (selected === i && !confirmed) style = "border-violet-500 bg-violet-50 text-violet-800";
              if (confirmed && i === q.correct) style = "border-emerald-500 bg-emerald-50 text-emerald-800";
              if (confirmed && selected === i && i !== q.correct) style = "border-red-400 bg-red-50 text-red-700";
              if (confirmed && selected !== i && i !== q.correct) style = "border-gray-100 bg-gray-50 text-gray-400";

              return (
                <button
                  key={i}
                  onClick={() => !confirmed && setSelected(i)}
                  disabled={confirmed}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.99] disabled:cursor-default ${style}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 border-2
                    ${confirmed && i === q.correct ? "bg-emerald-500 border-emerald-500 text-white"
                      : confirmed && selected === i && i !== q.correct ? "bg-red-400 border-red-400 text-white"
                      : selected === i && !confirmed ? "bg-violet-600 border-violet-600 text-white"
                      : "border-current bg-transparent"}`}
                  >
                    {confirmed && i === q.correct ? "✓" : confirmed && selected === i && i !== q.correct ? "✗" : ["A","B","C","D"][i]}
                  </div>
                  <span className="text-sm font-semibold">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {confirmed && (
            <div className={`mt-5 p-4 rounded-2xl flex gap-3 ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
              <span className="text-xl">{isCorrect ? "🎉" : "💡"}</span>
              <div>
                <p className={`text-xs font-black mb-1 ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                  {isCorrect ? "Jawaban benar! +20 XP" : "Kurang tepat"}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!confirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            className="w-full bg-violet-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-violet-700 active:scale-[0.99] transition-all text-white font-black py-4 rounded-2xl text-sm"
          >
            {selected === null ? "Pilih jawaban dulu..." : "Konfirmasi Jawaban"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.99] transition-all text-white font-black py-4 rounded-2xl text-sm"
          >
            {current < QUIZ_QUESTIONS.length - 1 ? `Soal berikutnya (${current + 2}/${QUIZ_QUESTIONS.length}) →` : "Lihat Hasil Kuis →"}
          </button>
        )}
      </div>
    </div>
  );
}