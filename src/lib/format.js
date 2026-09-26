export function formatDate(isoDate) {
  if (!isoDate) return ''
  const parsed = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return parsed.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function materialTypeLabel(type) {
  switch (type) {
    case 'pdf':
      return 'PDF Reading'
    case 'video':
      return 'Lecture Video'
    case 'youtube':
      return 'Video'
    case 'md':
      return 'Assignment'
    default:
      return 'Resource'
  }
}

export function materialTypeIcon(type) {
  switch (type) {
    case 'pdf':
      return '📄'
    case 'video':
      return '🎬'
    case 'youtube':
      return '▶️'
    case 'md':
      return '📝'
    default:
      return '🔗'
  }
}
