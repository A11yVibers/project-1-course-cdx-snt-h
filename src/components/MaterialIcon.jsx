import { IconPdf, IconVideo, IconMarkdown, IconYoutube, IconFile, IconImage } from './icons.jsx'

const ICONS_BY_TYPE = {
  pdf: IconPdf,
  video: IconVideo,
  md: IconMarkdown,
  markdown: IconMarkdown,
  youtube: IconYoutube,
  image: IconImage,
  slides: IconFile,
  presentation: IconFile,
}

export function MaterialIcon({ type, ...rest }) {
  const Icon = ICONS_BY_TYPE[(type || '').toLowerCase()] || IconFile
  return <Icon {...rest} />
}
