const fs = require('fs');
const path = require('path');

const COORD_FILE = 'c:/Users/Ethane Lebis/Documents/Astem/server/databases/Coordinates for metro exits.json';
const PASS_FILE = 'c:/Users/Ethane Lebis/Documents/Astem/server/databases/Number of daily passenger departures at metro stations (2025).json';

async function processData() {
    try {
        const coordData = JSON.parse(fs.readFileSync(COORD_FILE, 'utf8'));
        const passData = JSON.parse(fs.readFileSync(PASS_FILE, 'utf8'));

        const stationMap = {};
        coordData.forEach(d => {
            const name = d.Station;
            if (!stationMap[name]) {
                stationMap[name] = { 
                    name_en: d.Station, 
                    name_az: d.Stansiya, 
                    lats: [], 
                    lngs: [] 
                };
            }
            stationMap[name].lats.push(d['coğrafi enliyi (latitude)'] / 1000000);
            stationMap[name].lngs.push(d['coğrafi uzunluğu (longitude)'] / 1000000);
        });

        const stationStats = {};
        passData.forEach(d => {
            const nameAZ = d.Stansiya;
            if (!stationStats[nameAZ]) {
                stationStats[nameAZ] = { total: 0, count: 0 };
            }
            stationStats[nameAZ].total += d['Gündəlik gediş sayı'];
            stationStats[nameAZ].count++;
        });

        const finalStations = Object.values(stationMap).map(s => {
            const avgLat = s.lats.reduce((a, b) => a + b, 0) / s.lats.length;
            const avgLng = s.lngs.reduce((a, b) => a + b, 0) / s.lngs.length;
            const stats = stationStats[s.name_az] || { total: 0, count: 1 };
            
            // Infer Line for connections (can be manually refined)
            // Baku Metro Lines structure
            const redLine = ['Icherisheher', 'Sahil', '28 May', 'Ganjlik', 'Nariman Narimanov', 'Bakmil', 'Ulduz', 'Koroglu', 'Gara Garayev', 'Neftchilar', 'Khalglar Dostlughu', 'Akhmedli', 'Hazi Aslanov'];
            const greenLine = ['Darnagul', 'Azadliq prospekti', 'Nasimi', 'Memar Ajami', '20 Yanvar', 'Insahatchilar', 'Elmler Akademiyasi', 'Nizami', 'Jafar Jabbarly', 'Shah Ismail Khatai'];
            const purpleLine = ['Khojasan', 'Avtovaghzal', 'Memar Ajami 2', '8 Novabr'];
            
            let line = 'Unknown';
            if (redLine.includes(s.name_en)) line = 'Red Line';
            else if (greenLine.includes(s.name_en)) line = 'Green Line';
            else if (purpleLine.includes(s.name_en)) line = 'Purple Line';

            return {
                name: s.name_en,
                name_az: s.name_az,
                latitude: avgLat,
                longitude: avgLng,
                avg_daily_passengers: Math.round(stats.total / stats.count),
                line: line
            };
        });

        fs.writeFileSync('c:/Users/Ethane Lebis/Documents/Astem/server/databases/processed_stations.json', JSON.stringify(finalStations, null, 2));
        console.log("Successfully processed " + finalStations.length + " stations.");
    } catch (err) {
        console.error("Error processing data:", err);
    }
}

processData();
