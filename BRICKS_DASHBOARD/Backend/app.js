import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();
import connectToDB from './db/db.js';
import studentRoutes from './routes/student.route.js'
import instructorRoutes from './routes/instructor.route.js'
import classRoutes from './routes/class.route.js'
import cookieParser from 'cookie-parser';
import assignmentRoutes from './routes/assignment.route.js'

connectToDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, 
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/' , (req , res) =>{
    res.send('Testing')
})

app.use('/students' , studentRoutes);
app.use('/instructors' , instructorRoutes);
app.use('/classes' , classRoutes);
app.use('/assignments' , assignmentRoutes);

export default app;