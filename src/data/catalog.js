import { coursesRaw, classesRaw, instructorsRaw, materialsRaw } from './csvSource.js'
import { resolveAssetUrl } from './materialAssets.js'
import { resolveAssetText } from './materialText.js'

function isRemoteUrl(value) {
  return /^https?:\/\//i.test(value || '')
}

function buildMaterial(row) {
  const { material_id, class_id, display_order, material_title, material_type, file_path } = row
  const type = (material_type || '').toLowerCase().trim()
  const isRemote = isRemoteUrl(file_path)
  const url = isRemote ? file_path : resolveAssetUrl(file_path)
  const textContent = !isRemote && type === 'md' ? resolveAssetText(file_path) : null

  return {
    id: material_id,
    classId: class_id,
    order: Number(display_order) || 0,
    title: material_title,
    type,
    filePath: file_path,
    url,
    isRemote,
    textContent,
  }
}

function buildInstructorLookup() {
  const map = new Map()
  for (const row of instructorsRaw) {
    map.set(row.instructor_id, {
      id: row.instructor_id,
      name: row.name,
      email: row.email,
      photoUrl: row.photo_url,
    })
  }
  return map
}

function buildMaterialsByClass() {
  const map = new Map()
  for (const row of materialsRaw) {
    if (!row.class_id) continue
    const material = buildMaterial(row)
    if (!map.has(material.classId)) map.set(material.classId, [])
    map.get(material.classId).push(material)
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.order - b.order)
  }
  return map
}

function buildClassesByCourse(materialsByClass) {
  const map = new Map()
  for (const row of classesRaw) {
    if (!row.course_id) continue
    const classItem = {
      id: row.class_id,
      courseId: row.course_id,
      weekNumber: Number(row.week_number) || null,
      date: row.date,
      title: row.class_name,
      materials: materialsByClass.get(row.class_id) || [],
    }
    if (!map.has(classItem.courseId)) map.set(classItem.courseId, [])
    map.get(classItem.courseId).push(classItem)
  }
  for (const list of map.values()) {
    list.sort((a, b) => {
      if (a.weekNumber !== b.weekNumber) return (a.weekNumber || 0) - (b.weekNumber || 0)
      return a.date.localeCompare(b.date)
    })
  }
  return map
}

function buildCourses() {
  const instructors = buildInstructorLookup()
  const materialsByClass = buildMaterialsByClass()
  const classesByCourse = buildClassesByCourse(materialsByClass)

  return coursesRaw
    .filter((row) => row.course_id)
    .map((row) => ({
      id: row.course_id,
      name: row.name,
      shortDescription: row.short_description,
      longDescription: row.long_description,
      numberOfClasses: Number(row.number_of_classes) || 0,
      numberOfWeeks: Number(row.number_of_weeks) || 0,
      imageUrl: row.image_url,
      instructor: instructors.get(row.instructor_id) || null,
      classes: classesByCourse.get(row.course_id) || [],
    }))
}

export const COURSES = buildCourses()

export function getCourseById(courseId) {
  return COURSES.find((course) => course.id === courseId) || null
}

export function getClassById(courseId, classId) {
  const course = getCourseById(courseId)
  if (!course) return null
  return course.classes.find((c) => c.id === classId) || null
}
