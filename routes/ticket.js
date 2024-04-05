const express = require('express');
const Ticket = require('./models/ticketModel');

const router = express.Router();

//Admin assigning task to technician, :email is technician's email
router.put('/ticket/add', async (req, res) => {
    try {
        const {ticketID, equipmentID, location, remarks, status, issuedBy, assignedTo} = req.body
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

// Route for both Admins and Technicians where the tasks that Technician completes get added to
// the completedTasks array in both admin and technician
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
        const allTickets = await Ticket.find({});
        res.status(200).json(allTickets)
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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

router.get('/ticket/list/:techID',async (req, res) => {
    try {
        const query = {'assignedTo.techID': req.params.techID}
        const ticketList = await Ticket.find(query)
        res.status(200).json(ticketList);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;