import mongoose, { Schema, Document } from "mongoose";

export enum Status {
  INITIATED = "initiated",
  SUCCESSFUL = "successful",
  FAILED = "failed",
}

export interface IMonoRequestCredentials {
        name: string
        email: string
        institution: {
                id: string,
                auth_method: string
        }
}

export interface IMonoRequest extends Document {
  userId: mongoose.Types.ObjectId;
  metaRef: string;
  monoCustomerId: string;
  monoUrl: string;
  scope: string;
  isMulti: boolean;
  status: Status;
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
      enum: Object.values(Status),
      default: Status.INITIATED,
    },
  },
  { timestamps: true },
);

const MonoRequest = mongoose.model<IMonoRequest>(
  "MonoRequest",
  monoRequestSchema,
);

export default MonoRequest;
