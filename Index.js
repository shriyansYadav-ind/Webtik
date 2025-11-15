// src/index.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 4000;

// connect DB
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/webtik').catch(err=>{
  console.error('DB connect error', err);
  process.exit(1);
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

// serve uploads statically
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
app.use(`/${UPLOAD_DIR}`, express.static(path.join(process.cwd(), UPLOAD_DIR)));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

app.get('/', (req, res) => res.json({ ok: true, service: 'Webtik API' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
                            
