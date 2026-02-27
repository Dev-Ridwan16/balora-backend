import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import type { Express } from "express";
import connectDB from "./database/db.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./shared/utils/auth.js";

import bankAccountRoutes from "./modules/bank-account/bank-account.route.js";
import monoRequestRoutes from "./modules/mono-request/mono-request.route.js";

dotenv.config();
connectDB();

const app = express() as Express;
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

app.all("/api/v1/auth/*path", toNodeHandler(auth));
app.use("/api/v1/mono-request", monoRequestRoutes);
app.use("/api/v1/bank-account", bankAccountRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
