const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FeedbackSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    sampleUrl: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

})

module.exports = mongoose.model('Sample', SampleSchema)
