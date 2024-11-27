//we will be using Es6 syntax
import express from 'express';
import connectDB from './db/db.js';
import userRouter from './routes/Users.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use(userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
