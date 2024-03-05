const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
    technicianID: Number,
    password: String,
    firstName: String,
    lastName: String,
    ratings: Array,
});

technicianSchema.set('collection', 'technician')

const Technician = mongoose.model('Technician', technicianSchema);

module.exports = Technician;
