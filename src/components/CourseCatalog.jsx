import { useMemo, useState } from 'react'
import CourseCard from './CourseCard.jsx'

const LENGTH_FILTERS = [
  { id: 'all', label: 'Any length' },
  { id: 'short', label: '5 weeks or fewer' },
  { id: 'medium', label: '6-7 weeks' },
  { id: 'long', label: '8+ weeks' },
]

function matchesLength(course, lengthFilter) {
  if (lengthFilter === 'all') return true
  if (lengthFilter === 'short') return course.numberOfWeeks <= 5
  if (lengthFilter === 'medium') return course.numberOfWeeks >= 6 && course.numberOfWeeks <= 7
  return course.numberOfWeeks >= 8
}

export default function CourseCatalog({ courses, onSelectCourse }) {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [lengthFilter, setLengthFilter] = useState('all')

  const instructors = useMemo(() => {
    const seen = new Map()
    courses.forEach((course) => {
      if (course.instructor) seen.set(course.instructor.id, course.instructor.name)
    })
    return Array.from(seen, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [courses])

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        course.name.toLowerCase().includes(normalizedQuery) ||
        course.shortDescription.toLowerCase().includes(normalizedQuery) ||
        course.longDescription.toLowerCase().includes(normalizedQuery)
      const matchesInstructor = instructorId === 'all' || course.instructor?.id === instructorId
      return matchesQuery && matchesInstructor && matchesLength(course, lengthFilter)
    })
  }, [courses, query, instructorId, lengthFilter])

  return (
    <section className="catalog">
      <div className="catalog-toolbar">
        <label className="catalog-search" htmlFor="catalog-search-input">
          <span className="visually-hidden">Search courses</span>
          <input
            id="catalog-search-input"
            type="search"
            placeholder="Search by topic, era, or keyword..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <label className="catalog-filter">
          <span>Instructor</span>
          <select value={instructorId} onChange={(event) => setInstructorId(event.target.value)}>
            <option value="all">All instructors</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </label>

        <label className="catalog-filter">
          <span>Length</span>
          <select value={lengthFilter} onChange={(event) => setLengthFilter(event.target.value)}>
            {LENGTH_FILTERS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="catalog-result-count">
        {filteredCourses.length} of {courses.length} courses
      </p>

      {filteredCourses.length > 0 ? (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} onSelect={onSelectCourse} />
          ))}
        </div>
      ) : (
        <p className="catalog-empty">No courses match your search. Try a different keyword or filter.</p>
      )}
    </section>
  )
}
