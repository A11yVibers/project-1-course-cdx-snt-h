// Minimal RFC4180-ish CSV parser sufficient for the project-assets data files.
// Handles quoted fields, escaped quotes ("") and embedded commas/newlines.
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  const pushField = () => { row.push(field); field = '' }
  const pushRow = () => { pushField(); rows.push(row); row = [] }

  const normalized = text.replace(/\r\n/g, '\n')
  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i]
    if (inQuotes) {
      if (char === '"') {
        if (normalized[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }
    if (char === '"') {
      inQuotes = true
      continue
    }
    if (char === ',') {
      pushField()
      continue
    }
    if (char === '\n') {
      pushRow()
      continue
    }
    field += char
  }
  if (field.length > 0 || row.length > 0) pushRow()

  const filtered = rows.filter((cols) => cols.length > 1 || cols[0] !== '')
  const [header, ...body] = filtered
  return body.map((cols) => {
    const record = {}
    header.forEach((key, index) => { record[key] = cols[index] ?? '' })
    return record
  })
}
