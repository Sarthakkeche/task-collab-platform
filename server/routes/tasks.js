const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// Get Tasks for a Board
router.get('/:boardId', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ boardId: req.params.boardId }).sort({ position: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Task
router.post('/', auth, async (req, res) => {
    try {
        const { title, boardId, listId } = req.body;
        // Find highest position to add to bottom
        const count = await Task.countDocuments({ listId });
        
        const newTask = new Task({
            title,
            boardId,
            listId,
            position: count > 0 ? count : 0
        });
        const task = await newTask.save();
        
        // Emit Socket Event
        const io = req.app.get('socketio');
        io.to(boardId).emit('task_created', task);

        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update Task (Move / Edit)
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, listId, position, boardId } = req.body;
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        task.title = title || task.title;
        task.description = description || task.description;
        task.listId = listId || task.listId;
        task.position = position !== undefined ? position : task.position;

        await task.save();

        // Emit Socket Event for Real-time Update
        const io = req.app.get('socketio');
        io.to(boardId).emit('task_updated', task);

        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        
        const boardId = task.boardId;
        await task.deleteOne();

        const io = req.app.get('socketio');
        io.to(boardId.toString()).emit('task_deleted', req.params.id);

        res.json({ msg: 'Task removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;