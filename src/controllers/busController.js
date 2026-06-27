const Bus = require('../models/Bus');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const Route = require('../models/Route');
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

  // Security:
  // Validate MongoDB ObjectId before querying database
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid Bus ID');
  }

  const bus = await Bus.findById(req.params.id);

  if (bus) {
  // Security:
  // Update only allowed fields (Prevents Mass Assignment)

  bus.name = req.body.name ?? bus.name;
  bus.bus_number = req.body.bus_number ?? bus.bus_number;
  bus.price = req.body.price ?? bus.price;
  bus.bus_type = req.body.bus_type ?? bus.bus_type;
  bus.total_seats = req.body.total_seats ?? bus.total_seats;
  bus.amenities = req.body.amenities ?? bus.amenities;
  bus.assigned_driver = req.body.assigned_driver ?? bus.assigned_driver;
  bus.bus_images = req.body.bus_images ?? bus.bus_images;
  bus.status = req.body.status ?? bus.status;

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

  // Security:
  // Validate MongoDB ObjectId before querying database
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid Bus ID');
  }
  const bus = await Bus.findById(req.params.id);

if (bus) {

  // Security:
  // Prevent deleting a bus that is assigned to any route

  const assignedRoute = await Route.findOne({
    assigned_bus: bus._id
  });

  if (assignedRoute) {
    res.status(400);
    throw new Error(
      'Cannot delete a bus that is assigned to a route'
    );
  }

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
