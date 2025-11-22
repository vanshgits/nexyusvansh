const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/users/register
async function registerUser(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role
    } = req.body;

    // ✅ username removed from required check
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: 'First name, last name, email and password are required'
      });
    }

    // check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create user (no username now)
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: role || 'user',
      provider: 'local'
    });

    return res.status(201).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ message: 'Server error during registration' });
  }
}

// POST /api/users/login
// login with email + password
async function loginUser(req, res) {
  try {
    // ✅ expect email, not identifier/username
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // find by email only (username removed)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
}

module.exports = {
  registerUser,
  loginUser
};
