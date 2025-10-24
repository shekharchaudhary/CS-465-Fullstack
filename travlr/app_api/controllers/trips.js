const mongoose = require('mongoose');
// Ensure API models are registered
require('../models/travlr');
const Trip = mongoose.model('trips');

// GET /api/trips - list all trips
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({}).exec();
    return res.status(200).json(trips);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching trips', error: err.message });
  }
};

// GET /api/trips/:code - get a single trip by code
const tripsFindByCode = async (req, res) => {
  const { tripCode } = req.params;
  try {
    const trip = await Trip.findOne({ code: tripCode }).exec();
    if (!trip) {
      return res.status(404).json({ message: `Trip not found for code '${tripCode}'` });
    }
    return res.status(200).json(trip);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching trip', error: err.message });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
};
// POST /api/trips - create a new trip
const tripsCreate = async (req, res) => {
  try {
    const {
      code,
      name,
      length,
      start,
      resort,
      perPerson,
      image,
      description,
    } = req.body || {};

    if (!code || !name || !length || !start || !resort || !perPerson || !image || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Optional: prevent duplicate codes (schema is indexed but not unique)
    const existing = await Trip.findOne({ code }).lean().exec();
    if (existing) {
      return res.status(409).json({ message: `Trip with code '${code}' already exists.` });
    }

    const doc = await Trip.create({
      code,
      name,
      length,
      start: new Date(start),
      resort,
      perPerson,
      image,
      description,
    });
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(400).json({ message: 'Error creating trip', error: err.message });
  }
};

// PUT /api/trips/:code - update existing trip by code
const tripsUpdateByCode = async (req, res) => {
  const code = req.params.code || req.params.tripCode;
  try {
    const update = { ...req.body };
    if (update.start) {
      update.start = new Date(update.start);
    }

    const updated = await Trip.findOneAndUpdate(
      { code },
      { $set: update },
      { new: true, runValidators: true }
    ).exec();

    if (!updated) {
      return res.status(404).json({ message: `Trip not found for code '${code}'` });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Error updating trip', error: err.message });
  }
};

// DELETE /api/trips/:code - delete a trip by code
const tripsDeleteByCode = async (req, res) => {
  const code = req.params.code || req.params.tripCode;
  try {
    const deleted = await Trip.findOneAndDelete({ code }).exec();
    if (!deleted) {
      return res.status(404).json({ message: `Trip not found for code '${code}'` });
    }
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ message: 'Error deleting trip', error: err.message });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsCreate,
  tripsUpdateByCode,
  tripsDeleteByCode,
};
