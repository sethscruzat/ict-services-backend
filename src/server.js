const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT;

const userRoutes = require('../routes/user.js');
const equipmentRoutes = require('../routes/equipment.js');
const uri = process.env.MONGO_DB;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(cors())

mongoose.connect(uri, { dbName: "ict-services"})
  .then(() => {
    console.log('Connected to MongoDB');
    app.use('', userRoutes)
    app.use('', equipmentRoutes)
    app.listen(PORT, () => {
      console.log(`Server started successfully at port ${PORT}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

