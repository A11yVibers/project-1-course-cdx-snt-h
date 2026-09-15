// Resolves local file_path values from course_materials.csv to build-time asset URLs.
// Source files under project-assets/materials are treated as immutable inputs.
const assetModules = import.meta.glob('../../project-assets/materials/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

export function resolveAssetUrl(filePath) {
  const key = `../../project-assets/${filePath}`
  return assetModules[key] ?? null
}
