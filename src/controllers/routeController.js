const Route = require('../models/Route');
console.log("ROUTE CONTROLLER LOADED");
const Bus = require('../models/Bus');
const Seat = require('../models/Seat');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
// @desc    Create a route
// @route   POST /api/routes
// @access  Private/Admin
const createRoute = asyncHandler(async (req, res) => {

  // Security:
  // Verify that the assigned bus exists before creating the route
  const bus = await Bus.findById(req.body.assigned_bus);

  if (!bus) {
    res.status(404);
    throw new Error('Assigned bus not found');
  }

  // Security:
  // Only active buses can be assigned to routes
  if (bus.status !== 'active') {
    res.status(400);
    throw new Error('Only active buses can be assigned to routes');
  }

  // Create route only after successful validation
  const route = await Route.create(req.body);

  const seats = [];

  for (let i = 1; i <= bus.total_seats; i++) {
    seats.push({
      route_id: route._id,
      seat_number: `A${i}`,
      seat_type: bus.bus_type.includes('Sleeper')
        ? 'sleeper'
        : 'seater',
      status: 'available'
    });
  }

  console.log("Bus found:", bus.bus_number);
  console.log("Total seats:", bus.total_seats);
  console.log("Seats prepared:", seats.length);

  await Seat.insertMany(seats);

  console.log("Seats inserted successfully");

  res.status(201).json(route);
});
// @desc    Get all routes
// @route   GET /api/routes
// @access  Public
const getRoutes = asyncHandler(async (req, res) => {
  const { source, destination, date } = req.query;
  const filter = {};

  if (source) filter.source = new RegExp(source, 'i');
  if (destination) filter.destination = new RegExp(destination, 'i');
  if (date) {
    const searchDate = new Date(date);
    filter.departure_time = {
      $gte: new Date(searchDate.setHours(0, 0, 0)),
      $lt: new Date(searchDate.setHours(23, 59, 59))
    };
  }

  const routes = await Route.find(filter).populate('assigned_bus', 'bus_number bus_type total_seats amenities');
  res.json(routes);
});
// @desc    Get route by ID
// @route   GET /api/routes/:id
// @access  Public
const getRouteById = asyncHandler(async (req, res) => {

  // Security:
  // Validate MongoDB ObjectId before querying database
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid Route ID');
  }

  const route = await Route.findById(req.params.id)
    .populate('assigned_bus');

  if (route) {
    res.json(route);
  } else {
    res.status(404);
    throw new Error('Route not found');
  }
});
// @desc    Update a route
// @route   PUT /api/routes/:id
// @access  Private/Admin
const updateRoute = asyncHandler(async (req, res) => {

  // Security:
  // Validate MongoDB ObjectId before querying database
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid Route ID');
  }

  const route = await Route.findById(req.params.id);

  if (route) {

    // Security:
    // Update only allowed fields (Prevents Mass Assignment)

    route.source = req.body.source ?? route.source;
    route.destination = req.body.destination ?? route.destination;
    route.departure_time =
      req.body.departure_time ?? route.departure_time;
    route.arrival_time =
      req.body.arrival_time ?? route.arrival_time;
    route.distance =
      req.body.distance ?? route.distance;
    route.duration =
      req.body.duration ?? route.duration;
    route.base_price =
      req.body.base_price ?? route.base_price;
    route.assigned_bus =
      req.body.assigned_bus ?? route.assigned_bus;

    const updatedRoute = await route.save();

    res.json(updatedRoute);

  } else {
    res.status(404);
    throw new Error('Route not found');
  }
});

// @desc    Delete a route
// @route   DELETE /api/routes/:id
// @access  Private/Admin
const deleteRoute = asyncHandler(async (req, res) => {

  // Security:
  // Validate MongoDB ObjectId before querying database
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid Route ID');
  }

  const route = await Route.findById(req.params.id);

  if (route) {

    // Security:
    // Prevent deleting a route that already has bookings

    const bookingExists = await Booking.exists({
      route_id: route._id
    });

    if (bookingExists) {
      res.status(400);
      throw new Error(
        'Cannot delete route with existing bookings'
      );
    }

    await route.deleteOne();

    res.json({ message: 'Route removed' });

  } else {
    res.status(404);
    throw new Error('Route not found');
  }
});

module.exports = {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
};
