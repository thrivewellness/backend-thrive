import express from 'express';
import cors from 'cors';

import contactRoutes from './routes/contact.routes.js';
import userFormRoutes from './routes/userForm.routes.js';
import yogaRoutes from './routes/yoga.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import paymentRoutes from "./routes/payment.js";
import verifyPayment from "./routes/verify.payment.js"
import gupshupRoutes from "./gupshup/gupshup.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(contactRoutes);
app.use(userFormRoutes);
app.use(yogaRoutes);
app.use("/payment", paymentRoutes);
app.use(verifyPayment);
app.use(errorHandler);
app.use("/gupshup", gupshupRoutes);

export default app;
