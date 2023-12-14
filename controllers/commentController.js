const Comment = require('../models/commentModel');
const base = require('./baseController');

exports.createComment = base.createOne(Comment);
exports.getAllComments = base.getAll(Comment);
exports.getComment = base.getOne(Comment);

// Don't update password on this 
exports.updateComment = base.updateOne(Comment);
exports.deleteComment = base.deleteOne(Comment);

// To update like and dislike for comment
exports.updateLikeComment = base.likeOne(Comment);
exports.updateDislikeComment = base.dislikeOne(Comment);