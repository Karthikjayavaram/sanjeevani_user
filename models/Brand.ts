import mongoose, { Schema, Document } from "mongoose";

export interface IVariant {
  name: string;
  stockQuantity: number;
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
  stockQuantity: { type: Number, required: true, default: 0 },
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

// Virtual for calculating total stock across all variants
BrandSchema.virtual('totalStock').get(function(this: IBrand) {
  return this.variants.reduce((total, variant) => total + variant.stockQuantity, 0);
});

// Ensure virtuals are included in toJSON/toObject
BrandSchema.set('toJSON', { virtuals: true });
BrandSchema.set('toObject', { virtuals: true });

export default mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);
