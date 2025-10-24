# Travlr

Full‑stack application that combines an Express/Handlebars website, a REST API, and an Angular admin UI.

The Node server renders pages and exposes API endpoints backed by MongoDB. The Angular admin app connects to the API for content management.

## Technology Stack

### Backend (Server + API)
- **Runtime**: Node.js
- **Framework**: Express.js 4.16.1
- **Template Engine**: Handlebars (HBS) 4.0.4
- **Database**: MongoDB 6.20.0
- **ODM**: Mongoose 8.18.2
- **Authentication**:
  - Passport.js 0.7.0 with passport-local strategy
  - JWT (jsonwebtoken) 9.0.2 for token-based authentication
- **Utilities**:
  - dotenv 17.2.3 - Environment variable management
  - morgan 1.9.1 - HTTP request logger
  - cookie-parser 1.4.4 - Cookie parsing middleware
  - http-errors 1.6.3 - HTTP error handling

### Frontend (Angular Admin)
- **Framework**: Angular 17.3.0
  - @angular/core, @angular/common, @angular/router
  - @angular/forms - Reactive and template-driven forms
  - @angular/platform-browser - Browser platform support
- **Language**: TypeScript 5.4.2
- **Reactive Programming**: RxJS 7.8.0
- **Zone Management**: Zone.js 0.14.3
- **Testing**:
  - Jasmine 5.1.0 - Testing framework
  - Karma 6.4.0 - Test runner
- **Build Tools**: Angular CLI 17.3.17 with Angular DevKit

### Development Tools
- **API Proxy**: Angular proxy configuration for local development
- **Debugging**: debug module for diagnostic output
- **Version Control**: Git

## Repository Structure
- `app_server`: Express + Handlebars website (routes, views, controllers)
- `app_api`: REST API (routes, controllers, models, auth/passport)
- `app_admin`: Angular admin SPA (served separately for development)
- `public`: Static assets for the website
- `bin/www`: Server bootstrap (used by `npm start`)
- `data`, `logs`: Local data/logging directories
- `.env`: Environment variables (local only; not committed)

## Prerequisites
- Node.js 18+ and npm
- MongoDB running locally or a reachable MongoDB instance

## Environment Variables
Create a `.env` in the project root. Present keys include:
- `JWT_SECRET`: Secret used for signing JWTs
- `DB_HOST` or `DB_API_HOST` (optional): Hostname for MongoDB (defaults to `127.0.0.1`)
- `PORT` (optional): Port for the Express app (default set in `bin/www`)

Example `.env`:
```
JWT_SECRET=change-me
# DB_HOST=127.0.0.1
# PORT=3000
```

## Install and Run (Server + API)
From the repo root:
```
npm install
npm start
```
This starts the Express app (`./bin/www`) which serves the website and mounts the API under `/api`.

MongoDB connection defaults to `mongodb://127.0.0.1/travlr`. Override with `DB_HOST` or `DB_API_HOST`.

## Install and Run (Angular Admin)
From `app_admin`:
```
cd app_admin
npm install
npm start
```
The admin app uses Angular’s dev server with `proxy.conf.json` to forward API calls to the Node server during development.

## Scripts
- Root: `npm start` — runs Express app via `./bin/www`
- Admin: `npm start` — runs Angular dev server with proxy

## Development Notes
- API base path: `/api`
- Views: Handlebars templates live in `app_server/views` with partials under `partials/`
- Models: Mongoose models under `app_api/models`
- Auth: Passport config under `app_api/config/passport`

## GitHub
This repository includes a top‑level `.gitignore`. Initialize a Git repo, commit changes, and push to GitHub:
```
git init -b main
git add .
git commit -m "chore: initial commit with server, API, and admin"
git remote add origin <your-repo-url>
git push -u origin main
```

