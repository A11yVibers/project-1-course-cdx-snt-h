import { useState } from 'react'
import CourseSyllabus from './CourseSyllabus.jsx'
import MaterialViewer from './MaterialViewer.jsx'

export default function CoursePage({ course, onBack }) {
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [activeMaterial, setActiveMaterial] = useState(null)

  const handleSelectMaterial = (material) => {
    setActiveMaterial((current) => (current?.id === material.id ? null : material))
  }

  return (
    <div className="course-page">
      <div className="course-page-topbar">
        <button type="button" className="back-link" onClick={onBack}>
          &larr; Back to catalog
        </button>
      </div>

      <div className={`course-page-layout${isPanelOpen ? '' : ' course-page-layout--collapsed'}`}>
        <section className={`course-panel${isPanelOpen ? '' : ' course-panel--collapsed'}`}>
          <button
            type="button"
            className="course-panel-toggle"
            onClick={() => setIsPanelOpen((open) => !open)}
            aria-expanded={isPanelOpen}
            aria-controls="course-panel-body"
          >
            <span aria-hidden="true">{isPanelOpen ? '⟨' : '⟩'}</span>
            <span className="course-panel-toggle-label">
              {isPanelOpen ? 'Collapse' : 'Course info'}
            </span>
          </button>

          {isPanelOpen && (
            <div id="course-panel-body" className="course-panel-body">
              <header className="course-info">
                <p className="course-info-eyebrow">
                  {course.numberOfWeeks} weeks &middot; {course.numberOfClasses} classes
                </p>
                <h1>{course.name}</h1>
                <p className="course-info-description">{course.longDescription}</p>
                {course.instructor && (
                  <div className="course-instructor">
                    <img
                      src={course.instructor.photoUrl}
                      alt={`Portrait of ${course.instructor.name}`}
                      className="course-instructor-photo"
                    />
                    <div>
                      <p className="course-instructor-name">{course.instructor.name}</p>
                      <a className="course-instructor-email" href={`mailto:${course.instructor.email}`}>
                        {course.instructor.email}
                      </a>
                    </div>
                  </div>
                )}
              </header>

              <div className="course-syllabus-section">
                <h2>Syllabus</h2>
                <CourseSyllabus
                  course={course}
                  activeMaterialId={activeMaterial?.id ?? null}
                  onSelectMaterial={handleSelectMaterial}
                />
              </div>
            </div>
          )}
        </section>

        <section className="course-viewer">
          <MaterialViewer course={course} activeMaterial={activeMaterial} />
        </section>
      </div>
    </div>
  )
}
