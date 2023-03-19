import AppError from '../utils/appError.js'
import catchAsync from '../utils/catchAsync.js'
import Booking from '../models/bookingModel.js'
import { deleteOne, updateOne, getOne, getAll } from './handlerFactory.js'
import Tour from '../models/tourModel.js'


export const checkTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.body.tour)

    if (Date.now() > tour.startDates[0]) {
        return next(new AppError('This tour is already ended. Please choose another tour.', 404))
    }
    next()
})

export const bookingCheckout = catchAsync(async (req, res, next) => {
    const booking = await Booking.create({
        tour: req.body.tour,
        user: req.user.id,
        price: req.body.price
    })

    res.status(201).json({
        stats: 'successful',
        data: {
            data: booking
        }
    })
})

export const myBooking = catchAsync(async (req, res, next) => {
    const myBooking = await Booking.find({ user: req.user.id })

    res.status(200).json({
        stats: 'successful',
        data: {
            data: myBooking
        }
    })
})


export const getBooking = getOne(Booking);
export const getAllBookings = getAll(Booking);
export const updateBooking = updateOne(Booking);
export const deleteBooking = deleteOne(Booking);