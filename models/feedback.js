const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FeedbackSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    review: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})

module.exports = mongoose.model('Feedback', FeedbackSchema)
