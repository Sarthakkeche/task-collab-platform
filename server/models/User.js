const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

// FIX: We removed 'next' from the parameters. 
// With 'async', Mongoose knows to wait for the function to finish automatically.
UserSchema.pre('save', async function () {
    // If password is not modified, simply return (stops execution)
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw new Error("Password Hashing Failed: " + err.message);
    }
});

module.exports = mongoose.model('User', UserSchema);