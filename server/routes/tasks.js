const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, reorderTasks, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// GET /api/tasks - Get all tasks
router.get('/', getTasks);

// POST /api/tasks - Create a task
router.post('/', createTask);

// PUT /api/tasks/reorder - Reorder tasks (must be before :id route)
router.put('/reorder', reorderTasks);

// PUT /api/tasks/:id - Update a task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', deleteTask);

module.exports = router;
