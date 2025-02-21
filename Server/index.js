import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from "./Routes/AuthRoute.js";
import ProfileRoutes from './Routes/ProfileRoute.js'
import infoRoutes from './Routes/InfoRoute.js'





const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());




app.use("/api", authRoutes);
app.use("/api", ProfileRoutes);
app.use("/api", infoRoutes);




app.listen(8000, () => {
    console.log("Server running on port 8000");
});


