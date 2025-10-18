const express = require('express');
const router = express.Router();

const tripsCtrl = require('../controllers/trips');
const authController = require('../controllers/authentication');
const jwt = require('jsonwebtoken');

// Simple JWT auth middleware
const requireAuth = (req, res, next) => {
  try {
    const header = req.headers['authorization'] || req.headers['Authorization'];
    if (!header) return res.status(401).json({ message: 'Missing Authorization header' });
    const [scheme, token] = String(header).split(' ');
    if (!/^Bearer$/i.test(scheme) || !token) return res.status(401).json({ message: 'Invalid Authorization format' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Token validation error' });
      req.auth = decoded;
      return next();
    });
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// RESTful trips routes
router.get('/trips', tripsCtrl.tripsList);
// Use param name (tripCode) for single trip
router.get('/trips/:tripCode', tripsCtrl.tripsFindByCode);

// Write routes used by the Angular admin app (Module 6/7)
router.post('/trips', requireAuth, tripsCtrl.tripsCreate);
router.put('/trips/:code', requireAuth, tripsCtrl.tripsUpdateByCode);
router.put('/trips/:tripCode', requireAuth, tripsCtrl.tripsUpdateByCode);
router.delete('/trips/:code', requireAuth, tripsCtrl.tripsDeleteByCode);
router.delete('/trips/:tripCode', requireAuth, tripsCtrl.tripsDeleteByCode);

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
