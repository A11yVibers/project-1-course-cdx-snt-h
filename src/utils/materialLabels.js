const LABELS_BY_TYPE = {
  pdf: 'PDF Reading',
  video: 'Lecture Video',
  md: 'Assignment',
  markdown: 'Assignment',
  youtube: 'Video (YouTube)',
  image: 'Image',
  slides: 'Slides',
  presentation: 'Presentation',
}

export function materialTypeLabel(type) {
  return LABELS_BY_TYPE[(type || '').toLowerCase()] || 'Resource'
}
