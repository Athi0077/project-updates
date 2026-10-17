const Category = require('../models/Category');

const DEFAULT_CATEGORIES = [
  {
    name: 'Full Stack Web App',
    description: 'Custom React & Node.js scalable web applications tailored to your business needs.',
    price: '₹14,999 onwards',
    duration: '1 - 2 weeks',
    badge: 'Popular',
  },
  {
    name: 'Frontend Design & UI/UX',
    description: 'Modern, high-converting responsive interfaces built with Tailwind CSS & Framer Motion.',
    price: '₹7,999 onwards',
    duration: '3 - 5 days',
    badge: 'Trending',
  },
  {
    name: 'Backend API & Cloud Database',
    description: 'Robust Express / MongoDB REST APIs, secure authentication, and cloud architecture.',
    price: '₹9,999 onwards',
    duration: '5 - 7 days',
    badge: 'High Demand',
  },
  {
    name: 'Bug Fixes & Speed Optimization',
    description: 'Performance audits, debugging, SEO fixes, and code refactoring for existing apps.',
    price: '₹2,999 onwards',
    duration: '24 - 48 hours',
    badge: 'Quick',
  },
  {
    name: 'Personal Portfolio & Shop Site',
    description: 'Clean showcase website with admin management and customer appointment booking.',
    price: '₹4,999 onwards',
    duration: '2 - 3 days',
    badge: 'Recommended',
  },
];

// Seed default categories if none exist
const seedCategoriesIfEmpty = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      console.log('[Categories Initialized] Seeded default service categories');
    }
  } catch (err) {
    console.error('Error seeding categories:', err.message);
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
  try {
    const { name, description, price, duration, badge } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || '',
      price: price?.trim() || 'Custom Quote',
      duration: duration?.trim() || 'Flexible',
      badge: badge?.trim() || 'New',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration, badge, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (price !== undefined) category.price = price.trim();
    if (duration !== undefined) category.duration = duration.trim();
    if (badge !== undefined) category.badge = badge.trim();
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

module.exports = {
  seedCategoriesIfEmpty,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
