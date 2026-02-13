import express from "express";
import { linkBankAccount, verifyBankAccount, } from "../controller/bank-account.controller.js";
const router = express.Router();
router.post("/link", linkBankAccount);
// router.post("/webhook/mono", verifyBankAccount);
export default router;
