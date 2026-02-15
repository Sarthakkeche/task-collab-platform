const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    listId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Links to a specific list inside the Board
    position: { type: Number, required: true, default: 0 }, // For drag-and-drop ordering
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);