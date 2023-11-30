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
    type: {
        type: String
    },
    key: {
        type: String
    },
    sampleUrl: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }


})

module.exports = mongoose.model('Sample', SampleSchema)
