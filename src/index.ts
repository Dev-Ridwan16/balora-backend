import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import type { Express } from "express";
import connectDB from "./database/db.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
import { requireAuth } from "./middleware/requireAuth.js";
import bankAccountRoutes from "./routes/bank-account.route.js";
import monoWebhookRoutes from "./routes/mono-webhook.route.js";

dotenv.config();
connectDB();

const app = express() as Express;
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

app.all("/api/v1/auth/*path", toNodeHandler(auth));
app.use('/api/v1/bank-account', requireAuth, bankAccountRoutes)
app.use('/api/v1', monoWebhookRoutes)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
