const Task = require('../models/Task')
const asyncHandler = require('express-async-handler')

// @desc Get all tasks
// @route GET /tasks
// @access Public
const getAllTasks = asyncHandler(async (req, res) => {
    // Get all tasks from MongoDB
    const tasks = await Task.find().lean()

    // If no tasks 
    if (!tasks?.length) {
        return res.status(400).json({ message: 'No tasks in Database. Create a new task' })
    }

    res.json(tasks)
})

// @desc Create new task
// @route POST /tasks
// @access Public
const createNewTask = asyncHandler(async (req, res) => {
    const { taskname, completed } = req.body

    // Confirm data
    if (!taskname) {
        return res.status(400).json({ message: 'taskname is required' })
    }

    // Check for duplicate taskname
    const duplicate = await Task.findOne({ taskname }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate taskname' })
    }

    // Create and store new task 
    const task = await Task.create({ taskname, completed })

    if (task) { //created 
        res.status(201).json({ message: `New task ${taskname} created` })
    } else {
        res.status(400).json({ message: 'Invalid task data received' })
    }
})

// @desc Update a task
// @route PATCH /tasks
// @access Public
const updateTask = asyncHandler(async (req, res) => {
    const {id, completed } = req.body

    // Confirm data 
    if (!id || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed and id fields is required' })
    }

    // Does the task exist to update?
    const task = await Task.findById(id).exec()

    if (!task) {
        return res.status(400).json({ message: 'Task not found' })
    }

    task.completed = completed

    const updatedTask = await task.save()

    res.json({ message: `${updatedTask.taskname} updated` })
})

// @desc Delete a task
// @route DELETE /tasks
// @access Public
const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Task ID Required' })
    }

    // Does the task exist to delete?
    const task = await Task.findById(id).exec()

    if (!task) {
        return res.status(400).json({ message: 'Task not found' })
    }

    const result = await task.deleteOne()

    const reply = `Taskname ${result.taskname} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllTasks,
    createNewTask,
    updateTask,
    deleteTask
}