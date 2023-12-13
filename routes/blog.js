const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blog')

const { isLoggedIn, isProducer, isSampleAuthor } = require('../middleware')

const multer = require('multer')
const { audioStorage, imageStorage } = require('../cloudinary')
const imageUpload = multer({ storage: imageStorage })


router.route('/')
    .get(blogController.index)

router.route('/new')
    .get(isLoggedIn, isProducer, blogController.newForm)
    .post(isLoggedIn, isProducer, imageUpload.single('image'), blogController.new)

router.route('/:id')
    .get(blogController.blogDetails)
    .delete(isLoggedIn, isProducer, blogController.delete)

router.route('/:id/edit')
    .get(isLoggedIn, isProducer, blogController.editForm)
    .put(isLoggedIn, isProducer, blogController.edit)

module.exports = router