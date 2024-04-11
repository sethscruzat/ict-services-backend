const express = require('express');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const userRoles = ['admin', 'technician']

router.get('/user',async (req, res) => {
  try {
    let allUsers = [];
    const adminCollection = await User.admin.find({});
    const techCollection = await User.technician.find({});
    allUsers = allUsers.concat(adminCollection, techCollection);
    res.status(200).json(allUsers)
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get technician list
router.get('/technician/all',async (req, res) => {
  try {
    const techCollection = await User.technician.find({});
    res.status(200).json(techCollection)
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// geting Technician Data
router.get('/user/tech/:techID',async (req, res) => {
  try {
    const query = {techID: req.params.techID}
    const user = await User["technician"].findOne(query);
    const responseData = {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// geting Admin Data
router.get('/user/admin/:adminID',async (req, res) => {
  try {
    const query = {adminID: req.params.adminID}
    const user = await User["admin"].findOne(query);
    const responseData = {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// lists all of the completed tickets that admin has assigned
router.put('/admin/rate/:techID',async (req, res) => {
  try {
      const query = {techID: req.params.techID}
      const ticketList = await User.technician.updateOne(query,{ $push: { remarks: req.body }},{ new: true })
      res.status(200).json(ticketList);
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login',async (req, res) => {
  const {email, password} = req.body

  try {
    let user =null;
    for (let role of userRoles) {
      user = await User[role].findOne({email});

      if (user) {
        break;
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log(isValidPassword)
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ techID: user.techID, role: user.role }, process.env.JWT_KEY,{ expiresIn: '1h' });
    const responseData = {
      techID: user.techID,
      adminID: user.adminID,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }
    res.status(200).json(responseData);
    //res.json(token)

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// TODO : Make this only accessible by staff/admin (basically, technicians lang ang nireregister)
// NOT SURE ABOUT ADDING THIS YET. NOTE: ADD PASSWORD HASHING
// router.post('/user/register',async (req, res) => {
//   const query = { userID: req.body.userID}
//   try{
//     checkTech = await User.findOne(query)

//     if(checkTech == null){
//       const newUser = new User({
//         userID: req.body.userID,
//         password: req.body.password,
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         ratings: []
//       })
//       newUser.save()
//       res.json(newUser)
//     }else{
//       return res.status(400).json({userID: "A user has already resgistered with this ID"})
//     }
//   }catch(error){
//     console.error("Error when creating user: ", error)
//     res.status(400).send()
//   }
// })


module.exports = router;
