import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";


export const createOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body)
        res.status(201).json({
            stats: 'successful',
            data: {
                 doc
            }
        })
    })
}

export const getAll = (Model) => {

    return catchAsync(async (req, res, next) => {
        // To allow for nested GET reviews on tour (hack)
        let filter = {}
        if (req.params.tourId) filter = { tour: req.params.tourId }
        //! execute query
        let doc = await Model.find(filter)
        // const doc = await features.query.explain();
      

        //! send response
        res.json({
            stats: 'successful',
            results: doc.length,
            data: {
                doc
            }
        })
    })
}

export const getOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findById(req.params.id).populate('reviews')

        if (!doc) return next(new AppError(`No document found with this ${req.params.id}`, 404));
        res.json({
            stats: 'successful',
            data: {doc} 
            
        })
    })
}

export const deleteOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id)

        if (!doc) return next(new AppError(`No document found with this ${req.params.id}`, 404));

        res.status(204).json({
            stats: 'successful',
            data: null
        })
    })
}

export const updateOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidation: true
        })
        if (!doc) return next(new AppError(`No document found with this ${req.params.id}`, 404))

        res.json({
            stats: 'successful',
            data: {
                data: doc
            }
        })

    })
}
