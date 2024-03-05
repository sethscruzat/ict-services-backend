const express = require('express');
const Technician = require('./models/technicianModel');

const router = express.Router();

router.get('/technician',async (req, res) => {
  try {
    const technicians = await Technician.find();
    res.status(200).json(technicians)
  } catch (error) {
    console.error('Error fetching technicians:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/technician/:id',async (req, res) => {
  try {
    const query = {technicianID: req.params.id}

    const technician = await Technician.findOne(query);
    if(!technician){
      res.status(404).send()
    }
    const responseData = {
      technicianID: technician.technicianID,
      firstName: technician.firstName,
      lastName: technician.lastName,
      ratings: technician.ratings,
    }
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching technician:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/technician/login',async (req, res) => {
  const query = {
    technicianID: req.body.technicianID,
    password: req.body.password
  }

  try {
    const technician = await Technician.findOne(query)
    if (technician != null){
      const objToSend = {
        technicianID: technician.technicianID,
        firstName: technician.firstName,
        lastName: technician.lastName,
      };
      res.json(objToSend)
    }

    if (!technician) {
      return res.status(404).send();
    }

  } catch (error) {
    console.error('Error fetching technician:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/technician/register',async (req, res) => {
  const query = { technicianID: req.body.technicianID}
  try{
    checkTech = await Technician.findOne(query)

    if(checkTech == null){
      const newTechnician = new Technician({
        technicianID: req.body.technicianID,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        ratings: []
      })
      newTechnician.save()
      res.json(newTechnician)
    }else{
      return res.status(400).json({technicianID: "A technician has already resgistered with this ID"})
    }
  }catch(error){
    console.error("Error when creating technician: ", error)
    res.status(400).send()
  }
})


module.exports = router;
