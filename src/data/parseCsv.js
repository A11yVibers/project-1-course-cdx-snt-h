import Papa from 'papaparse'

export function parseCsv(rawText) {
  const normalized = rawText.replace(/\r\n?/g, '\n')
  const result = Papa.parse(normalized.trim(), {
    header: true,
    skipEmptyLines: true,
  })
  return result.data
}
