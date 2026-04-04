import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InformationPage from './pages/InformationPage'
import MetroPage from './pages/MetroPage'
import MetroHeatMap from './pages/MetroHeatMap'
import EnergyDashboard from './pages/EnergyDashboard'
import Simulation3D from './pages/Simulation3D'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/information" element={<InformationPage />} />
        <Route path="/metro" element={<MetroPage />} />
        <Route path="/metro-map" element={<MetroHeatMap />} />
        <Route path="/dashboard" element={<EnergyDashboard />} />
        <Route path="/simulation" element={<Simulation3D />} />
      </Routes>
    </BrowserRouter>
  )
}
