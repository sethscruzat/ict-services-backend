const express = require('express');
const Admin = require('./models/adminModel');

const router = express.Router();

router.get('/admin',async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins)
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/admin/:id',async (req, res) => {
  try {
    const query = {adminID: req.params.id}

    const admin = await Admin.findOne(query);
    if(!admin){
      res.status(404).send()
    }
    const responseData = {
      adminID: admin.adminID,
      firstName: admin.firstName,
      lastName: admin.lastName,
    }
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/admin/login',async (req, res) => {
  const query = {
    adminID: req.body.adminID,
    password: req.body.password
  }

  try {
    const admin = await Admin.findOne(query)
    if (admin != null){
      const objToSend = {
        adminID: admin.adminID,
        firstName: admin.firstName,
        lastName: admin.lastName,
      };
      res.json(objToSend)
    }

    if (!admin) {
      return res.status(404).send();
    }

  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/admin/register',async (req, res) => {
  const query = { adminID: req.body.adminID}
  try{
    checkAdmin = await Admin.findOne(query)

    if(checkAdmin == null){
      const newAdmin = new Admin({
        adminID: req.body.adminID,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      })
      newAdmin.save()
      res.json(newAdmin)
    }else{
      return res.status(400).json({adminID: "A user has already resgistered with this ID"})
    }
  }catch(error){
    console.error("Error when creating user: ", error)
    res.status(400).send()
  }
})


module.exports = router;
