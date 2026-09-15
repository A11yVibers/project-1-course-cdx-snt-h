import React from 'react'
import { Link } from 'react-router-dom'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true">📜</span>
        <span className="brand-text">
          <strong>Chronicle</strong>
          <small>History Learning Platform</small>
        </span>
      </Link>
    </header>
  )
}
