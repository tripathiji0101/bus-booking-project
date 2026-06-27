const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transaction_id: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String, // e.g., 'card', 'upi', 'mock'
    required: true,
  },
  payment_status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending',
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
