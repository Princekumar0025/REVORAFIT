const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Feedback = require('./models/Feedback');

dotenv.config();

const dummyFeedbacks = [
  {
    name: 'Arjun M.',
    rating: 5,
    message: 'The resistance bands are amazing quality! Perfect for my home workouts and physio sessions.',
  },
  {
    name: 'Priya K.',
    rating: 5,
    message: "TENS machine changed my life. My chronic back pain is 70% better after 2 weeks of use!",
  },
  {
    name: 'Rahul S.',
    rating: 5,
    message: 'Premium quality knee brace. Delivery was fast and packaging was excellent. 100% recommend!',
  },
  {
    name: 'Sneha P.',
    rating: 5,
    message: 'The foam roller is exactly what I needed for post-workout recovery. Feels so good!',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    // Only insert if collection is empty
    const count = await Feedback.countDocuments();
    if (count === 0) {
      await Feedback.insertMany(dummyFeedbacks);
      console.log('Dummy feedback inserted successfully!');
    } else {
      console.log('Feedback already exists. Skipping seed.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

seed();
