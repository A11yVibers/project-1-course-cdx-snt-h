import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage.jsx'
import CoursePage from './pages/CoursePage.jsx'
import SiteHeader from './components/SiteHeader.jsx'

export default function App() {
  return (
    <HashRouter>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
      </Routes>
    </HashRouter>
  )
}
