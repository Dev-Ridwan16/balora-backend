import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    userType: { type: String, required: true, enum: ["normal", "trader"] },
    traderType: { type: String, enum: ["forex", "crypto", "stocks"] },
}, { timestamps: true });
export default mongoose.model("User", userSchema);
