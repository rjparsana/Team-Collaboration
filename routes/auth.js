
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined');
  process.exit(1); 
}


// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user!' });
  }
});

// Login and generate JWT token

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET, // Ensure this key is properly accessed
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed!' });
  }
});



module.exports = router;
