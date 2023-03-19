import { celebrate, Joi, Segments } from "celebrate";
import AppError from '../utils/appError.js';


const signUpSchema =
    Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        role: Joi.string().default('user'),
        photo: Joi.string(),
        password: Joi.string()
            .required()
            .min(8),
        passwordConfirm: Joi.ref("password"),
    })

// export const validateSignup = validator(signUpValidation);
export const validateSignup = (req, res, next) => {

    const { error, value } = signUpSchema.validate(req.body);
    if (error) {
        if (error.details[0].path[0] === 'passwordConfirm') {
            return next(new AppError('Password dose not matches with passwordConfirm', 400));
        }
        return next(new AppError(error.details[0].message, 400));
    }
    next()
}


const UpdateMESchema =
    Joi.object().keys({
        name: Joi.string(),
        email: Joi.string().email(),
        photo: Joi.string(),
    })

export const validateUpdateMe = (req, res, next) => {

    const { error, value } = UpdateMESchema.validate(req.body);
    if (error) {

        return next(new AppError(error.details[0].message, 400));
    }
    next()
}
