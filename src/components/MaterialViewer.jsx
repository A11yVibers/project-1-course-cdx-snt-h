import { useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { materialTypeLabel } from '../lib/format.js'

function MarkdownMaterial({ material }) {
  const html = useMemo(() => {
    const raw = marked.parse(material.source.markdown ?? '')
    return DOMPurify.sanitize(raw)
  }, [material])

  return (
    <div className="viewer-markdown" role="document">
      <div className="viewer-markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function YoutubeMaterial({ material }) {
  return (
    <div className="viewer-frame viewer-frame--video">
      <iframe
        title={material.title}
        src={`https://www.youtube.com/embed/${material.youtubeId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function VideoFileMaterial({ material }) {
  return (
    <div className="viewer-frame viewer-frame--video">
      <video key={material.id} controls preload="metadata">
        <source src={material.source.url} />
        Your browser does not support embedded video playback.
      </video>
    </div>
  )
}

function PdfMaterial({ material }) {
  return (
    <div className="viewer-frame viewer-frame--pdf">
      <iframe title={material.title} src={material.source.url} />
    </div>
  )
}

function FallbackMaterial({ material }) {
  return (
    <div className="viewer-fallback">
      <p>This resource opens in a new tab.</p>
      <a href={material.source.url} target="_blank" rel="noreferrer">
        Open {material.title}
      </a>
    </div>
  )
}

export default function MaterialViewer({ course, activeMaterial }) {
  const heading = activeMaterial ? activeMaterial.title : course.name
  const subheading = activeMaterial
    ? materialTypeLabel(activeMaterial.type)
    : 'Course overview image'

  return (
    <section className="material-viewer" aria-live="polite">
      <header className="material-viewer-header">
        <p className="material-viewer-kicker">{subheading}</p>
        <h2>{heading}</h2>
      </header>
      <div className="material-viewer-stage">
        {!activeMaterial && (
          <img
            className="material-viewer-image"
            src={course.imageUrl}
            alt={`Cover artwork for ${course.name}`}
          />
        )}
        {activeMaterial && activeMaterial.type === 'youtube' && (
          <YoutubeMaterial material={activeMaterial} />
        )}
        {activeMaterial && activeMaterial.type === 'video' && activeMaterial.source.kind === 'file' && (
          <VideoFileMaterial material={activeMaterial} />
        )}
        {activeMaterial && activeMaterial.type === 'pdf' && activeMaterial.source.kind === 'file' && (
          <PdfMaterial material={activeMaterial} />
        )}
        {activeMaterial && activeMaterial.type === 'md' && activeMaterial.source.kind === 'markdown' && (
          <MarkdownMaterial material={activeMaterial} />
        )}
        {activeMaterial && activeMaterial.source.kind === 'external' && activeMaterial.type !== 'youtube' && (
          <FallbackMaterial material={activeMaterial} />
        )}
        {activeMaterial && activeMaterial.source.kind === 'missing' && (
          <FallbackMaterial material={activeMaterial} />
        )}
      </div>
    </section>
  )
}
