import { useState } from 'react'
import { COURSES, getCourseById } from './lib/data.js'
import CourseCatalog from './components/CourseCatalog.jsx'
import CoursePage from './components/CoursePage.jsx'

export default function App() {
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const selectedCourse = selectedCourseId ? getCourseById(selectedCourseId) : null

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <button
            type="button"
            className="brand"
            onClick={() => setSelectedCourseId(null)}
          >
            <span className="brand-mark" aria-hidden="true">◆</span>
            <span className="brand-name">Chronicle</span>
          </button>
          <p className="brand-tagline">A learning studio for the history that shaped us</p>
        </div>
      </header>

      <main className="app-main">
        {selectedCourse ? (
          <CoursePage course={selectedCourse} onBack={() => setSelectedCourseId(null)} />
        ) : (
          <>
            <section className="hero">
              <h1>Study history the way it was lived.</h1>
              <p>
                Browse {COURSES.length} courses spanning empires, revolutions, and the long
                threads that connect them. Pick a course to explore its full syllabus and
                materials.
              </p>
            </section>
            <CourseCatalog courses={COURSES} onSelectCourse={setSelectedCourseId} />
          </>
        )}
      </main>
    </div>
  )
}
