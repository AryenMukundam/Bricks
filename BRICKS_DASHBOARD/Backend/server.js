import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDB from './db/db.js';
import studentRoutes from './routes/student.route.js';
import instructorRoutes from './routes/instructor.route.js';
import classRoutes from './routes/class.route.js';
import assignmentRoutes from './routes/assignment.route.js';

const app = express();
const port = process.env.PORT || 3000;

connectToDB();

app.use(cors({
  origin: "https://bricks.org.in",
  credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Testing');
});

app.use('/students', studentRoutes);
app.use('/instructors', instructorRoutes);
app.use('/classes', classRoutes);
app.use('/assignments', assignmentRoutes);

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
