const express = require('express');
const Equipment = require('./models/equip');

const router = express.Router();

router.get('/equipment/',async (req, res) => {
  try {
    const equipment = await Equipment.find();
    console.log(equipment)
    res.status(200).json(equipment);
  } catch (error) {
    console.error('Error fetching equipment list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/equipment/:id',async (req, res) => {
  try {
    const equipquery = {equipmentID: req.query.equipmentID}

    const equipment = await Equipment.findOne(equipquery);
    if(!equipment){
      res.status(404).send()
    }
    res.status(200).json(equipment);
    console.log(equipment)
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/equipment/add',async (req, res) => {
    try {
      const {equipmentID, issuedTo, condition, location, noOfUnits, remarks, status, usageRate} = req.body

      const newEquipment = await Equipment.create({
        equipmentID,
        issuedTo,
        condition,
        location,
        noOfUnits,
        remarks,
        status,
        usageRate
      });
  
      res.status(201).json(newEquipment);
      console.log(newEquipment)
    } catch (error) {
      console.error('Error adding equipment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
