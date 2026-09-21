import { MaterialIcon } from './MaterialIcon.jsx'
import { materialTypeLabel } from '../utils/materialLabels.js'

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function Syllabus({ classes, activeMaterialId, onSelectMaterial }) {
  return (
    <table className="syllabus">
      <caption className="sr-only">Course syllabus with weekly class schedule and materials</caption>
      <thead>
        <tr>
          <th scope="col" className="syllabus__week-col">
            Week
          </th>
          <th scope="col" className="syllabus__date-col">
            Date
          </th>
          <th scope="col">Class Content</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((classItem) => (
          <tr key={classItem.id}>
            <td className="syllabus__week-col">{classItem.weekNumber}</td>
            <td className="syllabus__date-col">{formatDate(classItem.date)}</td>
            <td>
              <p className="syllabus__class-title">{classItem.className}</p>
              {classItem.materials.length > 0 ? (
                <ul className="syllabus__materials">
                  {classItem.materials.map((material) => (
                    <li key={material.id}>
                      <button
                        type="button"
                        className={
                          'syllabus__material-button' +
                          (activeMaterialId === material.id ? ' syllabus__material-button--active' : '')
                        }
                        onClick={() => onSelectMaterial(material)}
                        aria-pressed={activeMaterialId === material.id}
                      >
                        <MaterialIcon type={material.type} />
                        <span className="syllabus__material-title">{material.title}</span>
                        <span className="syllabus__material-type">{materialTypeLabel(material.type)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="syllabus__no-materials">Materials coming soon</p>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
