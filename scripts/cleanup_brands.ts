import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

async function cleanupBrands() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to DB");

    // Fetch all global variant names
    const Variant = mongoose.models.Variant || mongoose.model("Variant", new mongoose.Schema({
      name: { type: String, required: true, unique: true },
      order: { type: Number, default: 0 },
    }, { timestamps: true }));

    const globalVariants = await Variant.find({}).lean();
    const globalVariantNames = globalVariants.map(v => (v as any).name);

    console.log("Global Variants:", globalVariantNames);

    // Fetch all Brands
    const Brand = mongoose.models.Brand || mongoose.model("Brand", new mongoose.Schema({
      name: { type: String, required: true, unique: true },
      imageUrl: { type: String },
      description: { type: String },
      variants: [new mongoose.Schema({
        name: { type: String, required: true },
        isAvailable: { type: Boolean, default: true },
      })],
    }, { timestamps: true }));

    const brands = await Brand.find({});

    let modifiedCount = 0;

    for (const brand of brands) {
      const originalLength = brand.variants.length;
      // Filter out variants that are not in the global variant names list
      brand.variants = brand.variants.filter((v: any) => globalVariantNames.includes(v.name));
      
      if (brand.variants.length !== originalLength) {
        await brand.save();
        console.log(`Cleaned up brand ${brand.name}: removed ${originalLength - brand.variants.length} missing variants.`);
        modifiedCount++;
      }
    }

    // Just in case, the user specifically mentioned "10kg with handle", "10 kg with handle", etc.
    // The logic above covers anything not in the current global variants, which covers deleted ones.
    
    // Also, what if there's a variant that was misspelled in the DB and we want to remove it explicitly?
    // Let's also do a hard pull for variants with these names in case they bypass something.
    const deletedVariantNames = [
      "10kg with handle",
      "10 kg with handle",
      "10 kg wiht handle",
      "10kg without handle",
      "10 kg without hadnle",
      "10 kg without handle",
      "1o kg with hadle"
    ];
    
    await Brand.updateMany(
      {},
      { $pull: { variants: { name: { $in: deletedVariantNames } } } }
    );

    console.log(`Cleanup complete. Modified ${modifiedCount} brands based on global variants and performed hard pull for deleted variant names.`);
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
}

cleanupBrands();
