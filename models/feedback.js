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
    track: {
        type: Schema.Types.ObjectId,
        ref: 'Track'
    },

})

module.exports = mongoose.model('Feedback', FeedbackSchema)
