const express = require('express');
const { loginUser, oauthLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/oauth', oauthLogin);

module.exports = router;
