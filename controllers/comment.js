const { BadRequest } = require("../errors/error")
const Comment = require('../models/Comment')

const createComment = async (userId) => {
    let { comment, postId } = req.body
    comment = content.toLowerCase() || ''
    const postComment = await Comment.create({ comment: comment, postId: postId, commentedBy: userId })
    if (!postComment) {
        throw new BadRequest('comments not created')
    }
    return res.status(StatusCodes.OK).json({ postComment })
}

const listComments = async () => {
    const { postId } = req.body;
    const comment = await Comment.find({ postId: postId }).limit(3)
    if (!comment) {
        throw new BadRequest('Posts not found')
    }
    return res.status(StatusCodes.OK).json({ comment })
}

module.exports = { createComment, listComments }
