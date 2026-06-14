const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: { type: String, required: true },
    link: String,
    buttonText: String,
    position: { type: String, enum: ['hero', 'promo', 'category'], default: 'hero' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
