const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ position: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Get the highest position for this status
    const highestTask = await Task.findOne({
      user: req.user._id,
      status: status || 'todo'
    }).sort({ position: -1 });

    const position = highestTask ? highestTask.position + 1 : 0;

    const task = await Task.create({
      title,
      description,
      status,
      position,
      user: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, status, position } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (position !== undefined) updateData.position = position;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(task);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reorder tasks (batch update positions)
// @route   PUT /api/tasks/reorder
// @access  Private
const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body; // Array of { id, status, position }

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ message: 'Tasks array is required' });
    }

    // Update each task's position and status
    const updatePromises = tasks.map(async ({ id, status, position }) => {
      const task = await Task.findById(id);

      if (!task) {
        throw new Error(`Task ${id} not found`);
      }

      // Check ownership
      if (task.user.toString() !== req.user._id.toString()) {
        throw new Error('Not authorized to update this task');
      }

      return Task.findByIdAndUpdate(
        id,
        { status, position },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    // Return all tasks with updated positions
    const updatedTasks = await Task.find({ user: req.user._id }).sort({ position: 1, createdAt: -1 });
    res.json(updatedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, reorderTasks, deleteTask };
