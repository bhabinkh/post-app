const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'title is required field.']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Post', PostSchema)