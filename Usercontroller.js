// src/controllers/usersController.js
const User = require('../models/User');

async function listUsers(req, res) {
  const users = await User.find().select('name email avatarColor createdAt').lean();
  res.json(users);
}

module.exports = { listUsers };
