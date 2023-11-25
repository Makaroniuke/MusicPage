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
    artworkUrl: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }


})

module.exports = mongoose.model('Track', TrackSchema)
