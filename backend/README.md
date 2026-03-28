# EcoScan AI Backend

Minimal Express + Prisma backend for barcode scan insights.

## Stack

- Node.js
- Express.js
- PostgreSQL (Neon)
- Prisma ORM

## Structure

- src/routes
- src/controllers
- src/services
- src/utils
- app.js

## Setup

1. Install dependencies:

npm install

2. Configure Neon database in `.env`:

DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB_NAME?sslmode=require"
PORT=4000
OPENROUTER_API_KEY="your-openrouter-key"
OPENROUTER_MODEL="openai/gpt-oss-120b:free"

3. Generate Prisma client:

npm run prisma:generate

4. Create table (optional history):

npm run prisma:push

5. Start API:

npm run start

## Endpoint

POST /api/scan

Request body:

{
  "barcode": "string"
}

Response shape:

{
  "success": true,
  "productName": "...",
  "image": "...",
  "carbonFootprint": "...",
  "ecoScore": "A-F",
  "impact": "Equivalent to driving X km",
  "nutritionStatus": "healthy | unhealthy",
  "smartSummary": "...",
  "alternatives": [],
  "nutriScore": "A-F or null"
}

## Notes

- Product data source: OpenFoodFacts
- Nutrition verdict + healthier alternatives source: OpenRouter model (strict JSON mode)
- Barcode history save is optional and never blocks core response
- Timeouts are used on external API calls for faster responses

## Deploy On Vercel

1. Create a new Vercel project and set Root Directory to `backend`.
2. Add environment variable in Vercel project settings:
  - `DATABASE_URL` (your Neon connection string)
  - `OPENROUTER_API_KEY`
  - `OPENROUTER_MODEL` (optional; default is `openai/gpt-oss-120b:free`)
3. Deploy.

After deploy, API endpoints will be:

- `https://<your-vercel-domain>/api/scan`
- `https://<your-vercel-domain>/health`

Local server still works with:

- `npm run start`
