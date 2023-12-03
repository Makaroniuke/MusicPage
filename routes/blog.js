const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blog')

const { isLoggedIn } = require('../middleware')

const multer = require('multer')
const { audioStorage, imageStorage } = require('../cloudinary')
const imageUpload = multer({ storage: imageStorage })


router.route('/')
    .get(blogController.index)

router.route('/new')
    .get(isLoggedIn, blogController.newForm)
    .post(isLoggedIn, imageUpload.single('image'), blogController.new)

router.route('/:id')
    .get(blogController.blogDetails)
    .delete(isLoggedIn, blogController.delete)

router.route('/:id/edit')
    .get(isLoggedIn, blogController.editForm)
    .put(blogController.edit)


module.exports = router