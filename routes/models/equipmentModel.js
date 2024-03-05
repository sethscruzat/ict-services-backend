const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    equipmentID: String,
    issuedTo: String,
    condition: String,
    location: String,
    noOfUnits: Number,
    remarks: String,
    status: String,
    usageRate: String
})
equipmentSchema.set('collection', 'equipment')

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;
