import express from "express";
import { verifyBankAccount } from "../controller/bank-account.controller.js";

const router = express.Router();
router.post("/webhook/mono", verifyBankAccount);

export default router;
