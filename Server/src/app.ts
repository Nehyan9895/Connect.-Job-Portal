import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import recruiterRoutes from './routes/recruiterRoutes';
import { setupSocket } from './helpers/socket';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOption = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOption));

app.use('/admin', adminRoutes);
app.use('/candidate', userRoutes);
app.use('/recruiter', recruiterRoutes);

connectDB();

const PORT = 5001;

const server = http.createServer(app);
setupSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
