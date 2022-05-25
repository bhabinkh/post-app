const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')

const { createComment, listComments } = require('../controllers/comment')

router.route('/comments').get(listComments)
router.route('/comments').post(auth, createComment)

module.exports = router