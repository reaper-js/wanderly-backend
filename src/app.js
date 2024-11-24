//we will be using Es6 syntax
import express from 'express';
import connectDB from './db/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
