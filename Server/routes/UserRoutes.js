const User = require("../models/user");
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const SubTask = require("../models/subtask");
const Task = require("../models/task");
const router = express.Router();

router.post("user/signup", async (req, res) => {
  try {
    const { id, phone_number } = req.body;
    const newUser = new User({
      id,
      phone_number,
    });

    await newUser.save();
    console.log(newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyValue) {
      // Duplicate key error, user with this id already exists
      return res
        .status(400)
        .json({ message: "User with this id already exists" });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

router.post("user/login", async (req, res) => {
  try {
    const { phone_number } = req.body;
    const user = await User.findOne({ phone_number });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    jwt.sign(
      { id: user._id },
      process.env.ACCESS_SECRET_TOKEN,
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }
        return res
          .status(200)
          .json({ message: "Login successful", token: token });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/users/:userId/subtasks", async (req, res) => {
  try {
    const { userId } = req.params;
    const { task_id } = req.query;

    if (task_id) {
      const taskId = new mongoose.Types.ObjectId(task_id);
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: "Invalid task_id format" });
      }
      const subtasks = await SubTask.find({ task_id });
      return res.json(subtasks); // Return response and exit the function
    }
    const userTasks = await Task.find({ userId });
    const subtasks = await SubTask.find({
      task_id: { $in: userTasks.map((task) => task._id) },
    });
    return res.json(subtasks); // Return response and exit the function
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Set default pagination values
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50; // Consider adjusting based on performance and resource usage

router.get("/users/:userId/tasks", async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      priority,
      dueDate,
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
    } = req.query;

    // Build query object with optional filters
    let query = { userId }; // Start with base user ID filter

    if (priority) {
      // Validate priority value
      if (!priority.match(/^[0-3]$/)) {
        return res
          .status(400)
          .json({ message: "Invalid priority value. Must be between 0 and 3" });
      }
      query.priority = priority;
    }

    if (dueDate) {
      // Validate due date format
      if (!new Date(dueDate).toString() !== "Invalid Date") {
        return res
          .status(400)
          .json({ message: "Invalid due date format. Use YYYY-MM-DD format" });
      }
      query.dueDate = { $gte: new Date(dueDate) }; // Greater than or equal to specified date
    }

    // Handle pagination with appropriate sanitization
    const sanitizedPageSize = Math.min(parseInt(pageSize), MAX_PAGE_SIZE);
    const skip = (page - 1) * sanitizedPageSize;
    
    // Execute the query with sorting and pagination
    const tasks = await Task.find(query, null, {
      skip,
      limit: sanitizedPageSize,
      sort: { createdAt: -1 },
    });

    // Count total tasks for pagination metadata
    const totalTasks = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        pageSize: sanitizedPageSize,
        totalPages: Math.ceil(totalTasks / sanitizedPageSize),
        totalItems: totalTasks,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
