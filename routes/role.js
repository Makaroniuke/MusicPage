const express = require('express')
const router = express.Router()
const roleController = require('../controllers/role')

const { isLoggedIn } = require('../middleware')




router.route('/role')
    .get(roleController.index)
    .post(roleController.getUser)

router.route('/rolesChange/:id')
    .get(isLoggedIn, roleController.showUser)
    .post(isLoggedIn, roleController.changeRole)

module.exports = router