const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'portfolio_jwt_secret_super_key_2026', {
    expiresIn: '7d',
  });
};

// @desc    Register a new admin account
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: cleanEmail });

    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const admin = await Admin.create({
      name: name?.trim() || 'Portfolio Admin',
      email: cleanEmail,
      password,
      role: 'admin',
    });

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during signup' });
  }
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const admin = req.admin;
    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
};

// Helper: Seed or ensure an admin user exists
const ensureAdminExists = async () => {
  try {
    const email = (process.env.ADMIN_EMAIL || 'athi007@gmail.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'aathi007@';
    let admin = await Admin.findOne({ email });

    if (!admin) {
      await Admin.create({
        email,
        password,
        name: 'Athi (Admin)',
        role: 'admin',
      });
      console.log(`[Admin Initialized] Created admin: ${email}`);
    } else {
      admin.password = password;
      await admin.save();
      console.log(`[Admin Initialized] Updated credentials for: ${email}`);
    }
  } catch (error) {
    console.error('Error ensuring admin user exists:', error.message);
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getMe,
  ensureAdminExists,
};
