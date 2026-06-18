const User = require('../models/User');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'No user found with this email' });
    }

    if (user.blocked) {
      return res.status(403).json({ error: 'Your account has been blocked' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // In Option A, NextAuth just needs the user object back
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Auth via OAuth (Google/Apple)
// @route   POST /api/auth/oauth
// @access  Public
exports.oauthLogin = async (req, res) => {
  try {
    const { email, name, avatar, provider } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required for OAuth login' });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.blocked) {
        return res.status(403).json({ error: 'Your account has been blocked' });
      }
      // If user exists but was created via credentials, we can just log them in
      // Optionally, update the provider or avatar if needed
    } else {
      // Create new user
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        avatar,
        authProvider: provider || 'google',
        role: 'user',
        emailVerified: true
      });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
