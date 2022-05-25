const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    posts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }],
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide an email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',],
    },
    password: {
        type: String,
        select: false,
        required: true
    }
})

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign({
        userId: this._id
    },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

UserSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.comparePassword(userPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)