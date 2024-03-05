const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    adminID: Number,
    password: String,
    firstName: String,
    lastName: String,
});

staffSchema.set('collection', 'staff')

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
