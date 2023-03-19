//! routes handlers for users 


import User from '../models/userModel.js'
import AppError from '../utils/appError.js'
import catchAsync from '../utils/catchAsync.js'
import { deleteOne, updateOne, getOne, getAll } from './handlerFactory.js'
import multer from 'multer';
import sharp from 'sharp';



const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false)
    }
}

const upload = multer({
    storage,
    fileFilter: multerFilter
})

export const uploadUserPhoto = upload.single('photo')

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
});


const filterObj = (body, ...allowedFields) => {
    const newBody = {}
    Object.keys(body).forEach(el => {
        if (allowedFields.includes(el)) newBody[el] = body[el]
    })
    return newBody
}

export const getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}


export const update = catchAsync(async (req, res, next) => {
    //1) Create error if user Posts password data
    // console.log('photo', req);
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route not for password update', 400));
    }

    //2) Filtered request body
    const filteredBody = filterObj(req.body, 'name', 'email')
    if (req.file) filteredBody.photo = req.file.filename

    //3) Update user data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    })
})

export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })
    res.status(204).json({
        status: 'success',
        data: null
    })
})
export const createUser = async (req, res) => {
    res.status(500).json({
        stats: 'error',
        message: 'This route is not yet defined'
    })
}

export const getAllUsers = getAll(User)
export const getUser = getOne(User)
export const updateUser = updateOne(User)
export const deleteUser = deleteOne(User)
