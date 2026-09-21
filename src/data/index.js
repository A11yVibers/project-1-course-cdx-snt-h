import { parseCsv } from './parseCsv.js'

import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'

const materialFileUrls = import.meta.glob('../../project-assets/materials/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const materialFileRaw = import.meta.glob('../../project-assets/materials/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function keyForGlobPath(globPath) {
  const marker = 'project-assets/'
  const index = globPath.indexOf(marker)
  return index === -1 ? globPath : globPath.slice(index + marker.length)
}

const materialUrlByPath = Object.fromEntries(
  Object.entries(materialFileUrls).map(([globPath, url]) => [keyForGlobPath(globPath), url])
)

const materialRawByPath = Object.fromEntries(
  Object.entries(materialFileRaw).map(([globPath, raw]) => [keyForGlobPath(globPath), raw])
)

function resolveMaterialSource(filePath) {
  if (/^https?:\/\//i.test(filePath)) {
    return { kind: 'external', url: filePath }
  }
  const url = materialUrlByPath[filePath]
  const raw = materialRawByPath[filePath]
  return { kind: 'local', url, raw }
}

const instructorRows = parseCsv(instructorsCsv)
const instructorsById = Object.fromEntries(
  instructorRows.map((row) => [
    row.instructor_id,
    {
      id: row.instructor_id,
      name: row.name,
      email: row.email,
      photoUrl: row.photo_url,
    },
  ])
)

const materialRows = parseCsv(materialsCsv)
const materialsByClassId = {}
for (const row of materialRows) {
  const source = resolveMaterialSource(row.file_path)
  const material = {
    id: row.material_id,
    courseId: row.course_id,
    classId: row.class_id,
    displayOrder: Number(row.display_order),
    title: row.material_title,
    type: row.material_type,
    filePath: row.file_path,
    ...source,
  }
  if (!materialsByClassId[row.class_id]) materialsByClassId[row.class_id] = []
  materialsByClassId[row.class_id].push(material)
}
for (const list of Object.values(materialsByClassId)) {
  list.sort((a, b) => a.displayOrder - b.displayOrder)
}

const classRows = parseCsv(classesCsv)
const classesByCourseId = {}
for (const row of classRows) {
  const classEntry = {
    id: row.class_id,
    courseId: row.course_id,
    weekNumber: Number(row.week_number),
    date: row.date,
    className: row.class_name,
    materials: materialsByClassId[row.class_id] || [],
  }
  if (!classesByCourseId[row.course_id]) classesByCourseId[row.course_id] = []
  classesByCourseId[row.course_id].push(classEntry)
}
for (const list of Object.values(classesByCourseId)) {
  list.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
}

const courseRows = parseCsv(coursesCsv)
export const courses = courseRows.map((row) => ({
  id: row.course_id,
  name: row.name,
  shortDescription: row.short_description,
  longDescription: row.long_description,
  numberOfClasses: Number(row.number_of_classes),
  numberOfWeeks: Number(row.number_of_weeks),
  instructor: instructorsById[row.instructor_id] || null,
  imageUrl: row.image_url,
  syllabus: classesByCourseId[row.course_id] || [],
}))

export const coursesById = Object.fromEntries(courses.map((course) => [course.id, course]))

export function getCourseById(courseId) {
  return coursesById[courseId] || null
}
