const express = require('express')
const router = express.Router()
const feedbackController = require('../controllers/feedback')

const { isLoggedIn, isProducer } = require('../middleware')

const multer = require('multer')
const { audioStorage, imageStorage } = require('../cloudinary')
const audioUpload = multer({ storage: audioStorage })


router.route('/')
    .get(feedbackController.index)

router.route('/uploadTrack')
    .get(isLoggedIn, feedbackController.uploadTrackForm)
    .post(isLoggedIn, audioUpload.single('track'), feedbackController.uploadTrack)

router.get('/new/:id', isLoggedIn, feedbackController.newForm)
    .post(isLoggedIn, isProducer, feedbackController.new)

router.route('/:id/edit')
    .get(isLoggedIn, isProducer, feedbackController.editForm)
    .put(isLoggedIn, isProducer, feedbackController.edit)


module.exports = router