const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingStats,
  confirmBooking,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');

// Public routes for user
router.post('/', createBooking);
router.get('/my-booking', getMyBookings);

// Protected routes for admin
router.get('/', protect, getAllBookings);
router.get('/stats', protect, getBookingStats);
router.put('/:id/confirm', protect, confirmBooking);
router.patch('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
