const Booking = require('../models/Booking');

// @desc    Create a new booking request (User side - public)
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const { name, mobile, service, notes, preferredDate } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide customer name' });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide customer mobile number' });
    }

    const booking = await Booking.create({
      name: name.trim(),
      mobile: mobile.trim(),
      service: service?.trim() || 'General Service',
      notes: notes?.trim() || '',
      preferredDate: preferredDate?.trim() || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Booking request sent to Admin successfully! We will schedule your time shortly.',
      data: booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating booking' });
  }
};

// @desc    Get user's bookings by mobile number (User side - public)
// @route   GET /api/bookings/my-booking
// @access  Public
const getMyBookings = async (req, res) => {
  try {
    const { mobile } = req.query;
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: 'Mobile number query parameter is required' });
    }

    const bookings = await Booking.find({ mobile: mobile.trim() }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error getting my bookings:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get all bookings (Admin side)
// @route   GET /api/bookings
// @access  Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { mobile: regex }, { service: regex }];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error getting all bookings:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get booking statistics (Admin side)
// @route   GET /api/bookings/stats
// @access  Private (Admin)
const getBookingStats = async (req, res) => {
  try {
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
    ]);

    res.json({
      success: true,
      stats: {
        total,
        pending,
        confirmed,
        completed,
        cancelled,
      },
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Admin selects time & date, confirms and sends appointment to user
// @route   PUT /api/bookings/:id/confirm
// @access  Private (Admin)
const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, appointmentTime, adminNotes } = req.body;

    if (!appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both appointment date and appointment time',
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.appointmentDate = appointmentDate;
    booking.appointmentTime = appointmentTime;
    booking.adminNotes = adminNotes !== undefined ? adminNotes : booking.adminNotes;
    booking.status = 'confirmed';
    booking.confirmedAt = new Date();

    await booking.save();

    res.json({
      success: true,
      message: 'Appointment scheduled & confirmed successfully! User can now see their time slot.',
      data: booking,
    });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update booking status (Admin side)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    if (adminNotes !== undefined) {
      booking.adminNotes = adminNotes;
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Delete booking (Admin side)
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingStats,
  confirmBooking,
  updateBookingStatus,
  deleteBooking,
};
