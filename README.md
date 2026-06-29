# AI Company Full Stack Project

A full-stack promotional website for an AI solutions company.
The project includes a modern frontend, a Node.js/Express backend, SQLite database support, public API routes, and a protected admin dashboard for managing website content.

---

## Project Overview

This project was built as a full-stack web application for an AI company website.
It includes public-facing pages for company information and an admin area where website content can be created, updated, and deleted.

The system supports:

- Promotional company website
- Public services, projects, blog, events, gallery, and testimonials
- Contact inquiry handling
- Admin authentication
- Admin dashboard
- Content management features
- SQLite database backend
- Node.js/Express REST API

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS / modern UI styling

### Backend

- Node.js
- Express.js
- SQLite
- REST API
- JWT-based admin access token

---

## Main Features

### Public Website

The public side of the website includes:

- Services page
- Projects / portfolio section
- Blog articles
- Events
- Gallery
- Customer testimonials
- Contact form

Public pages use public API routes and do not require authentication.

### Admin Dashboard

The admin area includes protected management sections for:

- Dashboard
- Inquiries
- Content
- Services
- Projects
- Analytics

The Content page manages:

- Blog posts
- Events
- Testimonials
- Gallery items

Services and Projects each have full create, edit, and delete functionality.

---

## Backend Setup

Open a terminal and run:

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The backend will run on:

```txt
http://localhost:3000
```

The backend also starts a small local log receiver on:

```txt
http://localhost:4444/logs
```

This prevents the following development error:

```txt
POST http://localhost:4444/logs net::ERR_CONNECTION_REFUSED
```

---

## Frontend Setup

Open a second terminal and run:

```bash
cd client
npm install
npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

---

## Vercel Deployment Settings

Set these environment variables in Vercel before redeploying.

Frontend project:

```txt
VITE_API_BASE_URL=https://ai-solutions-9n7a.vercel.app
```

Backend project:

```txt
CLIENT_ORIGIN=https://ai-solutions-black.vercel.app
CLIENT_ORIGINS=http://localhost:5173,https://ai-solutions-black.vercel.app
```

For the backend Vercel project, set the Root Directory to:

```txt
server
```

The backend root page is available at:

```txt
https://ai-solutions-9n7a.vercel.app/
```

The backend API information endpoint is available at:

```txt
https://ai-solutions-9n7a.vercel.app/api
```

On Vercel, the backend uses a small JSON data store in Vercel's writable runtime folder.
Local development continues to use the SQLite file through the local helper.

---

## Default Admin Login

Use the following default admin account for local testing:

```txt
Email: admin@aisolution.com
Password: Admin12345
```

> This account is intended for development/testing only.
> Change the credentials before using the project in production.

---

## API Access Rules

### Public API Routes

These routes are available without an access token:

```txt
/api/services
/api/projects
/api/blog
/api/events
/api/gallery
/api/testimonials
/api/contact
```

### Admin API Routes

Admin pages use protected routes:

```txt
/api/admin/*
```

These routes require the admin login access token.

---

## Admin Sections

The admin sidebar includes:

```txt
Dashboard
Inquiries
Content
Services
Projects
Analytics
```

The Content section manages:

```txt
Blog
Events
Testimonials
Gallery
```

---

## Project Structure

```txt
AI-Company-Full-Stack/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── database files
│
└── README.md
```

---

## How to Run the Project

Start the backend first:

```bash
cd server
npm install
npm run dev
```

Then start the frontend in a second terminal:

```bash
cd client
npm install
npm run dev
```

After both servers are running, open:

```txt
http://localhost:5173
```

---

## Purpose of the Project

The purpose of this project is to demonstrate a complete full-stack web application with a professional promotional website and a working backend admin system.
It shows frontend development, backend API handling, database usage, authentication, and content management in one complete project.

---

## Status

Project completed with:

- Updated frontend
- Node/Express backend
- SQLite database
- Admin authentication
- Public API routes
- Protected admin routes
- Content management functionality
