import Mongoose from 'mongoose'
import Tour from '../models/tourModel.js'

const reviewSchema = new Mongoose.Schema({
    review: {
        type: String,
    },
    ratings: {
        type: Number,
        default: 4.5,
        min: [1, 'the rating of a tour must be between 1 and 5'],
        max: [5, 'the rating of a tour must be between 1 and 5']
    },
    user: {
        type: Mongoose.Schema.ObjectId,
        ref: 'User',
    },
    tour: {
        type: Mongoose.Schema.ObjectId,
        ref: 'Tour',
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next()
})

reviewSchema.statics.calcAverageRating = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$ratings' }
            }
        }
    ])
    // console.log(stats);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].nRating
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 4.5,
            ratingsQuantity: 0
        })
    }
}

// doc middleware
reviewSchema.post('save', function () {
    // this point to current review
    this.constructor.calcAverageRating(this.tour)
})

// query middleware
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.rev = await this.findOne()
    next()
})

reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(): dose not work here, query already executed
    await this.rev.constructor.calcAverageRating(this.rev.tour)

})



const Review = new Mongoose.model('Review', reviewSchema)
export default Review