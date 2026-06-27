const Bus = require('../models/Bus');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');

// @desc    Create a bus
// @route   POST /api/buses
// @access  Private/Admin
const createBus = asyncHandler(async (req, res) => {
  const bus = await Bus.create(req.body);
  res.status(201).json(bus);
});

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
const getBuses = asyncHandler(async (req, res) => {
  const buses = await Bus.find({}).populate('assigned_driver', 'name contact_number');
  res.json(buses);
});

// @desc    Get bus by ID
// @route   GET /api/buses/:id
// @access  Public
const getBusById = asyncHandler(async (req, res) => {

  // Security:
  // Validate MongoDB ObjectId before querying database
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid Bus ID');
  }

  const bus = await Bus.findById(req.params.id)
    .populate('assigned_driver', 'name contact_number');
  if (bus) {
    res.json(bus);
  } else {
    res.status(404);
    throw new Error('Bus not found');
  }
});
// @desc    Update a bus
// @route   PUT /api/buses/:id
// @access  Private/Admin
const updateBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (bus) {
    Object.assign(bus, req.body);
    const updatedBus = await bus.save();
    res.json(updatedBus);
  } else {
    res.status(404);
    throw new Error('Bus not found');
  }
});

// @desc    Delete a bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
const deleteBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (bus) {
    await bus.deleteOne();
    res.json({ message: 'Bus removed' });
  } else {
    res.status(404);
    throw new Error('Bus not found');
  }
});

module.exports = {
  createBus,
  getBuses,
  getBusById,
  updateBus,
  deleteBus,
};
