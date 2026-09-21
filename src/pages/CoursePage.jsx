import { useState } from 'react'
import { Syllabus } from '../components/Syllabus.jsx'
import { MaterialViewer } from '../components/MaterialViewer.jsx'
import { IconChevronLeft, IconChevronRight, IconScroll } from '../components/icons.jsx'

export function CoursePage({ course, onBack }) {
  const [activeMaterial, setActiveMaterial] = useState(null)
  const [isPanelOpen, setPanelOpen] = useState(true)

  return (
    <div className={'course-page' + (isPanelOpen ? '' : ' course-page--collapsed')}>
      <div className="course-page__topbar">
        <button type="button" className="button button--ghost" onClick={onBack}>
          <IconChevronLeft /> Back to catalog
        </button>
        <button
          type="button"
          className="course-page__toggle"
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={isPanelOpen}
          aria-controls="course-info-panel"
        >
          {isPanelOpen ? <IconChevronLeft /> : <IconChevronRight />}
          <span>{isPanelOpen ? 'Collapse syllabus' : 'Show syllabus'}</span>
        </button>
      </div>

      <div className="course-page__body">
        <section
          id="course-info-panel"
          className="course-panel"
          aria-hidden={!isPanelOpen}
        >
          <div className="course-panel__inner">
            <header className="course-panel__header">
              <p className="course-panel__id">{course.id}</p>
              <h1 className="course-panel__title">{course.name}</h1>
              {course.instructor && (
                <div className="course-panel__instructor">
                  <img src={course.instructor.photoUrl} alt="" className="course-panel__avatar" />
                  <div>
                    <p className="course-panel__instructor-name">{course.instructor.name}</p>
                    <p className="course-panel__instructor-email">{course.instructor.email}</p>
                  </div>
                </div>
              )}
              <div className="course-panel__stats">
                <span>{course.numberOfWeeks} weeks</span>
                <span aria-hidden="true">•</span>
                <span>{course.numberOfClasses} classes</span>
              </div>
              <p className="course-panel__description">{course.longDescription}</p>
            </header>

            <div className="course-panel__syllabus">
              <h2 className="course-panel__syllabus-heading">
                <IconScroll /> Syllabus
              </h2>
              <Syllabus
                classes={course.syllabus}
                activeMaterialId={activeMaterial?.id}
                onSelectMaterial={setActiveMaterial}
              />
            </div>
          </div>
        </section>

        <section className="course-viewer" aria-label="Course material viewer">
          {activeMaterial ? (
            <>
              <button
                type="button"
                className="course-viewer__reset"
                onClick={() => setActiveMaterial(null)}
              >
                <IconChevronLeft /> Back to course overview
              </button>
              <MaterialViewer material={activeMaterial} />
            </>
          ) : (
            <div className="course-viewer__hero">
              <img src={course.imageUrl} alt={`${course.name} course artwork`} />
              <div className="course-viewer__hero-caption">
                <p>{course.shortDescription}</p>
                <p className="course-viewer__hint">Select a material from the syllabus to view it here.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
