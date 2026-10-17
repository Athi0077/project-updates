const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectStats,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (for visitors / users)
router.get('/', getProjects);
router.get('/stats', getProjectStats);
router.get('/:id', getProjectById);

// Protected routes (for Admin to create, update, delete)
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.patch('/:id/status', protect, updateProjectStatus);
router.delete('/:id', protect, deleteProject);

module.exports = router;
