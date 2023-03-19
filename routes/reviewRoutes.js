import { Router } from 'express';

const router = Router({ mergeParams: true });
import { getAllReviews, createReview, deleteReview, updateReview, addTourUserIds, getReview } from '../controllers/reviewController.js';
import { auth, restrictTo } from '../controllers/authController.js';
import { validateReview } from '../validation/reviewValidation.js';
router.use(auth)
router.route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), validateReview, addTourUserIds, createReview)


router.route('/:id')
    .get(getReview)
    .patch(restrictTo('user', 'admin'), updateReview)
    .delete(restrictTo('user', 'admin'), deleteReview)


export default router;