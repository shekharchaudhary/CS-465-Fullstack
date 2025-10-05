const express = require('express');
const router = express.Router();

const tripsCtrl = require('../controllers/trips');

// RESTful trips routes (read-only to start)
router.get('/trips', tripsCtrl.tripsList);
// Use PDF param name (tripCode) for single trip
router.get('/trips/:tripCode', tripsCtrl.tripsFindByCode);
// Write routes are intentionally omitted in Module 5.

module.exports = router;
