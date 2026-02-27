import mongoose, { Document, Schema } from "mongoose";

export enum UserType {
  NORMAL = "normal",
  TRADER = "trader",
}

export enum TraderType {
  FOREX = "forex",
  CRYPTO = "crypto",
  STOCKS = "stocks",
}

export interface IUser extends Document {
  slug: string;
  name: string;
  email: string;
  profilePicture: string;
  userType: string;
  traderType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    profilePicture: { type: String },
    userType: {
      type: String,
      required: true,
      enum: Object.values(UserType),
      default: UserType.NORMAL,
    },
    traderType: {
      type: String,
      enum: Object.values(TraderType),
      default: TraderType.FOREX,
    },
  },
  { timestamps: true },
);

userSchema.index({ role: 1 });

export const UserModel = mongoose.model<IUser>("User", userSchema);
