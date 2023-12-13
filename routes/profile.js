const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profile')

const { isLoggedIn, isTrackAuthor } = require('../middleware')

const multer = require('multer')
const { audioStorage, imageStorage } = require('../cloudinary')
const audioUpload = multer({ storage: audioStorage })
const imageUpload = multer({ storage: imageStorage })


router.route('/:id')
    .get(profileController.index)

router.route('/:id/addTrack')
    .get(isLoggedIn, profileController.addTrackForm)
    .post(isLoggedIn, audioUpload.single('track'), profileController.addTrack)

router.route('/:user/:id/editTrack')
    .get(isLoggedIn, isTrackAuthor, profileController.editTrackForm)
    .post(isLoggedIn, isTrackAuthor, profileController.editTrack)

router.route('/:user/:id')
    .delete(isLoggedIn, isTrackAuthor, profileController.delete)

router.route('/:id/editProfile')
    .get(isLoggedIn, profileController.editProfileForm)
    .post(isLoggedIn, imageUpload.single('image'), profileController.editProfile)

module.exports = router