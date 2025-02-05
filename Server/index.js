import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from "./routes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());


app.use("/api", authRoutes); // This will prefix all routes with "/api"

app.listen(8000, () => {
    console.log("Server running on port 8000");
});


