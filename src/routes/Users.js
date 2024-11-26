import express from 'express';
import {login, signup, logoutAll} from '../controllers/User.js'
import auth from '../middleware/auth.js'
import User from '../models/User.js';

const router = express.Router();


router.post('/login', login);
router.post('/signup', signup);
router.post('/logoutAll', auth, logoutAll);

export default router;
