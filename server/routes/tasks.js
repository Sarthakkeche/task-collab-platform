const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

// Get Tasks (with optional Search)
router.get('/:boardId', auth, async (req, res) => {
    try {
        const { search } = req.query;
        let query = { boardId: req.params.boardId };
        
        if (search) {
            query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        const tasks = await Task.find(query).sort({ position: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Task + Log Activity
router.post('/', auth, async (req, res) => {
    try {
        const { title, boardId, listId } = req.body;
        const newTask = new Task({ title, boardId, listId });
        const task = await newTask.save();

        // Log Activity
        await Activity.create({
            userId: req.user.id,
            boardId,
            action: 'created',
            details: `Created task "${title}"`
        });

        const io = req.app.get('socketio');
        io.to(boardId).emit('task_created', task);

        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update Task (Move) + Log Activity
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, listId, position, boardId } = req.body;
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        const oldListId = task.listId;
        task.listId = listId || task.listId;
        task.position = position !== undefined ? position : task.position;
        await task.save();

        // Log only if moved lists
        if (listId && oldListId.toString() !== listId.toString()) {
             await Activity.create({
                userId: req.user.id,
                boardId,
                action: 'moved',
                details: `Moved task "${task.title}"`
            });
        }

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
        if (!task) return res.status(404).json({ msg: 'Not found' });
        
        const boardId = task.boardId;
        const title = task.title;
        await task.deleteOne();

        await Activity.create({
            userId: req.user.id,
            boardId,
            action: 'deleted',
            details: `Deleted task "${title}"`
        });

        const io = req.app.get('socketio');
        io.to(boardId.toString()).emit('task_deleted', req.params.id);
        res.json({ msg: 'Deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;