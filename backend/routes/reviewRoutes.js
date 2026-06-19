const express = require('express');
const { getFeedbacks, submitFeedback } = require('../controllers/feedbackController');

const router = express.Router();

router.route('/')
  .get(getFeedbacks)
  .post(submitFeedback);

module.exports = router;
