import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourseById } from '../data/catalog.js'
import SyllabusTable from '../components/SyllabusTable.jsx'
import MaterialViewer from '../components/MaterialViewer.jsx'

export default function CoursePage() {
  const { courseId } = useParams()
  const course = getCourseById(courseId)
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false)
  const [activeMaterial, setActiveMaterial] = useState(null)

  if (!course) {
    return (
      <main className="course-page course-page-missing">
        <p>We couldn&rsquo;t find that course.</p>
        <Link to="/">Back to catalog</Link>
      </main>
    )
  }

  return (
    <main className={`course-page${isLeftCollapsed ? ' left-collapsed' : ''}`}>
      <div className="course-layout">
        <section className={`course-panel course-panel-left${isLeftCollapsed ? ' is-collapsed' : ''}`}>
          <button
            type="button"
            className="panel-collapse-toggle"
            onClick={() => setIsLeftCollapsed((value) => !value)}
            aria-expanded={!isLeftCollapsed}
            aria-label={isLeftCollapsed ? 'Expand course information' : 'Collapse course information'}
          >
            {isLeftCollapsed ? '»' : '«'}
          </button>

          <div className="course-panel-left-content">
            <Link to="/" className="course-back-link">
              &larr; All courses
            </Link>

            <p className="course-tag">
              {course.numberOfWeeks} weeks &middot; {course.numberOfClasses} classes
            </p>
            <h1>{course.name}</h1>
            <p className="course-description">{course.longDescription}</p>

            {course.instructor && (
              <div className="course-instructor">
                <img src={course.instructor.photoUrl} alt="" />
                <div>
                  <p className="course-instructor-name">{course.instructor.name}</p>
                  <p className="course-instructor-email">{course.instructor.email}</p>
                </div>
              </div>
            )}

            <h2 className="syllabus-heading">Syllabus</h2>
            <SyllabusTable
              classes={course.classes}
              activeMaterialId={activeMaterial?.id}
              onSelectMaterial={setActiveMaterial}
            />
          </div>
        </section>

        <section className="course-panel course-panel-right">
          {activeMaterial ? (
            <MaterialViewer material={activeMaterial} />
          ) : (
            <div className="course-hero-image">
              <img src={course.imageUrl} alt={course.name} />
              <p className="course-hero-caption">
                Select a class material from the syllabus to view it here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
