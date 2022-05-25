const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')

const { createPost, listPosts, postNearBy, updatePost, deletePost } = require('../controllers/post')

router.route('/posts').get(listPosts).get(auth, postNearBy)
router.route('/posts').post(auth, createPost)

router.route('/posts/:id').patch(auth, updatePost).delete(auth, deletePost)
module.exports = router
