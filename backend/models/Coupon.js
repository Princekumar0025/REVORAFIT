const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: {
      type: String,
      enum: ['percentage', 'flat', 'bogo', 'flash', 'freeshipping'],
      required: true,
    },
    value: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    maxUses: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    expiryDate: Date,
    active: { type: Boolean, default: true },
    description: String,
    applicableCategories: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
