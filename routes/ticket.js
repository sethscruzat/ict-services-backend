const express = require('express');
const Ticket = require('./models/ticketModel');

const router = express.Router();

//Admin assigning task to technician
router.put('/ticket/add', async (req, res) => {
    try {
        const {equipmentID, location, remarks, issuedBy, assignedTo} = req.body;
        let ticketID = 1;
        const status = "In Progress"

        const highestTicket = await Ticket.findOne().sort({ ticketID: -1 });
        if (highestTicket) {
            ticketID = highestTicket.ticketID + 1; // Increment highest ticketID by 1
        }
        const newTicket = await Ticket.create({
            ticketID,
            equipmentID,
            location,
            remarks,
            status,
            issuedBy,
            assignedTo,
        });
        res.status(200).json(newTicket);
    } catch (error) {
        console.error('Error updating equipment:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route for marking as done by technician
router.put('/ticket/complete/:ticketID', async (req, res) => {
    try {
        const query = { email: req.params.ticketID };
        const updatedData = await Ticket.updateOne(query,{ $set: { status: req.body } });
        res.status(200).json(updatedData);
    } catch (error) {
        console.error('Error updating equipment:', error);
        res.status(500).json({ message: error.message });
    }
});

// gets all tasks
router.get('/ticket/complete',async (req, res) => {
    try {
        const allTickets = await Ticket.find({status: "Complete"});
        res.status(200).json(allTickets)
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// gets a specific task for technician. used to check the details of a ticket
router.get('/ticket/find/:techID/:ticketID',async (req, res) => {
    try {
        const { techID, ticketID } = req.params;
        const techTask = await Ticket.findOne({ticketID, 'assignedTo.techID': techID})
        const responseData = {
            equipmentID: techTask.equipmentID,
            equipmentName: techTask.equipmentName,
            location: techTask.location,
            remarks: techTask.remarks,
            issuedBy: techTask.issuedBy,
        }
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// lists all of technicians pending tickets
router.get('/ticket/list/:techID',async (req, res) => {
    try {
        const query = {'assignedTo.techID': req.params.techID, status: "In Progress"}
        const ticketList = await Ticket.find(query)
        res.status(200).json(ticketList);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;