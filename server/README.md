# AI Company Node + SQLite Backend

## Setup

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Default seeded admin:

```txt
admin@aisolution.com
Admin12345
```

The public routes do not need an access token. Admin routes under `/api/admin/*` require `Authorization: Bearer <accessToken>`.

## Main routes

Public:

- `GET /api/services`
- `GET /api/projects`
- `GET /api/blog`
- `GET /api/blog/:id`
- `GET /api/events`
- `GET /api/gallery`
- `GET /api/testimonials`
- `GET /api/team`
- `GET /api/faqs`
- `POST /api/contact`
- `POST /api/events/:id/register`
- `POST /api/chat`

Admin:

- `GET/POST /api/admin/services`
- `GET/POST /api/admin/projects`
- `GET/POST /api/admin/blog`
- `GET/POST /api/admin/events`
- `GET/POST /api/admin/testimonials`
- `GET/POST /api/admin/gallery`
- `GET/POST /api/admin/team`
- `GET/POST /api/admin/faqs`
- `PUT/DELETE /api/admin/<resource>/:id`
- `GET/POST /api/auth/users` admin only
- `PUT/DELETE /api/auth/users/:id` admin only
- `GET /api/admin/inquiries`
- `PUT /api/admin/inquiries/:id`
- `GET /api/admin/analytics`

When a content table has no SQLite records, the API returns fallback mock data so the public website still has content.
