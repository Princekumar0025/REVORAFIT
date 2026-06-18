const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { 
      type: String, 
      required: function() { return this.authProvider === 'credentials'; }, 
      minlength: 6 
    },
    authProvider: { type: String, enum: ['credentials', 'google', 'apple'], default: 'credentials' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: String,
    avatar: String,
    addresses: [
      {
        label: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' },
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    blocked: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false; // OAuth users might not have a password
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
