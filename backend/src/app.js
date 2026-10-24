import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import taskRoutes from './routes/taskRoute.js';
import swaggerSpec from './docs/swagger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Task Management API Docs',
    swaggerOptions: { docExpansion: 'list', displayRequestDuration: true },
  }),
);
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;