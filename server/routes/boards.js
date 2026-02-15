const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Board = require('../models/Board');

// Get All Boards
router.get('/', auth, async (req, res) => {
    try {
        const boards = await Board.find({ user: req.user.id });
        res.json(boards);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Board
router.post('/', auth, async (req, res) => {
    try {
        const newBoard = new Board({
            title: req.body.title,
            user: req.user.id,
            lists: [{ title: 'To Do' }, { title: 'In Progress' }, { title: 'Done' }] // Default Lists
        });
        const board = await newBoard.save();
        res.json(board);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get Single Board (with Lists)
router.get('/:id', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ msg: 'Board not found' });
        res.json(board);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;