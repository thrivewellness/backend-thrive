import express from 'express';
import cors from 'cors';

import contactRoutes from './routes/contact.routes.js';
import userFormRoutes from './routes/userForm.routes.js';
import yogaRoutes from './routes/yoga.routes.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(contactRoutes);
app.use(userFormRoutes);
app.use(yogaRoutes);

app.use(errorHandler);

export default app;
