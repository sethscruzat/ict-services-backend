const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminID: Number,
    password: String,
    firstName: String,
    lastName: String,
});

adminSchema.set('collection', 'admin')

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
