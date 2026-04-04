import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function InformationPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Heat Recovery Technology</h1>
            <p className="text-blue-100">How Baku's metro system captures and reuses waste heat</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-white hover:bg-gray-100 text-blue-600 px-6 py-2 rounded-lg font-bold transition"
          >
            ← Home
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex gap-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-4 font-bold transition border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-8 py-4 font-bold transition border-b-2 ${
              activeTab === 'sources'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Heat Sources
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-8 py-4 font-bold transition border-b-2 ${
              activeTab === 'benefits'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Benefits
          </button>
          <button
            onClick={() => setActiveTab('technology')}
            className={`px-8 py-4 font-bold transition border-b-2 ${
              activeTab === 'technology'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Technology
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">What is Heat Recovery?</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Metro systems generate significant amounts of waste heat from train braking, ventilation, and motor operations. Instead of letting this heat dissipate into the air, modern heat recovery systems capture and convert it into useful energy for district heating or electricity generation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-blue-400 mb-2">24/7 Operation</h3>
                <p className="text-gray-300">Metros run continuously, providing constant heat generation</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-green-400 mb-2">Zero Emissions</h3>
                <p className="text-gray-300">Recycled energy reduces reliance on fossil fuels</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-orange-500">
                <h3 className="text-xl font-bold text-orange-400 mb-2">Cost Effective</h3>
                <p className="text-gray-300">Reduces heating costs for thousands of households</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Heat Sources in Metro Systems</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800 p-8 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🔴</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-red-400 mb-2">Braking Heat (35-40%)</h3>
                    <p className="text-gray-300">When trains brake, kinetic energy converts to heat. This is the largest heat source in metro systems.</p>
                    <div className="mt-4 bg-gray-700 p-4 rounded">
                      <p className="text-sm"><span className="text-gray-400">Energy Loss:</span> <span className="text-red-300 font-bold">300-400 kW per train</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-8 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💨</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-2">Ventilation Heat (20-25%)</h3>
                    <p className="text-gray-300">Metro tunnels require continuous ventilation. Air heated by passenger bodies and equipment is exhausted with significant thermal energy.</p>
                    <div className="mt-4 bg-gray-700 p-4 rounded">
                      <p className="text-sm"><span className="text-gray-400">Temperature Rise:</span> <span className="text-cyan-300 font-bold">8-12°C above ambient</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-8 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">⚙️</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-2">Motor Losses (30-35%)</h3>
                    <p className="text-gray-300">Electric motors driving trains and auxiliary systems generate heat through electrical resistance and mechanical friction.</p>
                    <div className="mt-4 bg-gray-700 p-4 rounded">
                      <p className="text-sm"><span className="text-gray-400">Efficiency Loss:</span> <span className="text-yellow-300 font-bold">15-20% as waste heat</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Environmental & Economic Benefits</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-900 bg-opacity-20 border border-green-600 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-green-400 mb-4">CO₂ Reduction</h3>
                <p className="text-5xl font-bold text-green-300 mb-2">7,650+ tons</p>
                <p className="text-gray-300">Annual CO₂ emissions eliminated across Baku metro</p>
              </div>

              <div className="bg-blue-900 bg-opacity-20 border border-blue-600 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">Heating Supply</h3>
                <p className="text-5xl font-bold text-blue-300 mb-2">2,000+ homes</p>
                <p className="text-gray-300">Households that could be heated annually</p>
              </div>

              <div className="bg-orange-900 bg-opacity-20 border border-orange-600 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-orange-400 mb-4">Cost Savings</h3>
                <p className="text-5xl font-bold text-orange-300 mb-2">$3.5M+</p>
                <p className="text-gray-300">Annual energy cost reduction</p>
              </div>

              <div className="bg-purple-900 bg-opacity-20 border border-purple-600 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">Energy Recovered</h3>
                <p className="text-5xl font-bold text-purple-300 mb-2">15,000 MWh</p>
                <p className="text-gray-300">Annual thermal energy potential</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'technology' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Heat Recovery Systems</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-blue-400 mb-3">Heat Exchangers</h3>
                <p className="text-gray-300 mb-4">Transfer thermal energy from metro air or systems to heat transfer fluid without mixing them. Highly efficient and maintenance-friendly.</p>
                <div className="bg-gray-700 p-4 rounded text-sm text-gray-300">
                  <p><strong>Efficiency:</strong> 90-95%</p>
                </div>
              </div>

              <div className="bg-gray-800 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-green-400 mb-3">Thermoelectric Generators (TEG)</h3>
                <p className="text-gray-300 mb-4">Convert heat directly into electricity using the Seebeck effect. Solid-state, no moving parts, very reliable.</p>
                <div className="bg-gray-700 p-4 rounded text-sm text-gray-300">
                  <p><strong>Efficiency:</strong> 5-10% typical for waste heat</p>
                </div>
              </div>

              <div className="bg-gray-800 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-orange-400 mb-3">Thermal Storage</h3>
                <p className="text-gray-300 mb-4">Stores recovered heat in insulated tanks for use during peak demand periods, smoothing supply variations.</p>
                <div className="bg-gray-700 p-4 rounded text-sm text-gray-300">
                  <p><strong>Capacity:</strong> 500-2000 MWh per station</p>
                </div>
              </div>

              <div className="bg-gray-800 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-cyan-400 mb-3">District Heating Network</h3>
                <p className="text-gray-300 mb-4">Distributes recovered heat via insulated underground pipes to residential and commercial buildings.</p>
                <div className="bg-gray-700 p-4 rounded text-sm text-gray-300">
                  <p><strong>Coverage:</strong> Up to 2km radius per station</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-gray-800 border-t border-gray-700 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/metro-map')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold transition"
          >
            📍 View Heat Map
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-bold transition"
          >
            📊 Energy Dashboard
          </button>
          <button
            onClick={() => navigate('/simulation')}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-bold transition"
          >
            🎮 3D Simulation
          </button>
        </div>
      </div>
    </div>
  )
}
