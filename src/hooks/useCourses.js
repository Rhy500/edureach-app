import { useEffect, useState } from 'react'
import { getCourses, getCourse, getUserProgress } from '../lib/supabase'
import { useAuth } from './useAuth'

// Hook untuk daftar kursus dengan filter
export function useCourses({ subject = 'semua', level = 'Semua' } = {}) {
  const [courses, setCourses]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const { user }                = useAuth()
  const [progress, setProgress] = useState({}) // { courseId: progressPct }

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getCourses({ subject, level })
        setCourses(data)

        // Load progress kalau user login
        if (user) {
          const prog = await getUserProgress(user.id)
          const map = {}
          prog.forEach(p => { map[p.course_id] = p.progress_pct })
          setProgress(map)
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [subject, level, user])

  // Gabungkan progress ke courses
  const coursesWithProgress = courses.map(c => ({
    ...c,
    progress: progress[c.id] ?? 0,
  }))

  return { courses: coursesWithProgress, loading, error }
}

// Hook untuk satu kursus + episode-nya
export function useCourse(courseId) {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!courseId) return
    async function load() {
      setLoading(true)
      try {
        const data = await getCourse(courseId)
        setCourse(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseId])

  return { course, loading, error }
}