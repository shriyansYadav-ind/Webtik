# Webtik Backend (Node.js + Express + MongoDB)

## Requirements
- Node.js (16+)
- MongoDB (local or remote)

## Setup
1. Clone / copy files
2. `npm install`
3. Create `.env` from `.env.example` and adjust values.
4. Start MongoDB (e.g. `mongod` locally)
5. Seed demo data: `npm run seed`
6. Start server: `npm start` (or `npm run dev`)

Server runs at http://localhost:4000

## Example endpoints
- POST /api/auth/register { name, email, password }
- POST /api/auth/login { email, password } -> returns { token, user }
- GET  /api/posts            -> list posts
- POST /api/posts (auth)     -> create post (multipart/form-data with `image` file or JSON with `image` as URL)
- POST /api/posts/:id/like (auth)
- POST /api/posts/:id/comment (auth) { text }
- POST /api/posts/:id/share (auth)
- GET  /api/users

