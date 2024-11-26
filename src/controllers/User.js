import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { name, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ name, password: hashedPassword, email });

        await user.save();

        const token = await user.generateAuthToken();
        res.status(201).json({ message: 'User created successfully',  token});
    } catch (error) {
        // console.log(error);        
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const login = async (req, res) => {
    const { email , password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = await user.generateAuthToken();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

export const logoutAll = async (req, res) => {
    try {
        const user = req.user;
        user.tokens = [];
        await user.save();
        res.send("Logged out from all devs")
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error });
    }
}

export const logoutOne = async (req, res) => {
    try {
        const user = req.user;
        user.tokens = user.tokens.filter((token) => token.token !== req.token);
        await user.save();
        res.send("Logged out this device");
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error });
    }
}

//start ---------> middleware ---------> endpoint