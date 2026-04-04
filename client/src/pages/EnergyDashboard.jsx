import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EnergyDashboard() {
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Energy Recovered', value: '15,420 MWh', color: 'blue' },
        { label: 'CO2 Avoided', value: '7,890 Tons', color: 'green' },
        { label: 'Estimated Savings', value: '$3.2M', color: 'orange' },
        { label: 'Efficiency Gain', value: '28%', color: 'purple' }
    ];

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        Astem Energy Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">Baku Metro Thermal Recovery Analytics</p>
                </div>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-full border border-gray-700 transition-all font-bold"
                >
                    Back to Terminal
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-2xl">
                        <div className={`text-${stat.color}-400 text-sm font-bold uppercase tracking-wider mb-2`}>{stat.label}</div>
                        <div className="text-4xl font-bold text-white tracking-tight">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-800 p-8 rounded-3xl border border-gray-700 min-h-[400px] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                    <div className="text-center z-10">
                        <div className="text-6xl mb-6">📉</div>
                        <h2 className="text-2xl font-bold mb-4">Energy Recovery Over Time</h2>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Detailed chronological analytics are currently being aggregated. Live telemetry will appear here once station sensors are synchronized.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">Thermal Distribution</h2>
                    <div className="space-y-6">
                        {[
                            { name: 'District Heating', value: '45%' },
                            { name: 'Auxiliary Power', value: '25%' },
                            { name: 'Water Heating', value: '18%' },
                            { name: 'Grid Feeding', value: '12%' }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">{item.name}</span>
                                    <span className="text-blue-400 font-bold">{item.value}</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: item.value }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
