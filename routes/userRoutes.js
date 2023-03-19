import { Router } from 'express';


import { update, deleteMe, getAllUsers, createUser, getUser, updateUser, deleteUser, getMe, uploadUserPhoto, resizeUserPhoto } from '../controllers/userController.js';
import { signup, login, forgotPassword, resetPassword, auth, updatePassword, restrictTo, logout } from '../controllers/authController.js';
import { celebrate } from "celebrate";
import { validateSignup, validateUpdateMe } from '../validation/userValidation.js';

const router = Router();
//! routes for users 2 
router.post('/signup', validateSignup, signup)
router.post('/login', login)

router.post('/forgot_password', forgotPassword)
router.patch('/reset_password/:token', resetPassword)

// Product all routs with auth
router.use(auth)
router.get('/logout', logout)
router.get('/me', getMe, getUser)
router.patch('/update_password', updatePassword)
router.patch('/update_my_data', uploadUserPhoto, resizeUserPhoto,  update)
router.delete('/delete_me', deleteMe)

router.use(restrictTo('admin'))
router.route('/')
    .get(getAllUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

export default router