import { Router } from 'express';
import { bookingCheckout, myBooking, getAllBookings, getBooking, updateBooking, deleteBooking, checkTour } from '../controllers/bookingController.js'
import { auth, restrictTo } from '../controllers/authController.js';

const router = Router();

router.use(auth);
router.post('/checkout', checkTour, bookingCheckout)

router.get('/my', myBooking)

router.use(restrictTo('admin', 'lead-guide'));
router
    .route('/')
    .get(getAllBookings)

router
    .route('/:id')
    .get(getBooking)
    .patch(updateBooking)
    .delete(deleteBooking);


export default router