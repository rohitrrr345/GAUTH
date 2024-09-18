import express from 'express';
import {
  register,
  login,
  followUser,
  logout,
  updatePassword,
  updateProfile,
  deleteMyProfile,
  myProfile,
  getUserProfile,
  getAllUsers,
  forgotPassword,
  resetPassword,
  getMyPosts,
  getUserPosts
} from '../controllers/user.js';
import { isAuthenticated } from '../middlewares/auth.js';
import singleUpload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(singleUpload,register);

router.route('/login').post(login);

router.route('/logout').get(logout);

router.route('/follow/:id').get(isAuthenticated, followUser);

router.route('/update/password').put(isAuthenticated, updatePassword);

router.route('/update/profile').put(isAuthenticated, updateProfile);

router.route('/delete/me').delete(isAuthenticated, deleteMyProfile);

router.route('/me').get(isAuthenticated, myProfile);

router.route('/my/posts').get(isAuthenticated, getMyPosts);

router.route('/userposts/:id').get(isAuthenticated, getUserPosts);

router.route('/user/:id').get(isAuthenticated, getUserProfile);

router.route('/users').get(isAuthenticated, getAllUsers);

router.route('/forgot/password').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

export default router;
