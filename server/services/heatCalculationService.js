/**
 * Heat Calculation Service
 * Provides methods to calculate heat potential from metro station passenger data.
 */

class HeatCalculationService {
    /**
     * Analyzes a station's heat potential based on passenger flow and depth.
     * @param {Object} params
     * @param {number} params.dailyPassengers - Average daily passenger count
     * @param {number} [params.stationDepth=15] - Station depth below ground in metres
     * @param {number} [params.operatingHours=20] - Operating hours per day
     * @returns {Object} Full heat analysis result
     */
    static analyzeStation({ dailyPassengers, stationDepth = 15, operatingHours = 20 }) {
        // Metabolic heat: assume 100 W per passenger
        const metabolicHeatW = dailyPassengers * 100;
        const metabolicHeatKw = metabolicHeatW / 1000;

        // Train braking heat: rough estimate - 350 kW per train, ~1 train every 4 min during ops
        const trainFrequencyPerHour = 15; // trains per hour
        const totalTrains = trainFrequencyPerHour * operatingHours;
        const brakingHeatKwh = totalTrains * 350 * 0.5; // 0.5 kWh of recoverable heat per stop

        // Ventilation heat recovery potential
        const ventilationHeatKw = metabolicHeatKw * 0.25;

        // Total recoverable heat
        const totalDailyHeatKwh = Math.round((metabolicHeatKw * operatingHours * 0.6) + brakingHeatKwh + (ventilationHeatKw * operatingHours));
        const annualHeatMwh = Math.round((totalDailyHeatKwh * 365) / 1000);

        // Geothermal bonus from depth (deeper stations have more stable ground temperature)
        const geothermalBonusFactor = 1 + (stationDepth / 100);

        // Peak heat demand (kW)
        const peakHeatKw = Math.round(metabolicHeatKw * 1.5 * geothermalBonusFactor);

        // Environmental impact
        const co2SavedTons = Math.round(annualHeatMwh * 0.2);
        const equivalentHousesHeated = Math.round(annualHeatMwh / 10);

        // Required fluid flow rate for heat exchange (Q = m * c * dT, dT = 5°C, c = 4.18 kJ/kgK)
        const flowRateLs = parseFloat((peakHeatKw / (4.18 * 5)).toFixed(1));

        return {
            dailyPassengers,
            stationDepth,
            operatingHours,
            metabolicHeatKw: Math.round(metabolicHeatKw),
            ventilationHeatKw: Math.round(ventilationHeatKw),
            brakingHeatKwh: Math.round(brakingHeatKwh),
            totalDailyHeatKwh,
            annualHeatMwh,
            peakHeatKw,
            co2SavedTons,
            equivalentHousesHeated,
            flowRateLs,
            recommendedTechnology: 'Water-Source Heat Pump Array',
            copRange: '3.5 - 4.0',
        };
    }
}

module.exports = HeatCalculationService;
