const express = require('express');
const {
  getUsers,
  registerUser,
  getUser,
  updateUser
} = require('../controllers/userController');

const router = express.Router();

router.route('/')
  .get(getUsers)
  .post(registerUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser);

module.exports = router;
