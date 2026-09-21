import { useEffect, useState } from 'react'
import { marked } from 'marked'
import { materialTypeLabel } from '../utils/materialLabels.js'
import { toYoutubeEmbedUrl } from '../utils/youtube.js'
import { MaterialIcon } from './MaterialIcon.jsx'

function MarkdownMaterial({ material }) {
  const [html, setHtml] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setError(false)
    setHtml('')
    if (!material.raw) {
      if (material.url) {
        fetch(material.url)
          .then((response) => response.text())
          .then((text) => {
            if (!cancelled) setHtml(marked.parse(text))
          })
          .catch(() => {
            if (!cancelled) setError(true)
          })
      }
      return () => {
        cancelled = true
      }
    }
    setHtml(marked.parse(material.raw))
    return () => {
      cancelled = true
    }
  }, [material])

  if (error) {
    return <p className="material-viewer__error">This assignment could not be loaded.</p>
  }

  return <div className="material-viewer__markdown" dangerouslySetInnerHTML={{ __html: html }} />
}

export function MaterialViewer({ material }) {
  const type = (material.type || '').toLowerCase()

  return (
    <div className="material-viewer">
      <header className="material-viewer__header">
        <span className="material-viewer__badge">
          <MaterialIcon type={material.type} />
          {materialTypeLabel(material.type)}
        </span>
        <h3 className="material-viewer__title">{material.title}</h3>
      </header>

      <div className="material-viewer__stage">
        {type === 'pdf' && material.url && (
          <object data={material.url} type="application/pdf" className="material-viewer__pdf">
            <p>
              PDF preview isn't available in this browser.{' '}
              <a href={material.url} target="_blank" rel="noreferrer">
                Open the PDF in a new tab
              </a>
              .
            </p>
          </object>
        )}

        {type === 'video' && material.url && (
          <video className="material-viewer__video" controls preload="metadata" src={material.url}>
            Your browser does not support embedded video.
          </video>
        )}

        {type === 'youtube' && (
          <div className="material-viewer__youtube-wrap">
            <iframe
              className="material-viewer__youtube"
              src={toYoutubeEmbedUrl(material.url)}
              title={material.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {(type === 'md' || type === 'markdown') && <MarkdownMaterial material={material} />}

        {type === 'image' && material.url && (
          <img className="material-viewer__image" src={material.url} alt={material.title} />
        )}

        {!['pdf', 'video', 'youtube', 'md', 'markdown', 'image'].includes(type) && (
          <div className="material-viewer__fallback">
            <p>This resource can be opened directly.</p>
            {material.url && (
              <a href={material.url} target="_blank" rel="noreferrer" className="button button--primary">
                Open resource
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
