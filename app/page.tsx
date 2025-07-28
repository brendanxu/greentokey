import React from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">GreenLink Capital</h1>
        <p className="text-xl text-gray-400">The Institutional Gateway to Verifiable Green Assets</p>
        <div className="mt-8 text-sm text-gray-600">
          Next.js App Router - {new Date().toISOString()}
        </div>
      </div>
    </div>
  )
}