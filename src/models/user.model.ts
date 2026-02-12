import mongoose, { Schema } from "mongoose";

export interface IUser {
  slug: string;
  name: string;
  email: string;
  profilePicture: string;
  userType: "normal" | "trader";
  traderType?: "forex" | "crypto" | "stocks";
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    userType: { type: String, required: true, enum: ["normal", "trader"] },
    traderType: { type: String, enum: ["forex", "crypto", "stocks"] },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
