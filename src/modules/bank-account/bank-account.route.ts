import express from "express";
import { BankAccountController } from "./bank-account.controller.js";

const router = express.Router();
const bankAccountController = new BankAccountController();

router.post("/webhook", bankAccountController.monoWebhook);

export default router;
