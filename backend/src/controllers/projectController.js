const Project = require('../models/Project');

// @desc    Get all projects with filtering, search, and sorting
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { status, category, search, tag, sort = '-createdAt' } = req.query;

    const query = {};

    // Filter by status (ongoing, upcoming, future, pending, completed)
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by tech tag
    if (tag) {
      query.techStack = { $regex: new RegExp(tag, 'i') };
    }

    // Search in title, tagline, description, techStack
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { tagline: searchRegex },
        { description: searchRegex },
        { techStack: searchRegex },
        { category: searchRegex },
      ];
    }

    const projects = await Project.find(query).sort(sort);

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching projects' });
  }
};

// @desc    Get statistics / count per project status
// @route   GET /api/projects/stats
// @access  Public
const getProjectStats = async (req, res) => {
  try {
    const statuses = ['ongoing', 'upcoming', 'future', 'pending', 'completed'];

    const statsAggregation = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgProgress: { $avg: '$progress' },
        },
      },
    ]);

    const statsMap = {
      total: 0,
      ongoing: 0,
      upcoming: 0,
      future: 0,
      pending: 0,
      completed: 0,
    };

    let totalCount = 0;
    statsAggregation.forEach((item) => {
      if (statsMap.hasOwnProperty(item._id)) {
        statsMap[item._id] = item.count;
      }
      totalCount += item.count;
    });
    statsMap.total = totalCount;

    res.json({
      success: true,
      stats: statsMap,
    });
  } catch (error) {
    console.error('Error getting project stats:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve project stats' });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching project' });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res) => {
  try {
    const {
      title,
      tagline,
      description,
      status,
      category,
      techStack,
      progress,
      priority,
      startDate,
      targetDate,
      githubUrl,
      liveUrl,
      imageUrl,
      adminNotes,
      featured,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    // Format techStack if passed as comma separated string
    let parsedTech = [];
    if (Array.isArray(techStack)) {
      parsedTech = techStack;
    } else if (typeof techStack === 'string') {
      parsedTech = techStack.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const project = await Project.create({
      title,
      tagline: tagline || '',
      description,
      status: status || 'ongoing',
      category: category || 'Full Stack',
      techStack: parsedTech,
      progress: progress !== undefined ? Number(progress) : (status === 'completed' ? 100 : (status === 'ongoing' ? 50 : 0)),
      priority: priority || 'medium',
      startDate: startDate || null,
      targetDate: targetDate || null,
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      imageUrl: imageUrl || '',
      adminNotes: adminNotes || '',
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating project' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    let { techStack, ...rest } = req.body;

    if (techStack !== undefined) {
      if (Array.isArray(techStack)) {
        rest.techStack = techStack;
      } else if (typeof techStack === 'string') {
        rest.techStack = techStack.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, rest, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error updating project' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Server error deleting project' });
  }
};

// @desc    Quick status update
// @route   PATCH /api/projects/:id/status
// @access  Private (Admin)
const updateProjectStatus = async (req, res) => {
  try {
    const { status, progress } = req.body;

    const allowed = ['ongoing', 'upcoming', 'future', 'pending', 'completed'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided' });
    }

    const updateFields = { status };
    if (progress !== undefined) updateFields.progress = progress;
    if (status === 'completed' && progress === undefined) updateFields.progress = 100;

    const updated = await Project.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating project status' });
  }
};

module.exports = {
  getProjects,
  getProjectStats,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
};
