const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router
    .route('/roles')
    .post(roleController.createRole)
    .get(roleController.getAllRoles);


router
    .route('/roles/:id')
    .get(roleController.getRole)
    .patch(roleController.updateRole)
    .delete(roleController.deleteRole);

module.exports = router;