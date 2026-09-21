export function CourseCard({ course, onSelect }) {
  return (
    <article className="course-card">
      <button
        type="button"
        className="course-card__media"
        onClick={() => onSelect(course.id)}
        aria-label={`Open ${course.name}`}
      >
        <img src={course.imageUrl} alt={`${course.name} course artwork`} loading="lazy" />
        <span className="course-card__weeks">{course.numberOfWeeks} weeks</span>
      </button>
      <div className="course-card__body">
        <h3 className="course-card__title">
          <button type="button" className="course-card__title-link" onClick={() => onSelect(course.id)}>
            {course.name}
          </button>
        </h3>
        <p className="course-card__desc">{course.shortDescription}</p>
        <div className="course-card__meta">
          {course.instructor && (
            <span className="course-card__instructor">
              <img src={course.instructor.photoUrl} alt="" className="course-card__avatar" />
              {course.instructor.name}
            </span>
          )}
          <span className="course-card__classes">{course.numberOfClasses} classes</span>
        </div>
      </div>
    </article>
  )
}
