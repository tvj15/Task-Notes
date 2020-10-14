const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/Task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
},{
    timestamps: true,
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'author',
})

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.pre('remove', async function(next) {
    await Task.deleteMany({author:this._id})
    next()
})

userSchema.methods.generateAuthCode = async function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat({ token })
    return token
}

userSchema.statics.findByCredentials = async function(body) {
    const user = await User.findOne({ userName: body.userName })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(body.password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

const User = new mongoose.model('User', userSchema)

module.exports = User