import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a Tour!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a User!']
    },
    price: {
        type: Number,
        require: [true, 'Booking must have a price.']
    },
    paid: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

bookingSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: ['name', 'email']
    }).populate({
        path: 'tour',
        select: ['name', 'price', 'summary', 'imageCover', 'startDates']

    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
