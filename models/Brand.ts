import mongoose, { Schema, Document } from "mongoose";

export interface IVariant {
  name: string;
  isAvailable: boolean;
}

export interface IBrand extends Document {
  name: string;
  imageUrl?: string;
  description: string;
  variants: IVariant[];
  totalStock: number;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>({
  name: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
});

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    description: { type: String },
    variants: [VariantSchema],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Virtual for calculating total stock across all variants (count of available variants)
BrandSchema.virtual('totalStock').get(function(this: IBrand) {
  return this.variants.filter(variant => variant.isAvailable).length;
});

// Ensure virtuals are included in toJSON/toObject
BrandSchema.set('toJSON', { virtuals: true });
BrandSchema.set('toObject', { virtuals: true });

export default mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);
