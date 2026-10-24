import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoute.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;