const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router
    .route('/comments')
    .post(commentController.createComment)
    .get(commentController.getAllComments);


router
    .route('/comments/:id')
    .get(commentController.getComment)
    .put(commentController.updateComment)
    .delete(commentController.deleteComment);

router 
    .route('/comments/like/:id')
    .get(commentController.updateLikeComment)

router 
    .route('/comments/dislike/:id')
    .get(commentController.updateDislikeComment)

module.exports = router;