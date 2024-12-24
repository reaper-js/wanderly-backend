import express from 'express';
import {login, signup, logoutAll, logoutOne, saveTrip, startTrip, editTrip, endTrip, getTrips, getTrip, updateProfile, startExistingTrip, getUserStatus, deleteTrip} from '../controllers/User.js'
import auth from '../middleware/auth.js'
import { authLimiter, generalLimiter } from '../middleware/rateLimiter.js'

const router = express.Router();


router.post('/login', authLimiter, login);
router.post('/signup', authLimiter, signup);
router.post('/logout', generalLimiter, auth, logoutOne);
router.post('/logoutAll', generalLimiter, auth, logoutAll);
router.patch('/updateProfile', generalLimiter, auth, updateProfile);

router.get('/userGetTripStatus', generalLimiter, auth, getUserStatus)

router.post('/saveTrip', generalLimiter, auth, saveTrip);
router.post('/startTrip', generalLimiter, auth, startTrip);
router.get('/getTrips', generalLimiter, auth, getTrips);
router.get('/getTrip/:tripId', generalLimiter, auth, getTrip);
router.post('/startExistingTrip/:tripId', generalLimiter, auth, startExistingTrip);
router.patch('/editTrip/:tripId', generalLimiter, auth, editTrip);
router.post('/endTrip/:tripId', generalLimiter, auth, endTrip);
router.delete('/deleteTrip/:tripId', generalLimiter, auth, deleteTrip);



export default router;