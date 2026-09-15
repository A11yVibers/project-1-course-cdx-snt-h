import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { COURSES } from '../data/catalog.js'

const WEEK_FILTERS = [
  { label: 'Any length', test: () => true },
  { label: '5 weeks or fewer', test: (weeks) => weeks <= 5 },
  { label: '6–7 weeks', test: (weeks) => weeks >= 6 && weeks <= 7 },
  { label: '8+ weeks', test: (weeks) => weeks >= 8 },
]

export default function CatalogPage() {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [weekFilterIndex, setWeekFilterIndex] = useState(0)

  const instructors = useMemo(() => {
    const map = new Map()
    for (const course of COURSES) {
      if (course.instructor) map.set(course.instructor.id, course.instructor.name)
    }
    return Array.from(map.entries())
  }, [])

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const weekTest = WEEK_FILTERS[weekFilterIndex].test

    return COURSES.filter((course) => {
      const matchesQuery =
        !normalizedQuery ||
        course.name.toLowerCase().includes(normalizedQuery) ||
        course.shortDescription.toLowerCase().includes(normalizedQuery) ||
        (course.instructor && course.instructor.name.toLowerCase().includes(normalizedQuery))

      const matchesInstructor = instructorId === 'all' || course.instructor?.id === instructorId
      const matchesWeeks = weekTest(course.numberOfWeeks)

      return matchesQuery && matchesInstructor && matchesWeeks
    })
  }, [query, instructorId, weekFilterIndex])

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <h1>Study History, Sourced From the Past.</h1>
        <p>
          Explore a curated set of courses spanning ancient civilizations, empires,
          revolutions, and the networks that connected them &mdash; each with a full
          weekly syllabus and primary-source materials.
        </p>
      </section>

      <section className="catalog-controls" aria-label="Search and filter courses">
        <input
          type="search"
          className="catalog-search"
          placeholder="Search courses, topics, or instructors&hellip;"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search courses"
        />

        <div className="catalog-filters">
          <label className="filter-field">
            <span>Instructor</span>
            <select value={instructorId} onChange={(event) => setInstructorId(event.target.value)}>
              <option value="all">All instructors</option>
              {instructors.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Course length</span>
            <select
              value={weekFilterIndex}
              onChange={(event) => setWeekFilterIndex(Number(event.target.value))}
            >
              {WEEK_FILTERS.map((filter, index) => (
                <option key={filter.label} value={index}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <p className="catalog-count">
        {filteredCourses.length} of {COURSES.length} courses
      </p>

      <section className="catalog-grid">
        {filteredCourses.map((course) => (
          <Link key={course.id} to={`/courses/${course.id}`} className="course-card">
            <div className="course-card-media">
              <img src={course.imageUrl} alt="" loading="lazy" />
            </div>
            <div className="course-card-body">
              <span className="course-card-tag">
                {course.numberOfWeeks} weeks &middot; {course.numberOfClasses} classes
              </span>
              <h2>{course.name}</h2>
              <p>{course.shortDescription}</p>
              {course.instructor && (
                <div className="course-card-instructor">
                  <img src={course.instructor.photoUrl} alt="" />
                  <span>{course.instructor.name}</span>
                </div>
              )}
            </div>
          </Link>
        ))}

        {filteredCourses.length === 0 && (
          <p className="catalog-empty">No courses match your search. Try a different term or filter.</p>
        )}
      </section>
    </main>
  )
}
