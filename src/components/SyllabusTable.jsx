import React from 'react'
import { getMaterialMeta } from '../lib/materialMeta.js'

function formatDate(isoDate) {
  if (!isoDate) return ''
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function SyllabusTable({ classes, activeMaterialId, onSelectMaterial }) {
  return (
    <table className="syllabus-table">
      <thead>
        <tr>
          <th scope="col">Week</th>
          <th scope="col">Date</th>
          <th scope="col">Class Content</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((classItem) => (
          <tr key={classItem.id}>
            <td className="syllabus-week">{classItem.weekNumber}</td>
            <td className="syllabus-date">{formatDate(classItem.date)}</td>
            <td className="syllabus-content">
              <p className="syllabus-class-title">{classItem.title}</p>
              {classItem.materials.length > 0 ? (
                <ul className="syllabus-materials">
                  {classItem.materials.map((material) => {
                    const meta = getMaterialMeta(material.type)
                    const isActive = material.id === activeMaterialId
                    return (
                      <li key={material.id}>
                        <button
                          type="button"
                          className={`material-link${isActive ? ' is-active' : ''}`}
                          onClick={() => onSelectMaterial(material)}
                        >
                          <span className="material-link-icon" aria-hidden="true">
                            {meta.icon}
                          </span>
                          <span className="material-link-label">{material.title}</span>
                          <span className="material-link-type">{meta.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="syllabus-materials-empty">Materials coming soon.</p>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
