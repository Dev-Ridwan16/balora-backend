// src/models/bank-account.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBankAccount extends Document {
  userId: mongoose.Types.ObjectId;
  monoAccountId: string; // "6759f3a200000088aa632b9c" - Mono's account ID
  monoCustomerId: string; // "65f82acd00000003aa9028d" - from initiation
  account: {
    name: string; // account holder name
    currency: string; // "NGN"
    type: string; // "SAVINGS" | "CURRENT"
    accountNumber: string; // "0123456789"
  };
  institution: {
    monoId: string; // Mono's institution ID
    name: string; // "GTBank"
    bankCode: string; // "058"
    type: string; // "PERSONAL_BANKING"
  };
  status: "pending" | "linked" | "unlinked";
  createdAt: Date;
  updatedAt: Date;
}

const BankAccountSchema = new Schema(
  {
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
  },
  { timestamps: true },
);

BankAccountSchema.index({ userId: 1 });

const BankAccount = mongoose.model<IBankAccount>(
  "BankAccount",
  BankAccountSchema,
);

export default BankAccount;
