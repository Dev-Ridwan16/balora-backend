import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },
    userType: { type: String, required: true, enum: ["normal", "trader"] },
    traderType: { type: String, enum: ["forex", "crypto", "stocks"] },
}, { timestamps: true });
export default mongoose.model("User", userSchema);
