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

// TODO : Make this be affected by filters (i.e. check role before displaying)
router.get('/user/:email',async (req, res) => {
  try {
    const query = {email: req.params.email}

    let user =null;
    for (let role of userRoles) {
      user = await User[role].findOne(query);

      if (user) {
        break;
      }
    }
    if(!user){
      res.status(404).send()
    }
    const responseData = {
      firstName: user.firstName,
      lastName: user.lastName,
      tasks: user.tasks,
    }
    res.status(200).json(responseData);
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
    const token = jwt.sign({ email: user.email, firstName: user.firstName }, 'secret_key', { expiresIn: '1h' });

    res.json({ token });

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
