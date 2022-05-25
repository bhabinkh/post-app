const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')

const { listUser, myLocation } = require('../controllers/user')

router.route('/users').get(listUser)
router.route('/users').get(auth, myLocation)

module.exports = router