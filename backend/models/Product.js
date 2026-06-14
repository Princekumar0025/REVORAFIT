const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  images: [String],
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: String,
    category: {
      type: String,
      required: true,
      enum: ['fitness', 'physiotherapy', 'medical'],
    },
    subCategory: String,
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    discountPercent: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    images: [String],
    variants: [
      {
        name: String,
        options: [String],
      },
    ],
    benefits: [String],
    specifications: [{ key: String, value: String }],
    usageInstructions: String,
    tags: [String],
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    weight: String,
    dimensions: String,
    brand: { type: String, default: 'REVORAFIT' },
    sku: String,
  },
  { timestamps: true }
);

productSchema.pre('save', function () {
  if (this.discountPrice && this.price > this.discountPrice) {
    this.discountPercent = Math.round(
      ((this.price - this.discountPrice) / this.price) * 100
    );
  }
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
