const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const playerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isOnline: { type: Boolean, default: false },
    commonBoxesOpened: { type: Number, default: 0 },
    rareBoxesOpened: { type: Number, default: 0 },
    epicBoxesOpened: { type: Number, default: 0 },
    legendaryBoxesOpened: { type: Number, default: 0 },
    totalBoxesOpened: { type: Number, default: 0 }
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
