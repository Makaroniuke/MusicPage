const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BlogSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    article: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Blog', BlogSchema)
