//we will be using Es6 syntax
import express from 'express';
import connectDB from './db/db.js';
import userRouter from './routes/Users.js';
import generalRouter from './routes/General.js';
import flightRouter from './routes/Flights.js';
import cors from 'cors';

const app = express();
// const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

app.use(userRouter);
app.use(generalRouter);
app.use(flightRouter);


// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

export default app; 
