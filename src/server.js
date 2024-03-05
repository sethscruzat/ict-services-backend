const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT;

const technicianRoutes = require('../routes/technician.js');
const equipmentRoutes = require('../routes/equipment.js')
const adminRoutes = require('../routes/admin.js');
const staffRoutes = require('../routes/staff.js')
const uri = process.env.MONGO_DB;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(cors())

mongoose.connect(uri, { dbName: "ict-services", useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.use('', technicianRoutes)
    app.use('', equipmentRoutes)
    app.use('', staffRoutes)
    app.use('', adminRoutes)
    app.listen(PORT, () => {
      console.log(`Server started successfully at port ${PORT}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

