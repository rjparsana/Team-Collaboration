// routes/task.js
const express = require('express');
const Task = require('../models/Task');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new task
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, assignedTo, priority } = req.body;

  try {
    const task = new Task({ title, description, assignedTo, priority });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task.' });
  }
});

// Get all tasks (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks.' });
  }
});

// Update a task by ID
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task.' });
  }
});

// Delete a task by ID (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

module.exports = router;
