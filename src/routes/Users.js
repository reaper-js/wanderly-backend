import express from 'express';
import {login, signup, logoutAll, logoutOne} from '../controllers/User.js'
import auth from '../middleware/auth.js'

const router = express.Router();


router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', auth, logoutOne);
router.post('/logoutAll', auth, logoutAll);

export default router;
