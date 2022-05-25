const jwt = require("jsonwebtoken")
const { BadRequest, Unauthorized } = require("../errors/error")
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require("../models/User")

const createPost = async (userId) => {
    let { content, location } = req.body
    content = content.toLowerCase() || ''
    location = location.toLowerCase() || ''
    const post = await Post.create({ content: content, location: location, postedBy: userId })
    if (!post) {
        throw new BadRequest('Posts not created')
    }
    return res.status(StatusCodes.OK).json({ post })
}
// const listMyPosts = async (userId) => {
//     const post = await Post.find({ postedBy: userId })
//     if (!post) {
//         throw new BadRequest('Posts not found')
//     }
//     return res.status(StatusCodes.OK).json({ post })
// }
// const getPost = async () => {
//     const post = await Post.find({ _id: req.params.id })
//     if (!post) {
//         throw new BadRequest('Posts not found')
//     }
//     return res.status(StatusCodes.OK).json({ post })
// }
const listPosts = async () => {
    const posts = await Post.aggregate([{
        $lookup: {
            form: "User",
            pipeline:
            {
                $match:
                {
                    $expr:
                    {
                        $and:
                            [
                                { $eq: ["$_id", "$$userId"] }
                            ]
                    }
                }
            },
            as: "postedBy"
        },
    },
    {
        $lookup:
        {
            from: "Comment",
            pipeline: [
                {
                    $match:
                    {
                        $expr:
                        {
                            $and:
                                [
                                    { $eq: ["$postId", "$$postId"] }
                                ]
                        }
                    }
                }, {
                    $sort: {
                        "createdAt": -1
                    },
                },
                { $limit: 3 },
            ],
            as: "comments"
        }
    },]).limit(100)
    if (!posts) {
        throw new BadRequest('Posts not found')
    }
    return res.status(StatusCodes.OK).json({ posts })
}

const postNearBy = async (userId) => {
    const user = await User.findById({ userId })
    const location = user.location

    const post = await Post.find({
        location:
        {
            $near:
            {
                // $geometry: { type: "Point",  coordinates: [ -73.9667, 40.78 ] },
                $geometry: location,
                $minDistance: 0,
                $maxDistance: 500000
            }
        }
    }
    ).limit(100)

    if (!post) {
        throw new BadRequest('Posts nearby not found')
    }
    return res.status(StatusCodes.OK).json({ post })
}

const updatePost = async (userId) => {
    let { content, location } = req.body
    content = content.toLowerCase() || ''
    location = location.toLowerCase() || ''

    const user = await Post.findById({ _id: req.params.id })
    if (user.postedBy !== userId) {
        return Unauthorized('User not authorized')
    }
    const post = await Post.findOneAndUpdate({ _id: req.params.id }, { content: content, location: location })
    if (!post) {
        throw new BadRequest('Posts not updated')
    }
    return res.status(StatusCodes.OK).json({ post })
}

const deletePost = async (userId) => {
    const userPost = await Post.findById({ _id: req.params.id })
    if (userPost.postedBy !== userId) {
        return Unauthorized('User not authorized')
    }
    const post = await Post.findOneAndRemove({ _id: req.params.id })
    const deleteComments = await Comment.deleteMany({ post: postId })
    if (!post) {
        throw new BadRequest('Posts not deleted')
    }
    if (!deleteComments) {
        throw new BadRequest('Posts comments not deleted')
    }
    return res.status(StatusCodes.OK).json({ post })
}

module.exports = { createPost, listPosts, postNearBy, updatePost, deletePost }
