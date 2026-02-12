import mongoose, { Schema, Document } from "mongoose";

export interface IMonoRequest extends Document {
  userId: mongoose.Types.ObjectId;
  metaRef: string;
  monoCustomerId: string;
  monoUrl: string;
  scope: string;
  isMulti: boolean;
  status: "initiated" | "successful" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const monoRequestSchema = new Schema<IMonoRequest>(
  {
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
  },
  { timestamps: true },
);

const MonoRequest = mongoose.model<IMonoRequest>(
  "MonoRequest",
  monoRequestSchema,
);

export default MonoRequest;
