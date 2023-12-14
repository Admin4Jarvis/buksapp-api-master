const mongoose = require('mongoose');
const validator = require('validator');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please fill role name'],
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;