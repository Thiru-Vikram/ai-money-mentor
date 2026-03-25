import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function PageLayout({ children, title, subtitle, backLabel = 'Back to Home', backTo = '/', sourceLabel }) {
  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
      {/* Blue glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.07) 0%, transparent 65%)',
        }}
      />

      <Navbar />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Breadcrumb */}
        <Link
          to={backTo}
          className="inline-flex items-center gap-1 text-xs mb-8 transition-colors"
          style={{ color: 'var(--color-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-label)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
        >
          <ChevronLeft size={13} />
          {backLabel}
        </Link>

        {/* Page header */}
        {(title || subtitle) && (
          <div className="mb-10">
            {title && (
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight leading-tight" style={{ color: '#f1f5f9' }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-3 text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--color-label)' }}>
                {subtitle}
              </p>
            )}
            {sourceLabel && (
              <p className="source-label mt-2">{sourceLabel}</p>
            )}
          </div>
        )}

        {children}
      </main>
    </div>
  )
}
