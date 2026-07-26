# NGO Portal — Backend (Node.js / Express)

This is a line-for-line logic port of the Java Spring Boot backend, using the exact same
endpoints, validation rules, business logic, and quirks (including the ones that were
manually tweaked in the Java version, like the 7-day verification token expiry and the
backend-redirect email verification flow). It's meant as a drop-in replacement — the
React frontend needs zero changes to work with this instead of the Java backend.

## Setup
1. Node.js 18+ installed.
2. `npm install`
3. Copy `.env.example` to `.env` and fill in the same values you used for the Java version:
   - `MONGODB_URI`, `JWT_SECRET`, `MAIL_USERNAME`, `MAIL_APP_PASSWORD`, `FRONTEND_URL`, `PORT`,
     `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (only needed on first run)
4. `npm run dev` (auto-restarts on change) or `npm start`
5. API runs on `http://localhost:8080` (or whatever `PORT` is set to) — same base URL your
   frontend's `REACT_APP_API_URL` already expects.

## Structure
```
src/
├── server.js            entry point: connects DB, seeds admin, starts Express
├── app.js                Express app wiring (CORS, JSON body parsing, routes, error handler)
├── config/                db.js (Mongoose connection), corsConfig.js
├── models/                Mongoose schemas: User, Blog, Comment, Notification
├── middleware/             auth.js (JWT check + role guards), errorHandler.js, validateRequest.js
├── validators/             express-validator rules per endpoint (mirrors the Java @Valid DTOs)
├── services/               business logic -- one file per Java service class
├── controllers/            route handlers -- one file per Java controller
├── routes/                 Express routers, wired with the exact same access rules as SecurityConfig
└── seed/adminSeeder.js      creates the first admin account on startup
```

## What's identical to the Java version
- Every endpoint, HTTP method, and path
- JWT auth: same claims (`sub` = email, `role` = role), same 24h default expiry
- Role-based access exactly matching `SecurityConfig` (comment routes checked before
  the generic blog CRUD rules, so students can post comments but not create/edit/delete blogs)
- Verification token: 7-day expiry (kept as-is even though the email text still says "24 hours")
- Password reset token: 1-hour expiry
- Same email subject lines and body text for all 4 email types
- Same JSON response shapes (Mongo's `_id` is remapped to `id`, matching how Spring/Jackson
  serializes the Java `@Id private String id` field)
- Same admin-seeding behavior on startup
- Same debug `console.log` statements in the email verification flow (carried over from
  the Java version's `System.out.println` calls -- strip these before production if you want)

## Known quirk carried over intentionally
`sendVerificationEmail` always links to `http://localhost:<PORT>/api/auth/verify`, regardless
of where the backend is actually deployed. This matches the Java version exactly (per your
request to keep logic identical) -- if you deploy this, verification emails will still point
at localhost until you update `emailService.js` to use a real deployed backend URL.
