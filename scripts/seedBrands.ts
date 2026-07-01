import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
  isAvailable: { type: Boolean, default: true },
});

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    description: { type: String },
    variants: [VariantSchema],
  },
  { timestamps: true }
);

const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);

const prefixes = ["Premium", "Royal", "Golden", "Classic", "Supreme", "Organic", "Pure", "Heritage", "Imperial", "Elite"];
const basenames = ["Basmati", "Sona Masoori", "Jasmine", "Arborio", "Ponni", "Idli", "Kolam", "Wada Kolam", "Brown", "Matta"];
const suffixes = ["Select", "Gold", "Reserve", "Harvest", "Choice", "Valley", "Farms", "Blend", "Grain", "Delight"];

function generateFakeBrands(count: number) {
  const brands = [];
  for (let i = 0; i < count; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const basename = basenames[Math.floor(Math.random() * basenames.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = `${prefix} ${basename} ${suffix} ${i}`; // Append i to ensure uniqueness

    const hasImage = Math.random() > 0.3;
    const imageUrl = hasImage ? `https://placehold.co/400x400/111111/d4af37?text=${encodeURIComponent(basename)}` : "";
    
    const variantsCount = Math.floor(Math.random() * 4) + 1;
    const variants = [];
    const variantNames = ["5kg Box", "10kg Bag", "25kg Bag", "30kg Gunny", "50kg Sack", "1kg Pouch"];
    
    for (let v = 0; v < variantsCount; v++) {
      variants.push({
        name: variantNames[Math.floor(Math.random() * variantNames.length)],
        stockQuantity: Math.floor(Math.random() * 500),
        isAvailable: true
      });
    }

    brands.push({
      name,
      imageUrl,
      description: `Experience the finest ${basename} rice. Carefully aged and processed for the perfect texture and aroma. Ideal for special occasions and daily meals.`,
      variants
    });
  }
  return brands;
}

async function seedBrands() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');
    
    // Optional: await Brand.deleteMany({}); // Keep existing ones? Yes, keep them.

    const fakeBrands = generateFakeBrands(40);
    
    let added = 0;
    for (const brandData of fakeBrands) {
      const existing = await Brand.findOne({ name: brandData.name });
      if (existing) {
        continue;
      }
      await Brand.create(brandData);
      added++;
    }

    console.log(`Seeding completed. Added ${added} dummy brands.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding brands:', error);
    process.exit(1);
  }
}

seedBrands();
