const { BadRequest } = require("../errors/error")
const User = require('../models/User')

const listUser = async () => {
    const user = await User.findById({ _id: req.params.id })
    if (!user) {
        throw new BadRequest('user not listed')
    }
    return res.status(StatusCodes.OK).json({ user })
}

const myLocation = async (userId) => {
    const user = await User.findById({ userId })
    const location = user.location
    if (!location) {
        throw new BadRequest('location not created')
    }

    return res.status(StatusCodes.OK).json({ location })
}

const deleteUser = async (userId) => {
    const userPosts = await Post.findById({ postedBy: userId })

    const user = await User.findOneAndRemove({ _id: userId })
    const deletePosts = await Post.deleteMany({ postedBy: userPosts.postedBy })
    if (!user) {
        throw new BadRequest('Users not deleted')
    }
    if (!deletePosts) {
        throw new BadRequest('Posts comments not deleted')
    }
    return res.status(StatusCodes.OK).json({ user })
}

module.exports = { listUser, myLocation, deleteUser }