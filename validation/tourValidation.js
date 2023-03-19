import { celebrate, Joi, Segments } from "celebrate";
import AppError from '../utils/appError.js';


const tourSchema =
    Joi.object().keys({
        name: Joi.string().required().max(40).min(10),
        slug: Joi.string(),
        duration: Joi.number().required(),
        maxGroupSize: Joi.number().required(),
        difficulty: Joi.string().required(),
        ratingsAverage: Joi.number().min(1).max(5),
        ratingsQuantity: Joi.number(),
        price: Joi.number().required(),
        priceDiscount: Joi.number(),
        summary: Joi.string().required(),
        description: Joi.string(),
        imageCover: Joi.string().required(),
        images: Joi.array(),
        createdAt: Joi.date().default(Date.now()),
        startDates: Joi.array(),
        secretTour: Joi.boolean(),
        startLocation: Joi.object({
            type: Joi.string().default('Point'),
            coordinates: Joi.array(),
            address: Joi.string(),
            description: Joi.string(),
        }),
        locations: Joi.array(),
        guides: Joi.array(),

    })

// export const validateSignup = validator(signUpValidation);
export const validateTour = (req, res, next) => {

    const { error, value } = tourSchema.validate(req.body);
    if (error) {
      
        return next(new AppError(error.details[0].message, 400));
    }
    next()
}