const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TrackSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    filename: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    forFeedback: {
        type: Boolean
    },
    url: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }


})

module.exports = mongoose.model('Track', TrackSchema)
