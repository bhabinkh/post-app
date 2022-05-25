const { StatusCodes } = require("http-status-codes")
const { BadRequest, Unauthorized } = require("../errors/error")
const User = require("../models/User")

const register = async (req, res) => {
    const { firstName, lastName, location, email, password } = req.body

    const userExist = await User.findOne({ email: email })
    if (userExist) {
        throw new BadRequest('Email is registered.')
    }

    const user = await User.create({ firstName: firstName, lastName: lastName, location: location, email: email, password: password })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ token })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequest('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new Unauthorized('Invalid credentials')
    }
    const isPasswordCorrect = await user.comaparePassword(password)
    if (!isPasswordCorrect) {
        throw new Unauthorized('Invalid credentials')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ token })
}

module.exports = { register, login }