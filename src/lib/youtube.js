export function toYoutubeEmbedUrl(rawUrl) {
  if (!rawUrl) return null
  try {
    const url = new URL(rawUrl)
    let videoId = null

    if (url.hostname.includes('youtu.be')) {
      videoId = url.pathname.replace('/', '')
    } else if (url.hostname.includes('youtube.com')) {
      videoId = url.searchParams.get('v')
    }

    if (!videoId) return rawUrl
    return `https://www.youtube.com/embed/${videoId}`
  } catch {
    return rawUrl
  }
}
