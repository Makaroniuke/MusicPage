const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BlogSchema = new Schema({
    article: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Blog', BlogSchema)
