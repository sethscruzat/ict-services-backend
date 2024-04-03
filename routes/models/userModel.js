const mongoose = require('mongoose');

const userSchemas = {
    admin: new mongoose.Schema({
        adminID: Number,
        email: String,
        password: String,
        firstName: String,
        lastName: String,
        tasks: Array,
    }),
    technician: new mongoose.Schema({
        techID: Number,
        email: String,
        password: String,
        firstName: String,
        lastName: String,
        tasks: Array,
        remarks: Array
    })
};

//userSchema.set('collection', 'users')

const User = {
    admin: mongoose.model('Admin', userSchemas.admin, 'admin'),
    technician: mongoose.model('Technician', userSchemas.technician, 'technician')
}

module.exports = User;
