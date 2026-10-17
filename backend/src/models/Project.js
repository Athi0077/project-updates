const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    status: {
      type: String,
      enum: ['ongoing', 'upcoming', 'future', 'pending', 'completed'],
      default: 'ongoing',
      required: true,
      index: true,
    },
    category: {
      type: String,
      default: 'Full Stack',
      trim: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    startDate: {
      type: Date,
    },
    targetDate: {
      type: Date,
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Text search index for title and description
projectSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Project', projectSchema);
