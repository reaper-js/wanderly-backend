import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tripLocation: {
        type: String,
        trim: true,
        required: true
    },
    tripStartDate: {
        type: Date,
        required: true
    },
    tripEndDate: {
        type: Date,
    },
    tripStarted: {
        type: Boolean,
        default: false
    },
    tripComplete:{
        type: Boolean,
        default: false
    },
    tripBudget: {
        type: Number,
        required: true
    },
    tripAttractions: {
        type: [{
            name: {
                type: String,
                trim: true,
                required: true
            },
            photoUrl: {
                type: String,
                trim: true,
                required: true
            }
        }],
        default: []
    }},
    {
        timestamps: true
    }
);

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;

