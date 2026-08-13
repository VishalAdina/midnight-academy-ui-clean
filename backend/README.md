# Midnight Academy - Backend

This is the NestJS backend for Midnight Academy.

## Setup

Ensure you have Node.js and npm installed.

```bash
# In the root directory, install all dependencies:
npm install

# In the backend directory, install backend-specific dependencies:
cd backend
npm install
```

## Running the Application

You can run the backend and frontend independently or from the root directory.

### From the Root Directory
- Run frontend: `npm run dev:frontend`
- Run backend: `npm run dev:backend`
- Build frontend: `npm run build:frontend`
- Build backend: `npm run build:backend`
- Lint all: `npm run lint`

### From the Backend Directory
- Run backend (dev mode): `npm run start:dev`
- Build backend: `npm run build`
- Lint backend: `npm run lint`

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8080
```

The application uses `Joi` to validate these environment variables on startup.
