import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MapSidebar.css';

export default function MapSidebar({ layers, setLayers, theme, setTheme }) {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get('/api/statistics')
            .then(res => setStats(res.data))
            .catch(err => console.error("Error fetching stats:", err));
    }, []);

    const toggleLayer = (layerName) => {
        setLayers({
            ...layers,
            [layerName]: !layers[layerName]
        });
    }

    return (
        <div className="map-sidebar">
            <div className="sidebar-header">
                <h2>Baku Metro <strong>Heat Map</strong></h2>
                <div className="header-right">
                    <button
                        className="theme-toggle"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <span className="help-icon">?</span>
                </div>
            </div>

            <div className="sidebar-content">
                {/* Visual Layers Section */}
                <div className="section-title">Map Layers</div>
                <ul className="layer-list">
                    <li className="layer-item">
                        <label className="checkbox-container">
                            <input type="checkbox" checked={layers.heatmap} onChange={() => toggleLayer('heatmap')} />
                            <span className="checkmark"></span>
                            Waste Heat Potential (Volume)
                        </label>
                    </li>
                    <li className="layer-item">
                        <label className="checkbox-container">
                            <input type="checkbox" checked={layers.stations} onChange={() => toggleLayer('stations')} />
                            <span className="checkmark"></span>
                            Metro Exits (Hotspots)
                        </label>
                    </li>
                    <li className="layer-item">
                        <label className="checkbox-container">
                            <input type="checkbox" checked={layers.metrolines} onChange={() => toggleLayer('metrolines')} />
                            <span className="checkmark"></span>
                            Metro Network (Lines)
                        </label>
                    </li>
                </ul>

                <hr className="divider" />

                {/* Dynamic Stats Section */}
                <div className="section-title">Baku Metro Impact (2025)</div>

                {stats ? (
                    <div className="stats-grid">
                        <div className="stat-card glass primary">
                            <span className="stat-icon">👥</span>
                            <div className="stat-info">
                                <span className="stat-value">{(stats.passengers?.total_passengers || 0).toLocaleString()}</span>
                                <span className="stat-label">Total Daily Pax</span>
                            </div>
                        </div>

                        <div className="stat-card glass secondary">
                            <span className="stat-icon">🔥</span>
                            <div className="stat-info">
                                <span className="stat-value">{(stats.heat?.total_recoverable_heat_kw || 0).toLocaleString()} <small>kW</small></span>
                                <span className="stat-label">Recoverable Heat</span>
                            </div>
                        </div>

                        <div className="stat-card glass warning">
                            <span className="stat-icon">🌱</span>
                            <div className="stat-info">
                                <span className="stat-value">{(stats.emissions?.total_co2_saved_tons || 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                <span className="stat-label">CO₂ Reduction (Tons)</span>
                            </div>
                        </div>

                        <div className="stat-card glass success">
                            <span className="stat-icon">🏠</span>
                            <div className="stat-info">
                                <span className="stat-value">{(stats.emissions?.total_houses_heated || 0).toLocaleString()}</span>
                                <span className="stat-label">Homes Heated</span>
                            </div>
                        </div>

                        <div className="stat-card glass primary">
                            <span className="stat-icon">⚡</span>
                            <div className="stat-info">
                                <span className="stat-value">{(stats.emissions?.total_energy_saved_mwh || 0).toLocaleString()} <small>MWh</small></span>
                                <span className="stat-label">Energy Recovered</span>
                            </div>
                        </div>

                        <div className="stat-card glass secondary">
                            <span className="stat-icon">🚇</span>
                            <div className="stat-info">
                                <span className="stat-value">{(stats.passengers?.total_stations || 0)}</span>
                                <span className="stat-label">Measured Stations</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="stats-loading">Loading insights...</div>
                )}

                <hr className="divider" />

                <div className="section-title">Line Information</div>
                <div className="line-info-list">
                    <div className="line-info-item">
                        <span className="line-dot red"></span>
                        <div className="line-details">
                            <span className="line-name">Red Line</span>
                            <span className="line-meta">13 Stations | 18.8 km</span>
                        </div>
                    </div>
                    <div className="line-info-item">
                        <span className="line-dot green"></span>
                        <div className="line-details">
                            <span className="line-name">Green Line</span>
                            <span className="line-meta">19 Stations | 15.6 km</span>
                        </div>
                    </div>
                    <div className="line-info-item">
                        <span className="line-dot purple"></span>
                        <div className="line-details">
                            <span className="line-name">Purple Line</span>
                            <span className="line-meta">4 Stations | 6.7 km</span>
                        </div>
                    </div>
                    <div className="line-info-item">
                        <span className="line-dot lime"></span>
                        <div className="line-details">
                            <span className="line-name">Khatai Shuttle</span>
                            <span className="line-meta">Shuttle Link | Green Line</span>
                        </div>
                    </div>
                </div>

                <div className="insights-footer">
                    <p>Harnessing passenger metabolic heat output to drive <strong>zero-emission</strong> heating solutions.</p>
                </div>
            </div>
        </div>
    );
}
