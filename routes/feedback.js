const express = require('express')
const router = express.Router()
const feedbackController = require('../controllers/feedback')

const { isLoggedIn } = require('../middleware')

const multer = require('multer')
const { audioStorage, imageStorage } = require('../cloudinary')
const audioUpload = multer({ storage: audioStorage })


router.route('/')
    .get(feedbackController.index)

router.get('/new/:id', isLoggedIn, feedbackController.newForm)
    .post(isLoggedIn, feedbackController.new)

router.route('/uploadTrack')
    .get(isLoggedIn, feedbackController.uploadTrackForm)
    .post(isLoggedIn, audioUpload.single('track'), feedbackController.uploadTrack)

router.route('/:id/edit')
    .get(isLoggedIn, feedbackController.editForm)
    .put(feedbackController.edit)


module.exports = router