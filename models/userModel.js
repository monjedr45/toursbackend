
import Mongoose from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import catchAsync from '../utils/catchAsync.js'

const userSchema = new Mongoose.Schema({
    name: {
        type: String,

    },
    email: {
        type: String,
        unique: true,
    },
    photo: {
        type: String,
        default: 'default.jpg',
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guide', 'lead-guide'],
        default: 'user'
    },

    password: {
        type: String,
        select: false
    },
    passwordConfirm: {
        type: String,
    },
    loggedOutAt: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre('save', async function (next) {
    //! Only run this function if password was actually modified 
    if (!this.isModified('password')) return next()

    //! Hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12)

    //! Delete the passwordConfirm field
    this.passwordConfirm = undefined
    next()
})

userSchema.pre('save', async function (next) {
    //! Only run this function if password was actually modified 
    if (!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() - 1

    next()
})

userSchema.pre(/^find/, async function (next) {
    this.find({ active: { $ne: false } })
    next()
})


// instance methods :method will be available on all documents in the collection. 
userSchema.methods.correctPassword = async function (enteredPassword, userPassword) {
    return await bcrypt.compare(enteredPassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (timeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return timeStamp < changedTimeStamp
    }
    return false
}
userSchema.methods.loggedAfter = function (timeStamp) {
    if (this.loggedOutAt) {
        const loggedOutTimeStamp = parseInt(this.loggedOutAt.getTime() / 1000, 10)
        return timeStamp < loggedOutTimeStamp
    }
    return false
}


userSchema.methods.CreatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

const User = new Mongoose.model('User', userSchema)
export default User