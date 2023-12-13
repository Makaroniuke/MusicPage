const express = require('express')
const router = express.Router()
const roleController = require('../controllers/role')

const { isLoggedIn, isAdmin } = require('../middleware')




router.route('/roles')
    .get(isLoggedIn, isAdmin, roleController.index)
    .post(isLoggedIn, isAdmin, roleController.getUser)

router.route('/rolesChange/:id')
    .get(isLoggedIn, isAdmin, roleController.showUser)
    .post(isLoggedIn,isAdmin, roleController.changeRole)

module.exports = router