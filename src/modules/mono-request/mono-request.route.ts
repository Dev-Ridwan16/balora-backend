import express from "express";
import { MonoRequestController } from "./mono-request.controller.js";
import { requireAuth } from "../../infrastructure/middleware/requireAuth.js";

const router = express.Router();
const monoRequestController = new MonoRequestController();

router.post("/link", requireAuth, monoRequestController.linkBankAccount);

export default router;
