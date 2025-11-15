// src/routes/users.js
const express = require('express');
const router = express.Router();
const { listUsers } = require('../controllers/usersController');

router.get('/', listUsers);

module.exports = router;
