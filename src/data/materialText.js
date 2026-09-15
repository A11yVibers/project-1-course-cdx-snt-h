// Raw text content for materials that are rendered inline (e.g. Markdown assignments).
const textModules = import.meta.glob('../../project-assets/materials/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export function resolveAssetText(filePath) {
  const key = `../../project-assets/${filePath}`
  return textModules[key] ?? null
}
