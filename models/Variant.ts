import mongoose, { Schema, Document } from "mongoose";

export interface IVariantModel extends Document {
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariantModel>(
  {
    name: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Variant || mongoose.model<IVariantModel>("Variant", VariantSchema);
