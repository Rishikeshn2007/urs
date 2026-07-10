# urs — URL Shortener

>A simple URL shortening service with user authentication, a dashboard, and link management.

## Website deployed on versal
Check out the [Click here to view demo](https://urlshort-ten-orcin.vercel.app/)

https://urlshort-ten-orcin.vercel.app/

## Features
- Create short URLs for long links
- User registration, login and session via JWT stored in cookies
- Dashboard and URL manager UI for listing, deleting, and tracking clicks
- Redirects short URLs to their original destination and increments click count

## Tech Stack
- Node.js + Express
- MongoDB with Mongoose
- Authentication: JSON Web Tokens (JWT)
- Password hashing: bcryptjs
- Frontend: static HTML/CSS/vanilla JS in the `frontend/` folder

## Quick Start
1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root and set the following variables:

```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-secret>
PORT=3000
```

3. Run the app

```bash
npm start
```

The server will start on the port configured in `PORT` (default `3000`).

## Project Structure (high level)
- `index.js` — Server entry and route mounting
- `routes/` — Express route definitions (see `routes/users.js`)
- `controllers/` — Business logic (`url_short.js`, `auth.js`)
- `schema/` — Mongoose models (`url.js`, `user.js`)
- `frontend/` — Static frontend pages (login, register, dashboard, url-manager)

## Environment Variables
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret used to sign JWT tokens
- `PORT` — Server port (optional)

## API Endpoints
The application exposes the following endpoints (server + user routes):

- GET `/` — Home page (serves `frontend/index.html`)
- GET `/login` — Login page (`frontend/login.html`)
- GET `/register` — Registration page (`frontend/register.html`)
- POST `/form-register` — Register a new user (body: `name`, `email`, `password`)
- POST `/form-submit` — Login (body: `email`, `password`) — issues a JWT cookie
- POST `/logout` — Clears auth cookie
- GET `/users/dashboard` — Dashboard page (protected)
- GET `/users/url-manager` — URL manager page (protected)
- POST `/users/shorten-url` — Shorten a URL (protected; body: `longurl`, `email`)
- DELETE `/users/delete-url/:shortUrl` — Delete a short URL (protected)
- GET `/users/myurls/:email` — List URLs for a user (protected)
- GET `/users/profile` — Returns authenticated user profile (protected)
- GET `/:url` — Public redirect route for shortened URLs

## Database
The app uses MongoDB to store users and URLs. Schemas live in `schema/`:
- `schema/user.js` — user model
- `schema/url.js` — url model (tracks originalUrl, shortUrl, email, clicks)

## Notes & Security
- JWT tokens are stored in an HTTP-only cookie named `token`.
- Passwords are hashed with `bcryptjs` before storage.
- For production, ensure `JWT_SECRET` is a strong secret and enable HTTPS.

## Deployment
This is a standard Express app and can be deployed to platforms that support Node.js (Heroku, Render, Railway, etc.). Ensure your `MONGO_URI` and `JWT_SECRET` are set in the platform's environment.

## License
This project is licensed under the ISC License — see `package.json` for details.

---
If you'd like, I can also add a short demo GIF, more usage examples, or a CONTRIBUTING section.