const User = require("../models/task");
const jwt = require("jsonwebtoken");
const express = require("express");
const Task = require("../models/task");
const auth = require('../middlewares/auth')
const router = express.Router();

router.post("/",auth ,async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    const userId = req.payload.id;
    console.log(userId)

    const newTask = new Task({
      title,
      description,
      due_date,
      userId,
    });

    await newTask.save();

    res.status(201).json({ message: "Task created successfully" });
  } catch (err) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router
