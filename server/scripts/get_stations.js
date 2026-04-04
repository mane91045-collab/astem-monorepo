const fs = require('fs');
const path = require('path');

const dbPath = 'c:/Users/Ethane Lebis/Documents/Astem/server/databases/Number of daily passenger departures at metro stations (2025).json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const stations = new Set();
data.forEach(row => {
    stations.add(row["Stansiya"]);
});

console.log("Unique Stations in Passenger DB:");
console.log(Array.from(stations));
