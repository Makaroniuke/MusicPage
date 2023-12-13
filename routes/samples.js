const express = require('express')
const router = express.Router()
const samplesController = require('../controllers/samples')

const { isLoggedIn, isTrackAuthor, isSampleAuthor } = require('../middleware')

const multer = require('multer')
const { audioStorage, imageStorage } = require('../cloudinary')
const audioUpload = multer({ storage: audioStorage })


router.route('/')
    .get(samplesController.index)

router.route('/new')
    .get(isLoggedIn, samplesController.newForm)
    .post(isLoggedIn, audioUpload.single('sample'), samplesController.new)

router.route('/:id')
    .delete(isLoggedIn, isSampleAuthor, samplesController.delete)

router.route('/:id/edit')
    .get(isLoggedIn, isSampleAuthor, samplesController.editForm)
    .put(isTrackAuthor,isSampleAuthor, samplesController.edit)

module.exports = router