import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connection to Database Successful!");
    }catch(error) {
        console.error("Database connection error: ", error);
        process.exit(1);
    }
}


export default connectDB;