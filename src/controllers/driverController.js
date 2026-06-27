const Driver = require('../models/Driver');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a driver
// @route   POST /api/drivers
// @access  Private/Admin
const createDriver = asyncHandler(async (req, res) => {

  // Security:
  // Verify assigned bus before creating driver
  if (req.body.assigned_bus) {

    if (!mongoose.Types.ObjectId.isValid(req.body.assigned_bus)) {
      res.status(400);
      throw new Error('Invalid Bus ID');
    }

    const bus = await Bus.findById(req.body.assigned_bus);

    if (!bus) {
      res.status(404);
      throw new Error('Assigned bus not found');
    }
  }

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

  // Security:
  // Validate MongoDB ObjectId before querying database
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid Driver ID');
  }

  const driver = await Driver.findById(req.params.id)
    .populate('assigned_bus', 'bus_number bus_type');

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

  // Security:
  // Validate MongoDB ObjectId before querying database
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid Driver ID');
  }

  const driver = await Driver.findById(req.params.id);

  if (driver) {

    // Security:
    // If assigned bus is being changed, validate it first
    if (req.body.assigned_bus) {

      if (!mongoose.Types.ObjectId.isValid(req.body.assigned_bus)) {
        res.status(400);
        throw new Error('Invalid Bus ID');
      }

      const bus = await Bus.findById(req.body.assigned_bus);

      if (!bus) {
        res.status(404);
        throw new Error('Assigned bus not found');
      }
    }

    // Security:
    // Update only allowed fields (Prevents Mass Assignment)

    driver.name = req.body.name ?? driver.name;
    driver.contact_number =
      req.body.contact_number ?? driver.contact_number;
    driver.license_number =
      req.body.license_number ?? driver.license_number;
    driver.address =
      req.body.address ?? driver.address;
    driver.status =
      req.body.status ?? driver.status;
    driver.driver_image =
      req.body.driver_image ?? driver.driver_image;
    driver.assigned_bus =
      req.body.assigned_bus ?? driver.assigned_bus;

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

  // Security:
  // Validate MongoDB ObjectId before querying database
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid Driver ID');
  }

  const driver = await Driver.findById(req.params.id);

  if (driver) {

    // Security:
    // Prevent deleting a driver who is assigned to a bus

    const assignedBus = await Bus.exists({
      assigned_driver: driver._id
    });

    if (assignedBus) {
      res.status(400);
      throw new Error(
        'Cannot delete a driver who is assigned to a bus'
      );
    }

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
