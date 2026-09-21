export function toYoutubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    let videoId = ''
    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.replace('/', '')
    } else if (parsed.searchParams.get('v')) {
      videoId = parsed.searchParams.get('v')
    } else if (parsed.pathname.includes('/embed/')) {
      videoId = parsed.pathname.split('/embed/')[1]
    }
    if (!videoId) return url
    return `https://www.youtube.com/embed/${videoId}`
  } catch {
    return url
  }
}
