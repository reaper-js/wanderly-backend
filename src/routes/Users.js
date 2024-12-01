import express from 'express';
import {login, signup, logoutAll, logoutOne, saveTrip, startTrip} from '../controllers/User.js'
import auth from '../middleware/auth.js'

const router = express.Router();


router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', auth, logoutOne);
router.post('/logoutAll', auth, logoutAll);
router.post('/saveTrip', auth, saveTrip);
router.post('/startTrip', auth, startTrip);

export default router;
