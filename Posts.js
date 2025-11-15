// src/routes/posts.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/postsController');

router.get('/', ctrl.listPosts);
router.get('/:id', ctrl.getPost);

// protected
router.post('/', auth, upload.single('image'), ctrl.createPost);
router.post('/:id/like', auth, ctrl.likePost);
router.post('/:id/comment', auth, ctrl.commentPost);
router.post('/:id/share', auth, ctrl.sharePost);

module.exports = router;
