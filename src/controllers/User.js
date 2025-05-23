import User from '../models/User.js';
import Trip from '../models/Trips.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { name, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                message: 'Email already exists'
            });
        }
        const user = new User({ name, password: hashedPassword, email });

        await user.save();

        const token = await user.generateAuthToken();
        res.status(201).json({ message: 'User created successfully',  token});
    } catch (error) {
        console.log(error);   

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

        res.status(200).json({user, token});
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

//get user status of onTrip
export const getUserStatus = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ onTrip: user.onTrip,
            tripId: user.trips[user.trips.length - 1]
         });
    } catch (error) {
        res.status(500).json({ message: 'Error getting user status', error });
    }
}

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


export const updateProfile = async (req, res) => {
    const { name, email, oldPassword, newPassword } = req.body;
    try {
        const user = req.user;
        if(name !== ''){
            user.name = name;
        }
        if (email !== ''){
            user.email = email;
        }
        if(newPassword === '' || oldPassword === ''){
            return res.status(400).json({ message: 'New password and old password are required' });
        }
        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid old password' });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
}

//start ---------> middleware ---------> endpoint


//OffTrip Post requests
export const saveTrip = async (req, res) => {
    try {
    const { tripLocation, estimatedBudget, tripBudget, tripStartDate, tripAttractions } = req.body;
    const tempTrip = await Trip.findOne({tripLocation, tripStartDate});
    if(tempTrip){
        tempTrip.tripAttractions = tripAttractions;
        tempTrip.estimatedBudget = estimatedBudget;
        tempTrip.tripBudget = tripBudget;
        tempTrip.tripAttractions = tripAttractions;
        await tempTrip.save();
        return res.status(200).json(tempTrip);
    }
    const userId = req.user._id;
    const newTrip = new Trip({
        userId,
        tripLocation,
        tripStartDate,
        estimatedBudget,
        tripBudget,
        tripAttractions,
        completedActivities: [],
    });
        await newTrip.save();
        const user = req.user;
        user.trips.push(newTrip._id);
        await user.save();
        res.status(201).json(newTrip);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating trip', error });
    }
}

export const startTrip = async (req, res) => {
    try {
    const { tripLocation, tripBudget, tripAttractions } = req.body;
    const userId = req.user._id;
    const newTrip = new Trip({
        userId,
        tripLocation,
        tripStartDate: new Date().toISOString().split("T")[0],
        tripBudget,
        estimatedBudget: 0,
        tripAttractions,
        tripStarted: true,
        completedActivities: [],
    });
        await newTrip.save();
        const user = req.user;
        user.onTrip = true;
        user.trips.push(newTrip._id);
        await user.save();
        res.status(201).json(newTrip);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating trip', error });
    }
}

export const startExistingTrip = async (req, res) => {
    try {
    const { tripId } = req.params;
    const userId = req.user._id;
    const user = req.user;
    const trip = await Trip.findById(tripId);
    if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
    }
    console.log(userId);
    console.log(trip.userId);
    if (trip.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    trip.tripStarted = true;
    user.onTrip = true;
    await trip.save();
    await user.save();
    res.status(200).json(trip);
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error starting trip', error });
    }
}

export const getTrip = async (req, res) => {
    try {
    const { tripId } = req.params;
    const userId = req.user._id;
    const trip = await Trip.findById(tripId);
    if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
    }
    if (trip.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    res.status(200).json(trip);
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching trip', error });
    }
}

//-------------getTrips Controller------------//
export const getTrips = async (req, res) =>{
    try{
        const userId = req.user._id;
        const trips = await Trip.find({ userId });
        // res.status(200).json(trips);
        // console.log(trips);
        const completed = trips.filter((trip)=>{
            return trip.tripComplete === true && trip.tripStarted === false
        })
        const saved = trips.filter((trip)=>{
            return trip.tripStarted === false && trip.tripComplete === false
        })
        const response ={completed, saved};
        res.status(200).json(response);

    }catch(e){
        res.status(500).json({ message: 'Error fetching trips', error: e });
    }
}

export const editTrip = async (req, res) => {
    try {
    const { tripId } = req.params;
    const { tripComplete, tripCompletedDate, tripBudget, tripAttractions, completedActivities } = req.body;
    const userId = req.user._id;
    const trip = await Trip.findById(tripId);
    if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
    }
    if (trip.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    trip.tripComplete = tripComplete || trip.tripComplete;
    trip.tripCompletedDate = tripCompletedDate || trip.tripCompletedDate;
    trip.tripBudget = tripBudget || trip.tripBudget;
    trip.tripAttractions = tripAttractions || trip.tripAttractions;
    trip.completedActivities = completedActivities || trip.completedActivities;
    await trip.save();
    res.status(200).json(trip);
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error editing trip', error });
    }
}


//end Trip
export const endTrip = async (req, res) => {
    try {
    const { tripId } = req.params;
    const userId = req.user._id;
    const trip = await Trip.findById(tripId);
    if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
    }
    if (trip.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    trip.tripComplete = true;
    trip.tripCompletedDate = new Date().toISOString().split("T")[0];
    trip.tripStarted = false;
    await trip.save();
    const user = req.user;
    user.onTrip = false;
    await user.save();
    res.status(200).json(trip);
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error ending trip', error });
    }
}

export const deleteTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const userId = req.user._id;
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        if (trip.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await Trip.findByIdAndDelete(tripId);
        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting trip', error });
    }
}