const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const SubTask = require('../models/subtask');

router.post('/subtasks', async (req, res) => {
    try {
        const { id, task_id } = req.body;
        const subtask = new SubTask({ id, task_id });
        await subtask.save();
        res.status(201).json({ message: "SubTask created successfully", subtask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/subtasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const subtask = await SubTask.findByIdAndUpdate(id, { status }, { new: true });
        if (!subtask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }
        res.json({ message: 'Subtask updated successfully', subtask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/subtasks/:task_id', async (req, res) => {
    try {
      const { task_id } = req.params;
      const taskId = new mongoose.Types.ObjectId(task_id);
  
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: 'Invalid task_id format' });
      }
      const subtasks = await SubTask.find({ task_id: taskId });
  
      if (!subtasks) {
        return res.status(404).json({ message: 'Subtasks not found' });
      }
  
      res.json(subtasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.delete('/subtasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const subtask = await SubTask.findByIdAndDelete(id);
        if (!subtask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }
        res.json({ message: 'Subtask deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
