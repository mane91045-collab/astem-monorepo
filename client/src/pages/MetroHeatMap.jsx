import React, { useState, useEffect, useRef } from 'react';
import MapSidebar from '../components/MapSidebar';
import StationDetailsPanel from '../components/StationDetailsPanel';
import axios from 'axios';
import { METRO_LINES, LINE_COLORS } from '../constants/metroLines';

export default function MetroHeatMap() {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [layers, setLayers] = useState({
        heatmap: true,
        stations: true,
        metrolines: true
    });

    const [theme, setTheme] = useState('dark');
    const [selectedStation, setSelectedStation] = useState(null);
    const [stationData, setStationData] = useState(null);
    const [exitData, setExitData] = useState(null);
    const [lineData, setLineData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Responsive listener
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            // On mobile, default to closed if a station is selected
            if (mobile && selectedStation) {
                setIsSidebarOpen(false);
            } else if (!mobile) {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [selectedStation]);

    // Auto-hide sidebar on mobile when selecting a station
    useEffect(() => {
        if (isMobile && selectedStation) {
            setIsSidebarOpen(false);
        }
    }, [selectedStation, isMobile]);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stationsRes, exitsRes] = await Promise.all([
                    axios.get('/api/stations'),
                    axios.get('/api/exits')
                ]);

                const stations = stationsRes.data;
                const exits = exitsRes.data;

                // 1. Station Centroids
                const stationGeojson = {
                    type: 'FeatureCollection',
                    features: stations.map(s => ({
                        type: 'Feature',
                        properties: { ...s },
                        geometry: { type: 'Point', coordinates: [s.longitude, s.latitude] }
                    }))
                };
                setStationData(stationGeojson);

                // 2. Granular Exits (Heatmap)
                const exitGeojson = {
                    type: 'FeatureCollection',
                    features: exits.map(e => ({
                        type: 'Feature',
                        properties: { ...e },
                        geometry: { type: 'Point', coordinates: [e.longitude, e.latitude] }
                    }))
                };
                setExitData(exitGeojson);

                // 3. Metro Lines (Topology)
                const lineFeatures = [];
                const stationMap = {};
                stations.forEach(s => { stationMap[s.name] = [s.longitude, s.latitude]; });

                Object.entries(METRO_LINES).forEach(([lineKey, stationNames]) => {
                    const coordinates = stationNames
                        .map(name => stationMap[name])
                        .filter(coord => coord !== undefined);

                    if (coordinates.length > 1) {
                        lineFeatures.push({
                            type: 'Feature',
                            properties: { 
                                line: lineKey, 
                                color: LINE_COLORS[lineKey.split('_')[0]] || '#ffffff' 
                            },
                            geometry: { type: 'LineString', coordinates }
                        });
                    }
                });

                setLineData({ type: 'FeatureCollection', features: lineFeatures });

            } catch (err) {
                console.error("Error fetching map data:", err);
            }
        };

        fetchData();
    }, []);

    // Initialize Map
    useEffect(() => {
        if (!window.maplibregl || !mapContainerRef.current) return;

        const map = new window.maplibregl.Map({
            container: mapContainerRef.current,
            style: theme === 'dark' ? 
                "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" : 
                "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
            center: [49.8671, 40.4093],
            zoom: isMobile ? 10.5 : 11.5
        });

        mapRef.current = map;

        map.on('load', () => {
            // Add Line Data
            if (lineData) {
                map.addSource('metro-lines', { type: 'geojson', data: lineData });
                map.addLayer({
                    id: 'metro-lines-layer',
                    type: 'line',
                    source: 'metro-lines',
                    layout: { 
                        'line-join': 'round', 
                        'line-cap': 'round',
                        'visibility': layers.metrolines ? 'visible' : 'none'
                    },
                    paint: {
                        'line-color': ['get', 'color'],
                        'line-width': 4,
                        'line-opacity': 0.8
                    }
                });
            }

            // Add Exit Data (Heatmap)
            if (exitData) {
                map.addSource('metro-exits', { type: 'geojson', data: exitData });
                map.addLayer({
                    id: 'heat-recovery-layer',
                    type: 'heatmap',
                    source: 'metro-exits',
                    layout: { 'visibility': layers.heatmap ? 'visible' : 'none' },
                    paint: {
                        'heatmap-weight': [
                            'interpolate', ['linear'], ['get', 'heat_kw'],
                            0, 0.1,
                            500, 0.3,
                            3000, 1
                        ],
                        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 11, 2, 15, 6],
                        'heatmap-color': [
                            'interpolate', ['linear'], ['heatmap-density'],
                            0, 'rgba(0,0,255,0)',
                            0.1, 'rgb(0,255,255)',
                            0.3, 'rgb(0,255,0)',
                            0.6, 'rgb(255,255,0)',
                            0.8, 'rgb(255,165,0)',
                            1.0, 'rgb(255,0,0)'
                        ],
                        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 11, 15, 15, 75],
                        'heatmap-opacity': 0.8
                    }
                });
            }

            // Add Exit Markers (780+ points)
            if (exitData) {
                map.addLayer({
                    id: 'exit-points',
                    type: 'circle',
                    source: 'metro-exits',
                    layout: { 'visibility': layers.stations ? 'visible' : 'none' },
                    paint: {
                        'circle-radius': 4,
                        'circle-color': '#ffffff',
                        'circle-stroke-width': 1.5,
                        'circle-stroke-color': '#3388ff'
                    }
                });

                // Click event for Exits
                map.on('click', 'exit-points', (e) => {
                    if (!e.features || e.features.length === 0) return;
                    const props = e.features[0].properties;
                    setSelectedStation({
                        ...props,
                        lat: Number(props.latitude) || 0,
                        lng: Number(props.longitude) || 0,
                        station_en: props.station_en,
                        station_az: props.station_az,
                        exit_name: props.exit_name,
                        daily_departures: Number(props.daily_departures) || 0,
                        heat_kw: Number(props.heat_kw) || 0,
                        name: `${props.station_en} (${props.exit_number})`,
                        name_az: `${props.station_az} (Çıxış ${props.exit_number})`
                    });
                });

                map.on('mouseenter', 'exit-points', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                map.on('mouseleave', 'exit-points', () => {
                    map.getCanvas().style.cursor = '';
                });
            }

            // Add Station Labels (Centroids)
            if (stationData) {
                map.addSource('metro-stations', { type: 'geojson', data: stationData });
                map.addLayer({
                    id: 'station-labels',
                    type: 'symbol',
                    source: 'metro-stations',
                    layout: {
                        'text-field': ['get', 'name'],
                        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                        'text-offset': [0, 1.5],
                        'text-anchor': 'top',
                        'text-size': isMobile ? 10 : 12,
                        'visibility': layers.stations ? 'visible' : 'none'
                    },
                    paint: {
                        'text-color': '#ffffff',
                        'text-halo-color': 'rgba(0,0,0,0.8)',
                        'text-halo-width': 1
                    }
                });
            }
        });

        return () => map.remove();
    }, [stationData, exitData, lineData, theme, isMobile]); // Re-initialize on mobile state change

    // Sync layers visibility
    useEffect(() => {
        if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;
        
        const map = mapRef.current;
        if (map.getLayer('heat-recovery-layer')) {
            map.setLayoutProperty('heat-recovery-layer', 'visibility', layers.heatmap ? 'visible' : 'none');
        }
        if (map.getLayer('exit-points')) {
            map.setLayoutProperty('exit-points', 'visibility', layers.stations ? 'visible' : 'none');
        }
        if (map.getLayer('station-labels')) {
            map.setLayoutProperty('station-labels', 'visibility', layers.stations ? 'visible' : 'none');
        }
        if (map.getLayer('metro-lines-layer')) {
            map.setLayoutProperty('metro-lines-layer', 'visibility', layers.metrolines ? 'visible' : 'none');
        }
    }, [layers]);

    return (
        <div className={`heatmap-container ${theme}-theme ${isMobile ? 'is-mobile' : ''}`}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />

            {/* Mobile Toggle Button */}
            {isMobile && (
                <button 
                    className="mobile-sidebar-toggle"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? '✕ Map' : '📊 Insights'}
                </button>
            )}

            {isSidebarOpen && (
                <MapSidebar 
                    layers={layers} 
                    setLayers={setLayers} 
                    theme={theme} 
                    setTheme={setTheme} 
                />
            )}

            {selectedStation && (
                <StationDetailsPanel 
                    station={selectedStation} 
                    onClose={() => setSelectedStation(null)} 
                />
            )}

            <style>{`
                .heatmap-container {
                    position: relative;
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    background: #111;
                }
                .mobile-sidebar-toggle {
                    position: absolute;
                    top: 15px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 2005;
                    background: #1a82c6;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                    font-size: 0.9rem;
                    cursor: pointer;
                }
                .maplibregl-ctrl-bottom-right, .maplibregl-ctrl-bottom-left {
                    display: none;
                }
                @media (max-width: 768px) {
                    .maplibregl-canvas {
                        width: 100% !important;
                        height: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}
