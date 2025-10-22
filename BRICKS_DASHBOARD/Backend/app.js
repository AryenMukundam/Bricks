import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();
import connectToDB from './db/db.js';
import studentRoutes from './routes/student.route.js'
import instructorRoutes from './routes/instructor.route.js'
import cookieParser from 'cookie-parser';

connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/' , (req , res) =>{
    res.send('Testing')
})

app.use('/students' , studentRoutes);
app.use('/instructors' , instructorRoutes);

export default app;