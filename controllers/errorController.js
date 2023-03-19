import * as dotenv from 'dotenv';
dotenv.config();
import AppError from '../utils/appError.js';

const handelCastErrorDB = err => {

    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handelDuplicateErrorDB = err => {
    const value = JSON.stringify(err.keyValue)
    const message = `Duplicate filed value: ${value}. Please try anther value`
    return new AppError(message, 400)
}
const handelValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(ele => ele.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}
const handelJWTError = () => {
    return new AppError('Invalid token. Please login again!', 401)
}
const handelJWTExpiredError = () => {
    return new AppError('Your token has expired. Please login again!', 401)
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    })

}
const sendErrorProd = (err, res) => {
    // console.log(err);
    //! Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
        //! Programing or other unknown error: don't leak error to client    
    }
    // 1) log error

    // 2) send general error message
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
    })
}

export default (err, req, res, next) => {

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    if (process.env.NODE_ENV === 'development') {

        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err, message: err.message }
        if (err.name === 'CastError') error = handelCastErrorDB(error)
        if (err.code === 11000) error = handelDuplicateErrorDB(error)
        if (err.name === 'ValidationError') error = handelValidationErrorDB(error)
        if (err.name === 'JsonWebTokenError') error = handelJWTError()
        if (err.name === 'TokenExpiredError') error = handelJWTExpiredError()


        sendErrorProd(error, res)
    }
}