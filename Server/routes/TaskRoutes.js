const express = require("express");
const Task = require("../models/task");
const auth = require('../middlewares/auth')
const SubTask = require('../models/subtask')
const mongoose = require('mongoose')
const router = express.Router();

router.post("/task",auth ,async (req, res) => {
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


router.put('/tasks/:taskId',auth,async(req,res)=>{
  try{
    const task_id = req.params.taskId;
    const {due_date,status} = req.body;
    const taskId = new mongoose.Types.ObjectId(task_id);
  
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: 'Invalid task_id format' });
    }
    const task = await Task.findById({_id : taskId})
    if(!task)
    {
      return res.status(404).json({message : "Task not found"});
    }
    if(due_date)
    {
      task.due_date = due_date
    }
    if(status){
      task.status = status

      const subtasks = await SubTask.find({task_id : taskId})
      const subtaskStatus = status === 'DONE' ? 1 : 0;
      for(const subtask of subtasks)
      {
        subtask.status = subtaskStatus;
        await subtask.save()
      }
    }

    await task.save();

    return res.status(200).json({message : 'Task updated successfully'})
  }
  catch(err)
  {
    console.log(err)
    return res.status(500).json({message : 'Internal Server Error'})
  }
})

router.delete('/tasks/:taskId',auth,async(req,res)=>{
  try{
    const task_id = req.params.taskId
    const taskId = new mongoose.Types.ObjectId(task_id);
  
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: 'Invalid task_id format' });
    }
    const task = await Task.findById({_id : taskId})
    if(!task)
    {
      return res.status(404).json({message : "Task not found"})
    }
    console.log(task)
    await Task.deleteOne({ _id: taskId });

    await SubTask.deleteMany({task_id : taskId})

    return res.status(200).json({message : "Task and associated subtasks deleted successfully"})
  }
  catch(err){
    console.log('Error deleting task and subtasks',err)
    return res.status(500).json({message : "Internal server error"})
  }
})


module.exports = router
