const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      index: true,
    },
    service: {
      type: String,
      default: 'General Service',
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    preferredDate: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    appointmentDate: {
      type: String,
      default: '',
    },
    appointmentTime: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    confirmedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ mobile: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
