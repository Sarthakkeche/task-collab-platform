const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Register Route
// Register Route
router.post('/register', async (req, res) => {
    console.log("Register Request Received:", req.body); // Check if data arrives

    const { username, email, password } = req.body;
    try {
        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            console.log("User already exists");
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Create new user
        user = new User({ username, email, password });
        
        // 3. Hash password (handled by User.js pre-save hook usually)
        // If you are hashing here manually, ensure it's correct. 
        // For now, we assume the model handles it or we save plain text (bad practice but good for testing crash)
        
        await user.save();
        console.log("User Saved to DB");

        // 4. Generate Token
        const payload = { user: { id: user.id } };
        
        // CHECK IF SECRET EXISTS
        if (!process.env.JWT_SECRET) {
            throw new Error("Missing JWT_SECRET in .env file");
        }

        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
            }
        );
    } catch (err) {
        // THIS IS THE IMPORTANT PART
        console.error("SERVER CRASH ERROR:", err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});
// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;