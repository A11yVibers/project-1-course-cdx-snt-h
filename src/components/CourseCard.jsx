export default function CourseCard({ course, onSelect }) {
  return (
    <article className="course-card">
      <button type="button" className="course-card-button" onClick={() => onSelect(course.id)}>
        <div className="course-card-image-wrap">
          <img src={course.imageUrl} alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="course-card-body">
          <p className="course-card-meta">
            {course.numberOfWeeks} weeks &middot; {course.numberOfClasses} classes
          </p>
          <h3 className="course-card-title">{course.name}</h3>
          <p className="course-card-description">{course.shortDescription}</p>
          {course.instructor && (
            <p className="course-card-instructor">Taught by {course.instructor.name}</p>
          )}
        </div>
      </button>
    </article>
  )
}
