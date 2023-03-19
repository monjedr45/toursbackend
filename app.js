
import express from 'express'
import fs from 'fs'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
// import xss from 'express-xss'
import helmet from 'helmet'
import AppError from './utils/appError.js'
import globalErrorHandler from './controllers/errorController.js'
import morgan from 'morgan'
import toursRouter from './routes/tourRoutes.js'
import usersRouter from './routes/userRoutes.js'
import reviewRouter from './routes/reviewRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import bodyParser from 'body-parser'
import { errors } from "celebrate";
import compression from 'compression'



const app = express()
//! middleware
// Set security HTTP handlers
app.use(helmet({
    crossOriginResourcePolicy: false,
}))
app.use(cors())

// Development logging
app.use(morgan('dev'))

// serving statics files
app.use(express.static('./public'))
// app.use(bodyParser.json())

// Limit requests from same IP
const limiter = rateLimit({
    max: 1000000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests, please try again after an hour',
})
app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }))

// Data sanitization against NoSQL injection
app.use(mongoSanitize())
app.use(cookieParser())


app.use(compression())

//! routes
app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

//! not found routes
app.all('*', (req, res, next) => {


    next(new AppError(`Cant find ${req.originalUrl} in this server`, 404))
})
app.use(globalErrorHandler)

export default app
