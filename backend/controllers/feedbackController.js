const Feedback = require('../models/Feedback');

// @desc    Get all approved feedback
// @route   GET /api/feedback
// @access  Public
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Public
exports.submitFeedback = async (req, res) => {
  try {
    const { name, rating, message } = req.body;
    
    if (!name || !rating || !message) {
      return res.status(400).json({ error: 'Please provide name, rating, and message' });
    }

    const feedback = await Feedback.create({
      name,
      rating,
      message,
      // Default to approved: true based on model
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
