// src/controllers/postsController.js
const Post = require('../models/Post');
const User = require('../models/User');

async function listPosts(req, res) {
  const q = req.query.q || '';
  const posts = await Post.find(q ? { text: new RegExp(q, 'i') } : {})
    .sort({ createdAt: -1 })
    .populate('user', 'name avatarColor')
    .populate('comments.user', 'name avatarColor')
    .lean();
  res.json(posts);
}

async function createPost(req, res) {
  const user = req.user;
  const text = req.body.text || '';
  const image = req.file ? `/${process.env.UPLOAD_DIR || 'uploads'}/${req.file.filename}` : (req.body.image || null);
  const post = new Post({ user: user._id, text, image });
  await post.save();
  const populated = await post.populate('user', 'name avatarColor').execPopulate();
  res.json(populated);
}

async function getPost(req, res) {
  const post = await Post.findById(req.params.id).populate('user', 'name avatarColor');
  if(!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
}

async function likePost(req, res) {
  const userId = req.user._id;
  const post = await Post.findById(req.params.id);
  if(!post) return res.status(404).json({ error: 'Not found' });
  const idx = post.likedBy.findIndex(i => i.equals(userId));
  if(idx >= 0) {
    post.likedBy.splice(idx, 1);
    post.likesCount = Math.max(0, post.likesCount - 1);
  } else {
    post.likedBy.push(userId);
    post.likesCount = post.likedBy.length;
  }
  await post.save();
  res.json({ likesCount: post.likesCount, likedBy: post.likedBy });
}

async function commentPost(req, res) {
  const user = req.user;
  const text = req.body.text;
  if(!text) return res.status(400).json({ error: 'Missing comment text' });
  const post = await Post.findById(req.params.id);
  if(!post) return res.status(404).json({ error: 'Not found' });
  post.comments.push({ user: user._id, text });
  await post.save();
  res.json({ success: true, comment: post.comments[post.comments.length -1] });
}

async function sharePost(req, res) {
  const user = req.user;
  const src = await Post.findById(req.params.id);
  if(!src) return res.status(404).json({ error: 'Not found' });
  const sharedText = `Shared: "${(src.text || '').slice(0, 280)}"`;
  const post = new Post({ user: user._id, text: sharedText, image: src.image });
  await post.save();
  res.json(post);
}

module.exports = {
  listPosts,
  createPost,
  getPost,
  likePost,
  commentPost,
  sharePost
};
