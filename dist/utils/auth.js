import { betterAuth } from "better-auth";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
dotenv.config();
const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.DATABASE_URI || "");
    }
    return mongoose.connection;
};
const connection = await connectDB();
const db = connection.getClient().db();
export const auth = betterAuth({
    database: mongodbAdapter(db),
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3030",
    basePath: "/api/v1/auth",
    secret: process.env.BETTER_AUTH_SECRET || "",
    emailAndPassword: {
        enabled: true,
    },
});
