const { string } = require('joi')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LessonSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    preferences: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})

module.exports = mongoose.model('Lesson', LessonSchema)
