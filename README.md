# URS — Secure URL Shortener

A secure full-stack URL shortening service built with Node.js, Express, and MongoDB, featuring JWT authentication, per-user link management, traffic analytics, and secure backend practices.

**Live demo:** [urlshort-ten-orcin.vercel.app](https://urlshort-ten-orcin.vercel.app/)

---

## Features

- User authentication via JWT.
- Rate-limited API calls.
- Server-side input validation.
- Traffic tracking per short URL and analysis dashboard.
- Password hashing with bcrypt.
- HTTP-only cookies for JWTs with expiry time to prevent XSS attacks.
- Create, list, and delete short URLs from a personal dashboard.
- Public redirect route resolves short codes to original URLs

## Why this project

Most URL shortener tutorials stop at "generate a short code and redirect." This one goes further by treating it as a real authenticated system: every user only ever sees and manages *their own* links, sessions are handled securely with HTTP-only cookies, and user identity is resolved server-side from a verified token — never trusted from client input.

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (HTTP-only cookies, 1h expiry) |
| Password security | bcryptjs |
| Frontend | Static HTML/CSS/vanilla JS |

## API Overview

| Method | Route | Description |
|---|---|---|
| POST | `/form-register` | Register a new user (rate-limited) |
| POST | `/form-submit` | Login, issues JWT cookie (rate-limited) |
| POST | `/logout` | Clears auth cookie |
| POST | `/users/shorten-url` | Create a short URL (auth required, URL validated,rate-limited) |
| GET | `/users/myurls` | List the authenticated user's URLs |
| DELETE | `/users/delete-url/:shortUrl` | Delete a URL (auth required, ownership-checked,rate-limited) |
| GET | `/users/profile` | Return authenticated user's profile |
| GET | `/:url` | Public redirect to original URL |

*Note: user-scoped routes derive identity from the verified JWT, not from client-supplied parameters.*

## Setup

```bash
npm install
```

Create a `.env` file:

```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-random-secret>
PORT=3000
```

Run the app:

```bash
npm start
```

## Project Structure

```
├── index.js           # Server entry, route mounting
├── routes/            # Express route definitions
├── controllers/       # Business logic (auth, url shortening)
├── schema/            # Mongoose models (user, url)
└── frontend/          # Static pages (login, register, dashboard)
```

## License

ISC