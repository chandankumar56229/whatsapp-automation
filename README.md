# Multi4You Store

Premium software marketplace — React storefront + Express API + Admin Panel for managing products.

## Stack
- **client/** — Vite + React 18 + React Router 6 + Tailwind CSS (admin) + legacy design system (storefront)
- **server/** — Node + Express 4 + MongoDB (Mongoose) + JWT auth + Multer image upload
- **legacy/** — original static HTML site (kept for reference / visual parity)

## Project structure

```
Multi4You-Store/
├── client/        # React storefront + admin panel
├── server/        # Express REST API
├── legacy/        # original static HTML files (read-only, archived)
└── package.json   # root scripts (concurrently runs client + server)
```

## Prerequisites
- Node 18+
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or any URI you set in `server/.env`)

## Setup

```bash
# 1. Install everything (root, client, server)
npm install
npm run install:all

# 2. Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env
# edit server/.env and set JWT_SECRET + admin credentials

# 3. Seed the database (creates admin user + WhatsCamp product)
npm run seed

# 4. Start both client (5173) and server (5000) together
npm run dev
```

Open:
- Storefront: http://localhost:5173
- Admin panel: http://localhost:5173/admin/login (use `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env`)

## Public routes
| Path | Description |
| --- | --- |
| `/` | Home (hero, featured product, features, categories, testimonials) |
| `/store` | Store with search/filter/sort |
| `/product/:slug` | Product detail page |
| `/about` | About |
| `/contact` | Contact form (saves to DB) |

## Admin routes (JWT-protected)
| Path | Description |
| --- | --- |
| `/admin/login` | Admin login |
| `/admin` | Dashboard (counts + recent activity) |
| `/admin/products` | Product list (search, edit, delete) |
| `/admin/products/new` | Create product |
| `/admin/products/:id` | Edit product |
| `/admin/messages` | Inbox of contact-form submissions |

## API endpoints

Public:
- `GET  /api/products` — list (`?search=`, `?category=`, `?sort=`)
- `GET  /api/products/:slug` — detail
- `POST /api/contact` — submit contact form

Admin (JWT required):
- `POST /api/auth/login`
- `GET  /api/auth/me`
- `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- `POST /api/upload` (multipart `file`) — returns `{ url }`
- `GET  /api/contact`, `PATCH /api/contact/:id/read`, `DELETE /api/contact/:id`

## Image uploads
Images are uploaded directly to **Cloudinary** from the admin panel. The server streams the file via a small custom multer storage engine ([server/src/middleware/upload.js](server/src/middleware/upload.js)) — no local disk involved.

Setup:
1. Create a free Cloudinary account → Dashboard → Account Details.
2. Copy `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` into `server/.env`.
3. Optional: set `CLOUDINARY_FOLDER` (default `multi4you`) — all uploads go into this folder.

Uploads automatically apply `quality: auto` + `fetch_format: auto` so Cloudinary serves the optimal format (AVIF/WebP) per browser. The DB stores the full `secure_url`; client renders it directly.

Limits: 8 MB per file, only `png/jpg/jpeg/webp/gif/svg`. Gallery upload max 10 files at once.

## Build for production

```bash
npm run build           # builds client → client/dist
npm start               # runs server only (you serve client/dist with nginx, or add static-serve middleware)
```
