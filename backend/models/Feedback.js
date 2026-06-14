const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    message: {
      type: String,
      required: [true, 'Please add a feedback message'],
      maxlength: [500, 'Message cannot be more than 500 characters']
    },
    approved: {
      type: Boolean,
      default: true // Automatically approved by default
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
