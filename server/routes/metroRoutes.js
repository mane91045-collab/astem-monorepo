const express = require('express');
const router = express.Router();
const metroController = require('../controllers/metroController');

// Station routes
router.get('/stations', metroController.getAllStations);
router.get('/exits', metroController.getAllExits);
router.get('/stations/:stationId', metroController.getStationById);

// Heat analysis routes
router.get('/stations/:stationId/heat', metroController.getHeatPotential);
router.get('/stations/:stationId/passengers', metroController.getPassengerFlow);
router.get('/stations/:stationId/emissions', metroController.getEmissionsReduction);

// Statistics routes
router.get('/statistics', metroController.getStatistics);

// Calculation routes
router.post('/calculate/heat-scenario', metroController.calculateHeatScenario);

module.exports = router;
