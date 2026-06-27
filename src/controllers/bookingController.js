const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const asyncHandler = require('../utils/asyncHandler');
const { v4: uuidv4 } = require('uuid');
const Route = require('../models/Route');

// @desc    Check seat availability
// @route   GET /api/bookings/availability/:routeId
// @access  Public
const getAvailability = asyncHandler(async (req, res) => {
  const seats = await Seat.find({ route_id: req.params.routeId });
  res.json(seats);
});

// @desc    Reserve a seat and create booking
// @route   POST /api/bookings/reserve
// @access  Private
const reserveSeat = asyncHandler(async (req, res) => {
  const {
  route_id,
  bus_id,
  selected_seats,
  passenger_details
} = req.body;

const route = await Route.findById(route_id);

if (!route) {
  res.status(404);
  throw new Error('Route not found');
}

const total_amount =
  route.base_price * selected_seats.length;
  const unavailableSeats = await Seat.find({
  route_id,
  seat_number: { $in: selected_seats },
  status: 'booked'
});

if (unavailableSeats.length > 0) {
  res.status(400);
  throw new Error(
    `Seats already booked: ${unavailableSeats
      .map(seat => seat.seat_number)
      .join(', ')}`
  );
}

  // For simplicity, assuming seats are available. In real app, run transaction to lock seats.
  const booking = await Booking.create({
    booking_number: `BKG-${uuidv4().substring(0, 8).toUpperCase()}`,
    user_id: req.user._id,
    route_id,
    bus_id,
    selected_seats,
    passenger_details,
    total_amount,
    payment_status: 'pending',
    booking_status: 'confirmed',
  });

  // Update seats to booked (demo only, in real app, might just lock for x minutes)
  await Seat.updateMany(
    { route_id, seat_number: { $in: selected_seats } },
    { $set: { status: 'booked' } }
  );

  res.status(201).json(booking);
});

// @desc    Confirm booking (after payment)
// @route   POST /api/bookings/confirm/:id
// @access  Private
const confirmBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {

    // Security Check:
    // Prevent users from confirming payments for bookings
    // that belong to other users.
    // Only the booking owner, Admin, or Super Admin can confirm a booking.
    if (
      booking.user_id.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin' &&
      req.user.role !== 'Super Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to confirm this booking');
    }

    booking.payment_status = 'completed';

    const updatedBooking = await booking.save();

    res.json(updatedBooking);

  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Mark booking as completed
// @route   POST /api/bookings/complete/:id
// @access  Private/Admin
const completeBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.booking_status = 'completed';
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
// Ensure only booking owner or admin can cancel booking
  if (booking) {

    if (
      booking.user_id.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin' &&
      req.user.role !== 'Super Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }

    booking.booking_status = 'cancelled';

    const updatedBooking = await booking.save();

    await Seat.updateMany(
      {
        route_id: booking.route_id,
        seat_number: { $in: booking.selected_seats }
      },
      {
        $set: { status: 'available' }
      }
    );

    res.json(updatedBooking);

  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user_id', 'name email phone')
    .populate('bus_id', 'bus_number name type');
  res.json(bookings);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user_id: req.user._id })
    .populate('route_id', 'source destination departure_time arrival_time')
    .populate('bus_id', 'bus_number bus_type')
    .sort('-created_at');
  res.json(bookings);
});

module.exports = {
  getAvailability,
  reserveSeat,
  confirmBooking,
  cancelBooking,
  completeBooking,
  getAllBookings,
  getMyBookings,
};
