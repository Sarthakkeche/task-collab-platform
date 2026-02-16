const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    action: { type: String, required: true }, // e.g., "moved task", "created task"
    details: { type: String }, // "Task 'Bug Fix' moved to Done"
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);