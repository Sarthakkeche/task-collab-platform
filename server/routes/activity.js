const express = require('express');
const router = express.Router();
// Make sure this points to the correct file you renamed (auth.js or authMiddleware.js)
const auth = require('../middleware/auth'); 

// GET /api/activity/:boardId
router.get('/:boardId', auth, async (req, res) => {
    try {
        // Dummy data for now
        res.json([
            { 
                _id: '1', 
                details: 'Board created', 
                createdAt: new Date(), 
                userId: { username: 'System' } 
            }
        ]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;