import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db_uri = process.env.DATABASE_URI || "";

if (!db_uri) {
  console.error("DATABASE_URI is not defined in the environment variables.");
  process.exit(1);
}

export default async function connectDB() {
  try {
    await mongoose.connect(db_uri);
    console.log("Connected to the database successfully.");
  } catch (error: any) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  } finally {
    mongoose.connection.on("disconnected", () => {
      console.warn("Database connection lost. Attempting to reconnect...");
      connectDB();
    });
  }
}