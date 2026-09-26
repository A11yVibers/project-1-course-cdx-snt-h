import { parseCsv } from './csv.js'

import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'

import silkRoadsClass01LecturePdf from '../../project-assets/materials/silk_roads_class_01_lecture.pdf?url'
import silkRoadsClass01LectureVideo from '../../project-assets/materials/silk_roads_class_01_lecture.mp4?url'
import silkRoadsClass02AssignmentMd from '../../project-assets/materials/silk_roads_class_02_assignment.md?raw'

// Maps the relative `file_path` values recorded in course_materials.csv to the
// bundled asset that Vite produces for local files under project-assets/materials.
// Materials referenced by an external URL (for example the YouTube lecture) are
// left untouched and used as-is.
const LOCAL_MATERIAL_ASSETS = {
  'materials/silk_roads_class_01_lecture.pdf': silkRoadsClass01LecturePdf,
  'materials/silk_roads_class_01_lecture.mp4': silkRoadsClass01LectureVideo,
}

const LOCAL_MATERIAL_TEXT = {
  'materials/silk_roads_class_02_assignment.md': silkRoadsClass02AssignmentMd,
}

function isExternalPath(path) {
  return /^https?:\/\//i.test(path)
}

function resolveMaterialSource(material) {
  const { file_path: filePath, material_type: materialType } = material
  if (isExternalPath(filePath)) {
    return { kind: 'external', url: filePath }
  }
  if (materialType === 'md' && LOCAL_MATERIAL_TEXT[filePath]) {
    return { kind: 'markdown', markdown: LOCAL_MATERIAL_TEXT[filePath] }
  }
  if (LOCAL_MATERIAL_ASSETS[filePath]) {
    return { kind: 'file', url: LOCAL_MATERIAL_ASSETS[filePath] }
  }
  return { kind: 'missing', url: filePath }
}

function detectYoutubeId(url) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1)
    if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v')
  } catch {
    return null
  }
  return null
}

function buildPlatform() {
  const instructorRows = parseCsv(instructorsCsv)
  const courseRows = parseCsv(coursesCsv)
  const classRows = parseCsv(classesCsv)
  const materialRows = parseCsv(materialsCsv)

  const instructorsById = new Map(
    instructorRows.map((row) => [row.instructor_id, {
      id: row.instructor_id,
      name: row.name,
      email: row.email,
      photoUrl: row.photo_url,
    }])
  )

  const materialsByClassId = new Map()
  materialRows.forEach((row) => {
    const material = {
      id: row.material_id,
      courseId: row.course_id,
      classId: row.class_id,
      order: Number(row.display_order) || 0,
      title: row.material_title,
      type: row.material_type,
      filePath: row.file_path,
      youtubeId: row.material_type === 'youtube' ? detectYoutubeId(row.file_path) : null,
      source: resolveMaterialSource(row),
    }
    const bucket = materialsByClassId.get(row.class_id) ?? []
    bucket.push(material)
    materialsByClassId.set(row.class_id, bucket)
  })
  materialsByClassId.forEach((materials) => materials.sort((a, b) => a.order - b.order))

  const classesByCourseId = new Map()
  classRows.forEach((row) => {
    const classItem = {
      id: row.class_id,
      courseId: row.course_id,
      weekNumber: Number(row.week_number) || 0,
      date: row.date,
      name: row.class_name,
      materials: materialsByClassId.get(row.class_id) ?? [],
    }
    const bucket = classesByCourseId.get(row.course_id) ?? []
    bucket.push(classItem)
    classesByCourseId.set(row.course_id, bucket)
  })
  classesByCourseId.forEach((classes) => {
    classes.sort((a, b) => {
      if (a.weekNumber !== b.weekNumber) return a.weekNumber - b.weekNumber
      return a.date.localeCompare(b.date)
    })
  })

  const courses = courseRows.map((row) => ({
    id: row.course_id,
    name: row.name,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    numberOfClasses: Number(row.number_of_classes) || 0,
    numberOfWeeks: Number(row.number_of_weeks) || 0,
    instructor: instructorsById.get(row.instructor_id) ?? null,
    imageUrl: row.image_url,
    classes: classesByCourseId.get(row.course_id) ?? [],
  }))

  return { courses }
}

const platform = buildPlatform()

export const COURSES = platform.courses

export function getCourseById(courseId) {
  return COURSES.find((course) => course.id === courseId) ?? null
}
