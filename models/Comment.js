const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'comment is required field.']
    },
    commentedBy: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    postId: {
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }
},
    {
        timestamps: true
    }
)
module.exports = mongoose.model('Comment', CommentSchema)