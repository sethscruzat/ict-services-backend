const express = require('express');
const User = require('./models/userModel');

const router = express.Router();

router.get('/user',async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// TODO : Make this be affected by filters (i.e. check role before displaying)
router.get('/user/:id',async (req, res) => {
  try {
    const query = {userID: req.params.id}

    const user = await User.findOne(query);
    if(!user){
      res.status(404).send()
    }
    const responseData = {
      userID: user.userID,
      firstName: user.firstName,
      lastName: user.lastName,
      ratings: user.ratings,
    }
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/user/login',async (req, res) => {
  const query = {
    userID: req.body.userID,
    password: req.body.password
  }

  try {
    const user = await User.findOne(query)
    if (user != null){
      const objToSend = {
        userID: user.userID,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      res.json(objToSend)
    }

    if (!user) {
      return res.status(404).send();
    }

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// TODO : Make this only accessible by staff/admin (basically, technicians lang ang nireregister)
router.post('/user/register',async (req, res) => {
  const query = { userID: req.body.userID}
  try{
    checkTech = await User.findOne(query)

    if(checkTech == null){
      const newUser = new User({
        userID: req.body.userID,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        ratings: []
      })
      newUser.save()
      res.json(newUser)
    }else{
      return res.status(400).json({userID: "A user has already resgistered with this ID"})
    }
  }catch(error){
    console.error("Error when creating user: ", error)
    res.status(400).send()
  }
})


module.exports = router;
