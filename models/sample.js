const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SampleSchema = new Schema({
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
    sampleUrl: {
        type: String,
        required: true
    }


})

module.exports = mongoose.model('Sample', SampleSchema)
