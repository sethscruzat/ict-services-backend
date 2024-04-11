const express = require('express');
const Ticket = require('./models/ticketModel');

const router = express.Router();

//Admin assigning task to technician
router.put('/ticket/add', async (req, res) => {
    try {
        const {equipmentID, location, remarks, issuedBy, assignedTo} = req.body;
        let ticketID = 1;
        const status = "In Progress"
        const dateCreated = new Date()

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
            dateCreated,
        });
        res.status(200).json(newTicket);
    } catch (error) {
        console.error('Error assigning new ticket:', error);
        res.status(400).json({ message: error.message });
    }
});

// Route for marking as done by technician
router.put('/ticket/mark/:ticketID', async (req, res) => {
    try {
        const query = { ticketID: req.params.ticketID };
        const updatedData = await Ticket.updateOne(query,{ $set: { status: "Complete" } });
        res.status(200).json(updatedData);
    } catch (error) {
        console.error('Error updating ticket details:', error);
        res.status(500).json({ message: error.message });
    }
});

// gets all tasks
router.get('/ticket/complete',async (req, res) => {
    try {
        const allTickets = await Ticket.find({status: "Complete"});
        res.status(200).json(allTickets)
    } catch (error) {
        console.error('Error fetching list of tickets:', error);
        res.status(500).json({ error: error.message });
    }
});


// lists all of the completed tickets that admin has assigned
router.get('/admin/list/:adminID',async (req, res) => {
    try {
        const query = {'issuedBy.adminID': req.params.adminID, status: "Complete"}
        const ticketList = await Ticket.find(query)
        res.status(200).json(ticketList);
    } catch (error) {
        console.error('Error fetching list of tickets:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route for getting a specific completed ticket
router.get('/admin/find/:ticketID', async (req, res) => {
    try {
        const { ticketID } = req.params;
        const result = await Ticket.findOne({ticketID});
        const responseData = {
            ticketID: result.ticketID,
            equipmentID: result.equipmentID,
            location: result.location,
            remarks: result.remarks,
            assignedTo: result.assignedTo,
            issuedBy: result.issuedBy,
        }
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching ticket details:', error);
        res.status(500).json({ message: error.message });
    }
});

// TECHNICIAN-RELATED TICKET ROUTES

// gets a specific task for technician. used to check the details of a ticket
router.get('/technician/find/:ticketID',async (req, res) => {
    try {
        const { ticketID } = req.params;
        const techTask = await Ticket.findOne({ticketID})
        const responseData = {
            ticketID: techTask.ticketID,
            equipmentID: techTask.equipmentID,
            location: techTask.location,
            remarks: techTask.remarks,
            issuedBy: techTask.issuedBy,
            assignedTo: techTask.assignedTo,
        }
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching ticket details:', error);
        res.status(500).json({ error: error.message });
    }
});

// lists all of technicians pending tickets
router.get('/technician/list/:techID',async (req, res) => {
    try {
        const query = {'assignedTo.techID': req.params.techID, status: "In Progress"}
        const ticketList = await Ticket.find(query)
        res.status(200).json(ticketList);
    } catch (error) {
        console.error('Error fetching list of tickets:', error);
        res.status(500).json({ error: error.message });
    }
});

// lists all of technicians completed tickets
router.get('/technician/complete/:techID',async (req, res) => {
    try {
        const query = {'assignedTo.techID': req.params.techID, status: "Complete"}
        const ticketList = await Ticket.find(query)
        res.status(200).json(ticketList);
    } catch (error) {
        console.error('Error fetching list of tickets:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;