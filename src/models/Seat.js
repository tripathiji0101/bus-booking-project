const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  seat_number: {
    type: String,
    required: true,
  },
  seat_type: {
    type: String,
    enum: ['seater', 'sleeper'],
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'selected'],
    default: 'available',
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Prevent duplicate seat numbers within same route
seatSchema.index(
  {
    route_id: 1,
    seat_number: 1
  },
  {
    unique: true
  }
);

const Seat = mongoose.model('Seat', seatSchema);
module.exports = Seat;