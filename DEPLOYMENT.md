# RideCircle Deployment Guide

This document outlines the steps required to safely deploy the RideCircle platform to production.

## 1. Environment Variables
You will need to provide the following variables in your hosting platforms. **Never hardcode or commit these values.**

### Backend (`.env`)
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_ALGORITHM` (Default: `HS256`)
- `ACCESS_TOKEN_EXPIRE_MINUTES` (Default: `43200` for 30 days)
- `FRONTEND_URL` (e.g., `https://ridecircle.example.com`)
- `ENVIRONMENT` (`production`)

### Frontend (`.env`)
- `VITE_API_URL` (e.g., `https://api.ridecircle.example.com`)

## 2. Database (PostgreSQL via Supabase/Render)
RideCircle is optimized for PostgreSQL in production.

1. Provision a PostgreSQL instance.
2. Obtain the connection string.
3. Replace the `DATABASE_URL` environment variable in the backend.

## 3. Backend Deployment (Render or similar)
The backend is built with FastAPI and runs on `uvicorn`.

1. Connect your GitHub repository to your hosting provider.
2. Set the Root Directory to `backend/`.
3. Set the Build Command:
   ```bash
   pip install -r requirements.txt
   ```
4. Set the Start Command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
5. Supply the environment variables from Section 1.
6. Once deployed, run migrations:
   ```bash
   alembic upgrade head
   ```
   *(Most platforms provide a "Pre-Deploy Command" or terminal where this can be executed).*
7. **Verification**: Visit `https://<backend-domain>/health`. It should return `{"status": "ok"}`.

## 4. Frontend Deployment (Vercel)
The frontend is a Vite + React Single Page Application (SPA).

1. Import the project into Vercel.
2. Set the Root Directory to `web/`.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Provide the `VITE_API_URL` environment variable pointing to the successfully deployed backend.
7. Click Deploy.
*(Note: A `vercel.json` file is already included to natively handle SPA rewrites/routing).*

## 5. Post-Deployment Verification Flow
After both services are live:
1. Load the frontend URL. Ensure the logo and assets resolve correctly.
2. Register a test account.
3. Create a test ride (Search functionality relies on valid rides).
4. Verify you can access the location map correctly (Nominatim handles geocoding publicly, ensure rate limits are respected).
5. Open the Ride details and ensure the Chat polling resolves correctly without throwing CORS or 401 errors.

*Do not artificially seed production with dummy data. Let the first users organically populate the platform.*
