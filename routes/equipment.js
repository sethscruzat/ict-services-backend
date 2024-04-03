const express = require('express');
const Equipment = require('./models/equipmentModel');

const router = express.Router();

//Read
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

//Read
router.get('/equipment/:id',async (req, res) => {
  try {
    const equipquery = {equipmentID: req.params.id}

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

//Create
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
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //Delete
router.delete('/equipment/delete/:id', async (req, res) =>{
  try{
    const removedEquipment = {equipmentID: req.params.id};
    const result = await Equipment.deleteOne(removedEquipment);
    res.status(200).json(result);
  }catch(error){
    console.error('Error removing equipment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//Update
router.put('/equipment/update/:id', async (req, res) => {
  try {
    const query = { equipmentID: req.params.id };
    const updatedData = await Equipment.updateOne(query,{ $set: req.body });
    res.status(200).json(updatedData);
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.json({ message: error.message });
  }
});

module.exports = router;
