import React, { useMemo } from 'react'
import { marked } from 'marked'
import { toYoutubeEmbedUrl } from '../lib/youtube.js'
import { getMaterialMeta } from '../lib/materialMeta.js'

export default function MaterialViewer({ material }) {
  const meta = getMaterialMeta(material.type)
  const html = useMemo(() => {
    if (material.type === 'md' && material.textContent) {
      return marked.parse(material.textContent)
    }
    return null
  }, [material])

  return (
    <div className="material-viewer">
      <div className="material-viewer-heading">
        <span className="material-badge">
          {meta.icon} {meta.label}
        </span>
        <h3>{material.title}</h3>
      </div>

      <div className="material-viewer-body">
        {renderMaterialBody(material, html)}
      </div>
    </div>
  )
}

function renderMaterialBody(material, html) {
  switch (material.type) {
    case 'pdf':
      return (
        <object data={material.url} type="application/pdf" className="material-frame material-pdf">
          <p>
            Your browser can&rsquo;t preview this PDF.{' '}
            <a href={material.url} target="_blank" rel="noreferrer">
              Open the reading in a new tab
            </a>
            .
          </p>
        </object>
      )

    case 'video':
      return (
        <video className="material-frame material-video" controls src={material.url}>
          Your browser does not support embedded video playback.
        </video>
      )

    case 'youtube': {
      const embedUrl = toYoutubeEmbedUrl(material.url)
      return (
        <iframe
          className="material-frame material-youtube"
          src={embedUrl}
          title={material.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }

    case 'md':
    case 'markdown':
      return (
        <div
          className="material-markdown"
          dangerouslySetInnerHTML={{ __html: html || '<p>Assignment content is not available.</p>' }}
        />
      )

    default:
      return (
        <div className="material-fallback">
          <p>This resource type doesn&rsquo;t have an inline preview yet.</p>
          {material.url && (
            <a href={material.url} target="_blank" rel="noreferrer" className="material-open-link">
              Open resource
            </a>
          )}
        </div>
      )
  }
}
