import { Router } from 'express';

import { getAllTours, createTour, getTour, updateTour, deleteTour, uploadTourImages, resizeTourImages } from '../controllers/tourController.js';
import { auth, restrictTo } from '../controllers/authController.js';
import reviewRouter from '../routes/reviewRoutes.js'
import { validateTour } from '../validation/tourValidation.js';

const router = Router();

router.use('/:tourId/reviews', reviewRouter)

router.route('/')
    .get(getAllTours)
    .post(auth, restrictTo('admin', 'lead-guide'), validateTour, uploadTourImages, resizeTourImages, createTour)

router.route('/:id')
    .get(getTour)
    .patch(auth, restrictTo('admin', 'lead-guide'),validateTour, uploadTourImages, resizeTourImages, updateTour)
    .delete(auth, restrictTo('admin', 'lead-guide'), deleteTour)


export default router