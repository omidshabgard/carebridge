# CareBridge Healthcare Portal

CareBridge is a portfolio-grade full-stack patient portal. The frontend and backend are intentionally separate so they can be run, tested, deployed, and maintained independently.

## Included

- `frontend/` — React + TypeScript + Vite responsive patient portal
- `backend/` — Node.js + Express + TypeScript + MongoDB/Mongoose API
- `qa/` — Playwright UI and API tests configurable for local or live environments
- `docs/` — researched feature decisions, API reference, and project roadmap

## Run locally

1. Start MongoDB (`mongosh` can confirm it is running).
2. In `backend`, copy `.env.example` to `.env`, run `npm install`, then `npm run dev`.
3. In `frontend`, copy `.env.example` to `.env`, run `npm install`, then `npm run dev`.
4. Open `http://localhost:3000`.

## Test

In `qa`, copy `.env.example` to `.env`, run `npm install`, `npx playwright install chromium`, then:

- Local: `npm run test:local`
- Live: update the live URLs in `.env`, then run `npm run test:live`
- Report: `npm run report`

## Important

This is a realistic educational and portfolio application, not a certified production medical system. Production handling of protected health information requires organizational safeguards, vendor agreements, risk assessment, monitoring, incident response, legal review, and validated infrastructure in addition to application code.
