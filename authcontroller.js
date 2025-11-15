// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = process.env.JWT_SECRET || 'dev_secret';
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

async function register(req, res) {
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const exists = await User.findOne({ email });
  if(exists) return res.status(400).json({ error: 'Email already used' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    passwordHash: hash,
    avatarColor: req.body.avatarColor || ''
  });
  await user.save();
  const token = jwt.sign({ id: user._id }, secret, { expiresIn });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatarColor: user.avatarColor } });
}

async function login(req, res) {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if(!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, secret, { expiresIn });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatarColor: user.avatarColor } });
}

module.exports = { register, login };
