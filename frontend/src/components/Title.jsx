import React from 'react'

const Title = ({ title, subtitle, className = "" }) => {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h1>
      {subtitle && (
        <p className="text-lg sm:text-xl max-w-2xl mx-auto px-4" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
      )}
    </div>
  )
}

export default Title