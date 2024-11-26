//we will be using Es6 syntax
import express, { application } from 'express';
import connectDB from './db/db.js';
import userRouter from './routes/Users.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(express.json());

app.use(userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
