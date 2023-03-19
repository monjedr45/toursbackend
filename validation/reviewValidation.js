import { celebrate, Joi, Segments } from "celebrate";
import AppError from '../utils/appError.js';

const reviewSchema =
    Joi.object().keys({
        review: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
        tour: Joi.string().required(),
    })

export const validateReview = (req, res, next) => {
    const { error, value } = reviewSchema.validate(req.body);
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }
    next()
}