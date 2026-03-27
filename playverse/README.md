# PlayVerse (NexGames)

A production-ready, ultra-modern multi-games platform with 15+ unique browser-based games, built with Next.js, Tailwind CSS, Phaser.js, Node.js, Express, and MongoDB. Fully responsive, scalable, and ready for deployment on Vercel.

## Monorepo Structure

- `/frontend` — Next.js app, PWA, all games, UI, API integration
- `/backend` — Node.js + Express API, MongoDB, JWT auth

## Features
- 15+ fully playable, original games (Phaser.js)
- Game Hub dashboard, profile, leaderboard, achievements
- Google/email login, XP, coins, daily rewards, streaks
- Glassmorphism + neon UI, Framer Motion, dark/light mode
- Real-time leaderboard, progress sync, offline mode
- Admin dashboard, anti-cheat, lazy loading

## Quick Start

### 1. Clone & Install
```sh
git clone <repo-url>
cd playverse
cd frontend && npm install
cd ../backend && npm install
```

### 2. Environment Variables
Create `.env.local` in `/frontend` and `/backend`:
- `MONGO_URI=your_mongodb_uri`
- `JWT_SECRET=your_jwt_secret`
- (Frontend) `NEXT_PUBLIC_API_URL=your_backend_url`

### 3. Run Locally
Frontend:
```sh
cd frontend
npm run dev
```
Backend:
```sh
cd backend
npm run dev
```

### 4. Deploy
- Deploy frontend to Vercel
- Deploy backend to Vercel serverless or other Node host
- Set environment variables in Vercel dashboard

## Folder Structure
- `/frontend/components` — UI components
- `/frontend/games` — Game modules
- `/frontend/pages` — Next.js pages
- `/frontend/lib/api` — API logic
- `/frontend/hooks` — React hooks
- `/backend/routes` — Express routes
- `/backend/models` — Mongoose models
- `/backend/controllers` — Logic

## More
- See full requirements in project brief
- All 15+ games are fully playable and integrated
- For help, see comments in code and this README
