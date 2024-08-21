const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    rewards: { type: [String], default: [] },
    isOnline: { type: Boolean, default: true }
});

module.exports = mongoose.model('Player', playerSchema);
