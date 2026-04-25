import mongoose from 'mongoose';

const PricingTierSchema = new mongoose.Schema({
  tier: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
}, { _id: false });

const FeatureSchema = new mongoose.Schema({
  icon: String,
  title: { type: String, required: true },
  description: String,
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  role: String,
  rating: { type: Number, min: 1, max: 5, default: 5 },
  text: String,
  date: { type: Date, default: Date.now },
}, { _id: true });

const ProductSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  category: { type: String, default: 'Uncategorized', index: true },
  tags: { type: [String], default: [] },
  image: { type: String, default: '' },
  gallery: { type: [String], default: [] },
  liveDemoUrl: { type: String, default: '', trim: true },
  pricing: { type: [PricingTierSchema], default: [] },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  salesCount: { type: Number, default: 0 },
  version: { type: String, default: '1.0.0' },
  publishDate: { type: String, default: '' },
  supportDuration: { type: String, default: '6 months' },
  features: { type: [FeatureSchema], default: [] },
  techStack: {
    backend: { type: [String], default: [] },
    frontend: { type: [String], default: [] },
    database: { type: [String], default: [] },
    deployment: { type: [String], default: [] },
  },
  reviews: { type: [ReviewSchema], default: [] },
  isPublished: { type: Boolean, default: true },
  isComingSoon: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
