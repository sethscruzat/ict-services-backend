const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
    technicianID: Number,
    ratings: Array,
});

technicianSchema.set('collection', 'technician')

const Technician = mongoose.model('User', technicianSchema);

module.exports = Technician;
