const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profile')

const { isLoggedIn } = require('../middleware')

const multer = require('multer')
const { audioStorage, imageStorage } = require('../cloudinary')
const audioUpload = multer({ storage: audioStorage })


router.route('/')
    .get(profileController.index)

router.route('/:id/addTrack')
    .get(isLoggedIn, profileController.addTrackForm)
    .post(isLoggedIn, audioUpload.single('track'), profileController.addTrack)

router.route('/:id/editTrack')
    .get(isLoggedIn, profileController.editTrackForm)
    .put(isLoggedIn, profileController.editTrack)

router.route('/:user/:id')
    .delete(isLoggedIn, profileController.delete)


module.exports = router