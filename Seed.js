// src/seed.js
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcrypt');

async function run() {
  await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/webtik');
  await User.deleteMany({});
  await Post.deleteMany({});

  const demoPass = 'demo';
  const hash = await bcrypt.hash(demoPass, 10);

  const user = new User({
    name: 'You (Webtik)',
    email: 'you@webtik.demo',
    passwordHash: hash,
    avatarColor: 'linear-gradient(135deg,#e2e8f0,#c7d2fe)'
  });
  await user.save();

  const p1 = new Post({ user: user._id, text: 'Welcome to Webtik — this is a demo post!' });
  const p2 = new Post({ user: user._id, text: 'Sunset run today — felt great.' });
  await p1.save(); await p2.save();

  console.log('Seed complete. Demo credentials: email=you@webtik.demo password=demo');
  process.exit(0);
}

run().catch(err=>{ console.error(err); process.exit(1); });
