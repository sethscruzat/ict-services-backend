const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketID: Number,
    equipmentID: String,
    location: String,
    remarks: String,
    status: String,
    issuedBy: {adminID: Number, adminName: String},
    assignedTo: {techID: Number, techName: String},
    dateCreated: Date,
})
ticketSchema.set('collection', 'ticket')

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
