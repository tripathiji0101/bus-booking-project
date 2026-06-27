const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  booking_number: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  selected_seats: [{
    type: String, // e.g., '1A', '1B'
    required: true,
  }],
  passenger_details: [{
    name: String,
    age: Number,
    gender: String,
  }],
  total_amount: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  booking_status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  booking_date: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
