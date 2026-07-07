import mongoose, { Schema, Document } from "mongoose";

export interface IVariant {
  name: string;
  isAvailable: boolean;
}

export interface IBrand extends Document {
  name: string;
  imageUrl?: string;
  originalImageUrl?: string;
  watermarkText?: string;
  watermarkSize?: number;
  watermarkX?: number;
  watermarkY?: number;
  watermarkRotation?: number;
  watermarkOpacity?: number;
  watermarkColor?: string;
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
    name: { type: String, required: true },
    imageUrl: { type: String },
    originalImageUrl: { type: String },
    watermarkText: { type: String, default: "Sanjeevini" },
    watermarkSize: { type: Number, default: 110 },
    watermarkX: { type: Number, default: 50 },
    watermarkY: { type: Number, default: 50 },
    watermarkRotation: { type: Number, default: -65 },
    watermarkOpacity: { type: Number, default: 100 },
    watermarkColor: { type: String, default: "#ffffff" },
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
