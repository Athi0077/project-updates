const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: String,
      trim: true,
      default: 'Contact for price',
    },
    duration: {
      type: String,
      trim: true,
      default: '30-45 mins',
    },
    badge: {
      type: String,
      default: 'Popular',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
