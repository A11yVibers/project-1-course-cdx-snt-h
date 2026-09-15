const TYPE_META = {
  pdf: { label: 'PDF Reading', icon: '📄' },
  video: { label: 'Lecture Video', icon: '🎬' },
  youtube: { label: 'Video', icon: '▶️' },
  md: { label: 'Assignment', icon: '📝' },
  markdown: { label: 'Assignment', icon: '📝' },
  slides: { label: 'Slides', icon: '🖥️' },
  presentation: { label: 'Slides', icon: '🖥️' },
  ppt: { label: 'Slides', icon: '🖥️' },
  doc: { label: 'Document', icon: '📃' },
  link: { label: 'Link', icon: '🔗' },
  audio: { label: 'Audio', icon: '🎧' },
}

export function getMaterialMeta(type) {
  return TYPE_META[type] || { label: 'Resource', icon: '📎' }
}
