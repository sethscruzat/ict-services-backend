const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: Number,
    password: String,
    role: String,
    firstName: String,
    lastName: String,
});

userSchema.set('collection', 'users')

const User = mongoose.model('Admin', userSchema);

module.exports = User;
