import Papa from 'papaparse'

const csvModules = import.meta.glob('../../project-assets/*.csv', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function parseCsv(fileName) {
  const key = `../../project-assets/${fileName}`
  const raw = csvModules[key]
  if (!raw) {
    throw new Error(`Missing expected data file: project-assets/${fileName}`)
  }
  const normalized = raw.replace(/\r\n?/g, '\n')
  const { data } = Papa.parse(normalized, { header: true, skipEmptyLines: true, newline: '\n' })
  return data
}

export const coursesRaw = parseCsv('history_courses.csv')
export const classesRaw = parseCsv('history_classes.csv')
export const instructorsRaw = parseCsv('history_instructors.csv')
export const materialsRaw = parseCsv('course_materials.csv')
