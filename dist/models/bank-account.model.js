// src/models/bank-account.model.ts
import mongoose, { Schema, Document } from "mongoose";
const BankAccountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    monoAccountId: {
        type: String,
        required: true,
        unique: true, // one document per linked account
    },
    monoCustomerId: {
        type: String,
        required: true,
    },
    account: {
        name: { type: String, required: true },
        currency: { type: String, default: "NGN" },
        type: { type: String }, // SAVINGS | CURRENT
        accountNumber: { type: String, required: true },
        balance: { type: Number, default: 0 },
        bvn: { type: String },
    },
    institution: {
        monoId: { type: String, required: true },
        name: { type: String, required: true },
        bankCode: { type: String },
        type: { type: String },
    },
    status: {
        type: String,
        enum: ["pending", "linked", "unlinked"],
        default: "pending",
    },
}, { timestamps: true });
BankAccountSchema.index({ userId: 1 });
const BankAccount = mongoose.model("BankAccount", BankAccountSchema);
export default BankAccount;
