import { useEffect, useState } from 'react'

function parseHash(hash) {
  const clean = hash.replace(/^#/, '') || '/'
  const [path, queryString] = clean.split('?')
  const segments = path.split('/').filter(Boolean)
  const query = new URLSearchParams(queryString || '')

  if (segments[0] === 'course' && segments[1]) {
    return { name: 'course', courseId: segments[1], query }
  }
  return { name: 'catalog', query }
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    function handleHashChange() {
      setRoute(parseHash(window.location.hash))
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return route
}

export function navigateTo(path) {
  window.location.hash = path
}
