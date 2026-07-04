import mongoose from "mongoose";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
});

// Avoid OverwriteModelError
const Variant = mongoose.models.Variant || mongoose.model("Variant", VariantSchema);

const DEFAULT_VARIANTS = [
  "5 kg with Handle",
  "5 kg without Handle",
  "10 kg with Handle",
  "10 kg without Handle",
  "26 kg 2 Side Box",
  "26 kg 1 Side",
  "30 kg 2 Side Box",
  "26 kg Fiber Non-Woven Bags",
  "26 kg 3D Metallic Bags",
  "50 kg Bags"
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to database.");

    for (let i = 0; i < DEFAULT_VARIANTS.length; i++) {
      const name = DEFAULT_VARIANTS[i];
      const existing = await Variant.findOne({ name });
      
      if (!existing) {
        await Variant.create({ name, order: i });
        console.log(`Created variant: ${name}`);
      } else {
        console.log(`Variant already exists: ${name}`);
      }
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding variants:", error);
    process.exit(1);
  }
}

seed();
