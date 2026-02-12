import mongoose, { Schema, Document } from "mongoose";
const monoRequestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    metaRef: {
        type: String,
        required: true,
        unique: true,
    },
    monoCustomerId: {
        type: String, // customer field from Mono response
    },
    monoUrl: {
        type: String,
    },
    scope: {
        type: String,
    },
    isMulti: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["initiated", "successful", "failed"],
        default: "initiated",
    },
}, { timestamps: true });
const MonoRequest = mongoose.model("MonoRequest", monoRequestSchema);
export default MonoRequest;
