const Role = require('../models/roleModel');
const base = require('./baseController');

exports.createRole = base.createOne(Role);
exports.getAllRoles = base.getAll(Role);
exports.getRole = base.getOne(Role);

// Don't update password on this 
exports.updateRole = base.updateOne(Role);
exports.deleteRole = base.deleteOne(Role);