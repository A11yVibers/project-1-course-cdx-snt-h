import { formatDate, materialTypeIcon, materialTypeLabel } from '../lib/format.js'

export default function CourseSyllabus({ course, activeMaterialId, onSelectMaterial }) {
  return (
    <div className="syllabus">
      <table className="syllabus-table">
        <thead>
          <tr>
            <th scope="col">Week</th>
            <th scope="col">Date</th>
            <th scope="col">Class Content</th>
          </tr>
        </thead>
        <tbody>
          {course.classes.map((classItem) => (
            <tr key={classItem.id}>
              <td className="syllabus-week">{classItem.weekNumber}</td>
              <td className="syllabus-date">{formatDate(classItem.date)}</td>
              <td className="syllabus-content">
                <p className="syllabus-class-title">{classItem.name}</p>
                {classItem.materials.length > 0 ? (
                  <ul className="syllabus-materials">
                    {classItem.materials.map((material) => {
                      const isActive = material.id === activeMaterialId
                      return (
                        <li key={material.id}>
                          <button
                            type="button"
                            className={`material-link${isActive ? ' material-link--active' : ''}`}
                            onClick={() => onSelectMaterial(material)}
                            aria-pressed={isActive}
                          >
                            <span className="material-link-icon" aria-hidden="true">
                              {materialTypeIcon(material.type)}
                            </span>
                            <span className="material-link-title">{material.title}</span>
                            <span className="material-link-type">{materialTypeLabel(material.type)}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="syllabus-no-materials">Materials coming soon.</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
