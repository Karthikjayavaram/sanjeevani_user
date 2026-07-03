import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  passwordHash: string;
  email?: string;
  resetPasswordOtp?: string;
  resetPasswordExpires?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    resetPasswordOtp: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
