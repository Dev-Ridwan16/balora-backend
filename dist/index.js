import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT || 3030;
app.use(cors());
app.all("/api/v1/auth/*path", toNodeHandler(auth));
app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
