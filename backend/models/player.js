const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const playerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rewards: [{ type: String }],
    isOnline: { type: Boolean, default: false },
    openedCommonBoxes: { type: Number, default: 0 },
    openedRareBoxes: { type: Number, default: 0 },
    openedEpicBoxes: { type: Number, default: 0 },
    openedLegendaryBoxes: { type: Number, default: 0 }
});

playerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

playerSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Player', playerSchema);
