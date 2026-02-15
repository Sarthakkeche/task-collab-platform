const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // We store lists as an array of objects for simplicity in this assignment
    lists: [{
        _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        title: { type: String, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Board', BoardSchema);