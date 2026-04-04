import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MetroPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to metro-map after a short delay
    const timer = setTimeout(() => navigate('/metro-map'), 500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading Metro Map...</h1>
        <p className="text-gray-400">Redirecting to heat map visualization</p>
      </div>
    </div>
  )
}
