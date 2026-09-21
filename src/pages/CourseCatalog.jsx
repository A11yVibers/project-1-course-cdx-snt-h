import { useMemo, useState } from 'react'
import { courses } from '../data/index.js'
import { CourseCard } from '../components/CourseCard.jsx'
import { IconSearch } from '../components/icons.jsx'

const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Title (A–Z)' },
  { value: 'weeks-asc', label: 'Weeks (shortest first)' },
  { value: 'weeks-desc', label: 'Weeks (longest first)' },
]

function sortCourses(list, sortValue) {
  const sorted = [...list]
  switch (sortValue) {
    case 'weeks-asc':
      sorted.sort((a, b) => a.numberOfWeeks - b.numberOfWeeks)
      break
    case 'weeks-desc':
      sorted.sort((a, b) => b.numberOfWeeks - a.numberOfWeeks)
      break
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name))
  }
  return sorted
}

export function CourseCatalog({ onSelectCourse }) {
  const [query, setQuery] = useState('')
  const [instructorFilter, setInstructorFilter] = useState('all')
  const [sortValue, setSortValue] = useState('title-asc')

  const instructors = useMemo(() => {
    const seen = new Map()
    for (const course of courses) {
      if (course.instructor && !seen.has(course.instructor.id)) {
        seen.set(course.instructor.id, course.instructor.name)
      }
    }
    return Array.from(seen, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }, [])

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = courses.filter((course) => {
      const matchesInstructor =
        instructorFilter === 'all' || course.instructor?.id === instructorFilter
      if (!matchesInstructor) return false
      if (!normalizedQuery) return true
      const haystack = `${course.name} ${course.shortDescription} ${course.longDescription}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
    return sortCourses(filtered, sortValue)
  }, [query, instructorFilter, sortValue])

  return (
    <div className="catalog">
      <section className="catalog__hero">
        <p className="catalog__eyebrow">Digital History Studio</p>
        <h1 className="catalog__title">Step into the past, one course at a time.</h1>
        <p className="catalog__subtitle">
          Twelve guided history courses spanning ancient civilizations to the twentieth century,
          each with a full syllabus, primary-source readings, lectures, and assignments ready to explore.
        </p>
      </section>

      <section className="catalog__controls" aria-label="Search and filter courses">
        <label className="catalog__search">
          <IconSearch />
          <input
            type="search"
            placeholder="Search courses by title, era, or topic…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search courses"
          />
        </label>

        <label className="catalog__select">
          <span>Instructor</span>
          <select
            value={instructorFilter}
            onChange={(event) => setInstructorFilter(event.target.value)}
          >
            <option value="all">All instructors</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </label>

        <label className="catalog__select">
          <span>Sort by</span>
          <select value={sortValue} onChange={(event) => setSortValue(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <p className="catalog__count" role="status">
        {filteredCourses.length} of {courses.length} courses
      </p>

      {filteredCourses.length === 0 ? (
        <p className="catalog__empty">No courses match your search. Try a different keyword.</p>
      ) : (
        <div className="catalog__grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} onSelect={onSelectCourse} />
          ))}
        </div>
      )}
    </div>
  )
}
