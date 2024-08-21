const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    probability: { type: Number, required: true }
});

module.exports = mongoose.model('Reward', rewardSchema);
