import { useHashRoute, navigateTo } from './hooks/useHashRoute.js'
import { getCourseById } from './data/index.js'
import { CourseCatalog } from './pages/CourseCatalog.jsx'
import { CoursePage } from './pages/CoursePage.jsx'

export default function App() {
  const route = useHashRoute()

  function goToCourse(courseId) {
    navigateTo(`/course/${courseId}`)
  }

  function goToCatalog() {
    navigateTo('/')
  }

  const activeCourse = route.name === 'course' ? getCourseById(route.courseId) : null

  return (
    <div className="app">
      <header className="app__header">
        <button type="button" className="app__brand" onClick={goToCatalog}>
          <span className="app__brand-mark" aria-hidden="true">
            HL
          </span>
          <span className="app__brand-name">Historia</span>
        </button>
      </header>

      <main className="app__main">
        {activeCourse ? (
          <CoursePage key={activeCourse.id} course={activeCourse} onBack={goToCatalog} />
        ) : (
          <CourseCatalog onSelectCourse={goToCourse} />
        )}
      </main>
    </div>
  )
}
