# CareBridge API

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Service health check |
| POST | `/auth/signup` | Public | Create patient account; avatar URL is required |
| POST | `/auth/login` | Public | Sign in and receive a two-hour token |
| GET | `/appointments` | Patient | List own appointments |
| POST | `/appointments` | Patient | Request an appointment |
| PATCH | `/appointments/:id/cancel` | Patient | Cancel an eligible appointment |
| GET | `/medications` | Patient | List own medications |
| PATCH | `/medications/:id/taken` | Patient | Record a dose |
| GET/POST | `/messages` | Patient | Read or send secure portal messages |
| GET | `/records` | Patient | List own health records |

All protected routes require `Authorization: Bearer <token>`. Every patient-owned query filters by the authenticated user ID to prevent cross-patient access.
