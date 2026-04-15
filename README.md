# Pixel Hub

Pixel Hub is a full-stack image platform built with React, Vite, Express, PostgreSQL, Clerk, Cloudinary, and Pollinations. It combines a curated inspiration gallery with a community feed where signed-in users can upload artwork, like posts, comment on uploads, manage their own creator dashboard, and generate AI images from text prompts.

## What the app does

- Browse a curated image library grouped by category
- Search and filter static gallery collections
- Save curated images to a personal favorites list
- Sign in with Clerk
- Upload community images with title, category, and description
- View the latest community posts on the homepage
- Like, unlike, comment on, and download community posts
- Receive real-time notifications when your posts are liked or commented on
- Manage uploaded posts from a creator dashboard
- Generate AI images from text prompts
- Store AI generation history per user

## Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS v4
- Framer Motion
- Clerk
- Axios
- Socket.IO client

### Backend

- Node.js
- Express 5
- PostgreSQL (`pg`)
- Socket.IO (real-time events)
- Cloudinary + Multer
- Pollinations image generation API

## Project structure

```text
pixel-hub/
├── client/   # Vite + React frontend
└── server/   # Express API, DB access, uploads, AI generation
```

## Key product areas

### Curated gallery

The frontend ships with a built-in catalog in `client/src/assets/images.js`. Those images power:

- category browsing
- image detail pages
- search/filter in the gallery
- favorites for curated items

### Community posts

User-uploaded images are stored through the backend and shown in:

- homepage spotlight feed
- full posts page
- user profile/dashboard views

These posts support:

- likes (with optimistic UI updates)
- threaded comments and replies
- downloads (no watermarks)
- edit/delete for the owner
- real-time notifications via Socket.IO

### AI generator

Signed-in users can submit a text prompt to generate an image. The server requests the image from Pollinations, uploads the result to Cloudinary, and stores the prompt/image pair in PostgreSQL as generation history.

## Prerequisites

- Node.js 18+ recommended
- npm
- A PostgreSQL database
- A Clerk application
- A Cloudinary account
- A Pollinations API key

## Environment variables

Create these files locally:

- `client/.env`
- `server/.env`

### `client/.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:8000
```

### `server/.env`

```env
PORT=8000
DATABASE_URL=your_postgres_connection_string
POLLINATIONS_API_KEY=your_pollinations_api_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

## Database setup

On server startup, the app automatically creates these tables if they do not exist:

- `images`
- `image_likes`
- `likes`

Three more tables are required by the codebase but are not currently created in `server/config/initDb.js`:

- `comments`
- `ai_generations`
- `notifications`

Create them manually before using comments or the AI generator:

```sql
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) DEFAULT 'Anonymous',
  user_avatar VARCHAR(255),
  text TEXT NOT NULL,
  parent_id INT REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_generations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255) DEFAULT 'Someone',
  sender_avatar VARCHAR(255),
  type VARCHAR(50) NOT NULL,
  post_id INT REFERENCES images(id) ON DELETE CASCADE,
  post_image VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Installation

Install dependencies separately for the client and server:

```bash
cd client
npm install

cd ../server
npm install
```

## Running locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

## Available scripts

### Client

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Server

```bash
npm run dev
npm start
```

## API overview

### AI

- `POST /api/ai/generate-image`
- `GET /api/ai/history/:userId`
- `DELETE /api/ai/history/:id`

### Uploads and community posts

- `POST /upload/upload-image`
- `GET /upload/fetch-images`
- `POST /upload/toggle-like`
- `GET /upload/user-posts`
- `DELETE /upload/delete-post/:id`
- `PUT /upload/edit-post/:id`
- `GET /upload/user-stats`
- `GET /upload/latest-posts`

### Curated gallery likes

- `GET /api/likes/is-liked`
- `POST /api/likes/like`
- `DELETE /api/likes/unlike`
- `GET /api/likes/like-count`
- `GET /api/likes/liked-images`

### Comments

- `GET /api/comments/:postId`
- `POST /api/comments`
- `DELETE /api/comments/:id`

### Notifications

- `GET /api/notifications/:email` — fetch notifications for a user
- `PATCH /api/notifications/:id/read` — mark a notification as read
- `DELETE /api/notifications/clear/:email` — clear all notifications for a user

## Notes and current caveats

- The root project does not have a single workspace script; client and server are run independently.
- Cloudinary is used for uploaded images and AI-generated images.
- The backend allows CORS from any origin in the current configuration.
- `npm run lint` in the client currently reports existing ESLint issues, so lint is not green yet.
- The app includes an older `client/README.md`, but the main project documentation should live in this root README.

## Main folders

### Frontend

- `client/src/pages` for routed screens
- `client/src/components` for reusable UI
- `client/src/components/users` for community post and profile UI
- `client/src/context` for shared client state
- `client/src/assets/images.js` for curated gallery data

### Backend

- `server/routes` for API route definitions
- `server/controllers` for request handlers
- `server/services` for business logic
- `server/models` for database access
- `server/config` for env, DB, Cloudinary, and startup setup

## Suggested next improvements

- Move creation of `comments`, `ai_generations`, and `notifications` into `server/config/initDb.js`
- Add a root `package.json` with concurrent dev scripts
- Fix current ESLint warnings/errors
- Add tests for upload, likes, comments, notifications, and AI history flows
- Paginate community posts feed for performance at scale
