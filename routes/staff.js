const express = require('express');
const Staff = require('./models/staffModel');

const router = express.Router();

router.get('/staff',async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff)
  } catch (error) {
    console.error('Error fetching staffs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/staff/:id',async (req, res) => {
  try {
    const query = {staffID: req.params.id}

    const staff = await Staff.findOne(query);
    if(!staff){
      res.status(404).send()
    }
    const responseData = {
      technicianID: staff.technicianID,
      firstName: staff.firstName,
      lastName: staff.lastName,
    }
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/staff/login',async (req, res) => {
  const query = {
    staffID: req.body.staffID,
    password: req.body.password
  }

  try {
    const staff = await Staff.findOne(query)
    if (staff != null){
      const objToSend = {
        staffID: staff.staffID,
        firstName: staff.firstName,
        lastName: staff.lastName,
      };
      res.json(objToSend)
    }

    if (!staff) {
      return res.status(404).send();
    }

  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/staff/register',async (req, res) => {
  const query = { staffID: req.body.staffID}
  try{
    checkstaff = await Staff.findOne(query)

    if(checkstaff == null){
      const newStaff = new Staff({
        staffID: req.body.staffID,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      })
      newStaff.save()
      res.json(newStaff)
    }else{
      return res.status(400).json({staffID: "A staff member has already resgistered with this ID"})
    }
  }catch(error){
    console.error("Error when creating staff member: ", error)
    res.status(400).send()
  }
})


module.exports = router;
