
import Mongoose from 'mongoose'
import slugify from 'slugify'
import validator from 'validator'
import User from './userModel.js'

const tourSchema = new Mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    slug: {
        type: String,
        unique: true
    },
    duration: {
        type: Number,
    },
    maxGroupSize: {
        type: Number,
    },
    difficulty: {
        type: String,
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty must be one of the following: easy or medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (value) {
                return value < this.price
            }
        },
        message: 'Discount price ({VALUE}) should be below regular price'
    },
    summary: {
        type: String,
        trim: true,
    },
    description: { type: String, trim: true },
    imageCover: {
        type: String,
    },
    images: [String],
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
       
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: Mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    })



tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})
//virtual populate 
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
})
//! DOCUMENT MIDDLEWARE: runs before .save() .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name)
    next()
})

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',

        model: 'User',
        select: '-__v -passwordChangedAt -passwordResetToken -passwordResetExpires'
    })
    next()
})


//! QUERY MIDDLEWARE: runs after or before .find()
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    next()
})



const Tour = new Mongoose.model('Tour', tourSchema)
export default Tour