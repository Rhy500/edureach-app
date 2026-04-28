// ─────────────────────────────────────────────────
// src/data.js
// Data statis untuk komponen yang belum terhubung Supabase
// ─────────────────────────────────────────────────

export const SUBJECTS = [
  { id: "semua",      label: "Semua",            icon: "◈",   color: "bg-gray-100 text-gray-700",         bar: "bg-gray-400",    light: "bg-gray-50",    hex: "#888" },
  { id: "matematika", label: "Matematika",        icon: "∑",   color: "bg-violet-100 text-violet-800",     bar: "bg-violet-500",  light: "bg-violet-50",  hex: "#7F77DD" },
  { id: "ipa",        label: "IPA",               icon: "⚛",   color: "bg-emerald-100 text-emerald-800",   bar: "bg-emerald-500", light: "bg-emerald-50", hex: "#1D9E75" },
  { id: "coding",     label: "Coding",            icon: "</>", color: "bg-amber-100 text-amber-800",       bar: "bg-amber-500",   light: "bg-amber-50",   hex: "#BA7517" },
  { id: "digital",    label: "Literasi Digital",  icon: "AI",  color: "bg-pink-100 text-pink-800",         bar: "bg-pink-500",    light: "bg-pink-50",    hex: "#D4537E" },
  { id: "bahasa",     label: "Bahasa Indonesia",  icon: "Aa",  color: "bg-sky-100 text-sky-800",           bar: "bg-sky-500",     light: "bg-sky-50",     hex: "#378ADD" },
  { id: "ips",        label: "IPS",               icon: "◉",   color: "bg-orange-100 text-orange-800",     bar: "bg-orange-500",  light: "bg-orange-50",  hex: "#D85A30" },
];

export const COURSES = [
  { id: 1,  title: "Aljabar dasar untuk pemula",        subject: "matematika", level: "SMP", episodes: 5, duration: "38 mnt", progress: 0,   isNew: false },
  { id: 2,  title: "Sistem tata surya & planet",        subject: "ipa",        level: "SMP", episodes: 4, duration: "29 mnt", progress: 0,   isNew: false },
  { id: 3,  title: "Pengenalan Python untuk pemula",    subject: "coding",     level: "SMA", episodes: 6, duration: "51 mnt", progress: 0,   isNew: true  },
  { id: 4,  title: "Internet sehat & keamanan digital", subject: "digital",    level: "SMP", episodes: 4, duration: "22 mnt", progress: 0,   isNew: false },
  { id: 5,  title: "Pecahan & desimal kelas 5",         subject: "matematika", level: "SD",  episodes: 5, duration: "33 mnt", progress: 0,   isNew: false },
  { id: 6,  title: "Sel dan jaringan makhluk hidup",    subject: "ipa",        level: "SMA", episodes: 7, duration: "58 mnt", progress: 0,   isNew: true  },
  { id: 7,  title: "Mengenal AI & machine learning",    subject: "digital",    level: "SMA", episodes: 5, duration: "40 mnt", progress: 0,   isNew: true  },
  { id: 8,  title: "HTML & CSS dari nol",               subject: "coding",     level: "SMP", episodes: 8, duration: "64 mnt", progress: 0,   isNew: false },
  { id: 9,  title: "Teks narasi & cerita pendek",       subject: "bahasa",     level: "SMP", episodes: 4, duration: "28 mnt", progress: 0,   isNew: false },
  { id: 10, title: "Kerajaan-kerajaan Nusantara",       subject: "ips",        level: "SMP", episodes: 6, duration: "44 mnt", progress: 0,   isNew: false },
  { id: 11, title: "Persamaan kuadrat & grafik",        subject: "matematika", level: "SMA", episodes: 6, duration: "49 mnt", progress: 0,   isNew: false },
  { id: 12, title: "Penjumlahan & pengurangan dasar",   subject: "matematika", level: "SD",  episodes: 3, duration: "18 mnt", progress: 100, isNew: false },
];

export const EPISODES = [
  { id: 1, num: 1, title: "Apa itu variabel?",                     duration: "5:10", done: true,  active: false },
  { id: 2, num: 2, title: "Operasi dasar aljabar",                 duration: "6:33", done: true,  active: false },
  { id: 3, num: 3, title: "Persamaan linear satu variabel",        duration: "7:42", done: false, active: true  },
  { id: 4, num: 4, title: "Latihan soal bersama",                  duration: "9:05", done: false, active: false },
  { id: 5, num: 5, title: "Kuis & penutup",                        duration: "4:20", done: false, active: false },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Jika 2x + 4 = 12, berapakah nilai x?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    explanation: "2x + 4 = 12 → 2x = 8 → x = 4. Kurangi kedua sisi dengan 4, lalu bagi dengan 2.",
  },
  {
    id: 2,
    question: "Manakah yang termasuk persamaan linear?",
    options: ["x² + 3 = 7", "2x + 5 = 11", "x³ = 27", "√x = 4"],
    correct: 1,
    explanation: "Persamaan linear memiliki pangkat tertinggi 1. Hanya 2x + 5 = 11 yang memenuhi.",
  },
  {
    id: 3,
    question: "Variabel dalam aljabar adalah...",
    options: [
      "Angka tetap yang diketahui",
      "Simbol yang mewakili nilai tidak diketahui",
      "Hasil dari persamaan",
      "Operasi matematika",
    ],
    correct: 1,
    explanation: "Variabel adalah huruf (seperti x, y) yang mewakili nilai yang belum diketahui.",
  },
  {
    id: 4,
    question: "Selesaikan: 3x - 6 = 9",
    options: ["x = 1", "x = 3", "x = 5", "x = 7"],
    correct: 2,
    explanation: "3x - 6 = 9 → 3x = 15 → x = 5.",
  },
  {
    id: 5,
    question: "Bentuk sederhana dari 4x + 2x - x adalah...",
    options: ["5x", "6x", "7x", "4x"],
    correct: 0,
    explanation: "Kumpulkan suku sejenis: 4x + 2x - x = (4+2-1)x = 5x.",
  },
];

export const MENTORS = [
  {
    id: 1,
    name: "Pak Dimas Pratama",
    role: "Mentor Matematika",
    subject: "matematika",
    location: "Yogyakarta",
    students: 142,
    rating: 4.9,
    courses: 8,
    bio: "Guru SMA dengan 10 tahun pengalaman. Spesialis aljabar dan kalkulus dasar.",
    badges: ["Top Mentor", "5★ Rating"],
  },
  {
    id: 2,
    name: "Bu Sari Dewi",
    role: "Mentor IPA",
    subject: "ipa",
    location: "Bandung",
    students: 98,
    rating: 4.8,
    courses: 5,
    bio: "Lulusan Biologi ITB. Passionate tentang sains dan ingin lebih banyak siswa Indonesia mencintai IPA.",
    badges: ["Aktif", "Responsif"],
  },
  {
    id: 3,
    name: "Kak Rizky Aulia",
    role: "Mentor Coding",
    subject: "coding",
    location: "Jakarta",
    students: 210,
    rating: 4.9,
    courses: 12,
    bio: "Software engineer di startup teknologi. Mengajar coding sejak kuliah.",
    badges: ["Top Mentor", "Terpopuler"],
  },
  {
    id: 4,
    name: "Bu Nadia Farah",
    role: "Mentor Literasi Digital",
    subject: "digital",
    location: "Surabaya",
    students: 75,
    rating: 4.7,
    courses: 4,
    bio: "Konsultan keamanan digital dan edukator teknologi.",
    badges: ["Baru", "Aktif"],
  },
];