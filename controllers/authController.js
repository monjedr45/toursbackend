import { promisify } from 'util';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/email.js';
import { createHash } from 'crypto';
import { validateSignup } from '../validation/userValidation.js';



const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    })
}



export const signup = catchAsync(async (req, res, next) => {


    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        // passwordChangedAt: req.body.passwordChangedAt
    })
    const token = signToken(newUser._id)
    newUser.password = undefined

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    // 1) check if the email and password exists
    if (!email || !password) {
        return next(new AppError('Please enter your email and password', 400))
    }

    // 2) check if the user exists && password is correct
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Email or Password', 401))
    }

    // 3) If everything ok, send token to the user
    const token = signToken(user._id)
  
    res.status(200).json({
        status: 'success',
        token,
    })
})

export const logout = async (req, res) => {

    const currentUser = await User.findById(req.user.id)

    currentUser.loggedOutAt = Date.now() - 1
    currentUser.save()

    res.status(200).json({ status: 'success' })
}

export const auth = catchAsync(async (req, res, next) => {
    //1) Getting token and check of it's there
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    // console.log('token', token);
    if (!token) {
        return next(new AppError('You are not logged in! Please log in', 401))
    }

    //2) verification token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // console.log(decode);
    //3) Check if the user still exists
    const currentUser = await User.findById(decode.id)
    if (!currentUser) {
        return next(new AppError('The user belongs to this token no longer exists', 401))
    }

    //4)Check if the user changed password after the token was created
    if (currentUser.changedPasswordAfter(decode.iat)) {
        return next(new AppError('User recently changed password! Please login again', 401))
    }
    if (currentUser.loggedAfter(decode.iat)) {
        return next(new AppError('Your session ended! Please login again', 401))
    }
    req.user = currentUser
    next()
})

export function restrictTo(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have the permission to perform this action', 403))
        }
        next()
    }
}

export const forgotPassword = catchAsync(async (req, res, next) => {
    // 1) get the user based on email
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new AppError('There is no user with email ' + req.body.email))

    //2) Generate random password reset token
    const resetToken = user.CreatePasswordResetToken()
    await user.save({ validateBeforeSave: false })

    //3) send the reset email to user
    const resetURL = `http://localhost:3001/reset_password/${resetToken}`

    const message = `Forgot your password? Submit a PATCH request with your new password and password confirmation to: ${resetURL}.\nIf you don't forget your password, please ignore this email`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        })

        res.status(200).json({
            status: 'success',
            message: `Token sent successfully to ${user.email}`
        })
    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })
        return next(new AppError('There was an error sending the email. Please try again', 500))
    }

})

export const resetPassword = catchAsync(async (req, res, next) => {
    //1) Get user based on token
    const hashedToken = createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) {
        return next(new AppError('Token in invalid or expired. Please try again'))
    }

    //2) If the token is valid, and the user is exists, set new password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    //3) Update changedPasswordAT for the user

    //4) Login the user, and send token
    const token = signToken(user._id)

    res.status(200).json({
        status: 'success',
        token,
    })
})

export const updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, password, passwordConfirm } = req.body
    //1) Get user from the collection
    const currentUser = await User.findById(req.user.id).select('+password')
    //2) Check if Posted current password is correct

    if (!(await currentUser.correctPassword(currentPassword, currentUser.password))) {
        return next(new AppError('Current password not correct', 401))
    }
    //3) update password
    currentUser.password = password
    currentUser.passwordConfirm = passwordConfirm
    await currentUser.save()
    //4) Login the user, and send token
    const token = signToken(currentUser._id)

    res.status(200).json({
        status: 'success',
        token,
    })
})

