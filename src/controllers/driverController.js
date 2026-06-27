const Driver = require('../models/Driver');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a driver
// @route   POST /api/drivers
// @access  Private/Admin
const createDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.create(req.body);
  res.status(201).json(driver);
});

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private/Admin
const getDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find({}).populate('assigned_bus', 'bus_number bus_type');
  res.json(drivers);
});

// @desc    Get driver by ID
// @route   GET /api/drivers/:id
// @access  Private/Admin
const getDriverById = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id).populate('assigned_bus', 'bus_number bus_type');
  if (driver) {
    res.json(driver);
  } else {
    res.status(404);
    throw new Error('Driver not found');
  }
});

// @desc    Update a driver
// @route   PUT /api/drivers/:id
// @access  Private/Admin
const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (driver) {
    Object.assign(driver, req.body);
    const updatedDriver = await driver.save();
    res.json(updatedDriver);
  } else {
    res.status(404);
    throw new Error('Driver not found');
  }
});

// @desc    Delete a driver
// @route   DELETE /api/drivers/:id
// @access  Private/Admin
const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (driver) {
    await driver.deleteOne();
    res.json({ message: 'Driver removed' });
  } else {
    res.status(404);
    throw new Error('Driver not found');
  }
});

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
