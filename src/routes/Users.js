import express from 'express';
import {login, signup, logoutAll, logoutOne, saveTrip, startTrip, editTrip, getTrips, getTrip, updateProfile, startExistingTrip} from '../controllers/User.js'
import auth from '../middleware/auth.js'

const router = express.Router();


router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', auth, logoutOne);
router.post('/logoutAll', auth, logoutAll);

///Trip Routes
router.post('/saveTrip', auth, saveTrip);
router.post('/startTrip', auth, startTrip);
router.get('/getTrips', auth, getTrips);
router.get('/getTrip/:tripId', auth, getTrip);
router.post('/startExistingTrip/:tripId', auth, startExistingTrip);
router.patch('/editTrip/:tripId', auth, editTrip);



router.patch('/updateProfile', auth, updateProfile);
export default router;
