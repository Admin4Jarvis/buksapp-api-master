const mongoose = require('mongoose');
const validator = require('validator');

const commentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes: {
        type: Number
    },
    dislikes: {
        type: Number
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

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;