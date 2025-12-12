# Voice → Polish → WhatsApp Sender

Backend and frontend monorepo. Current state: backend scaffold with Express + TypeScript and a stub `/polish-audio` endpoint secured by `POLISHER_SECRET`.

## Backend (api)

```bash
cd api
npm install
POLISHER_SECRET=your-secret OPENAI_API_KEY=your-key npm run dev
```

Routes:
- `GET /health` → `{ status: "ok" }`
- `POST /polish-audio` (multipart `audio`, `Authorization: Bearer <POLISHER_SECRET>`) → `{ transcript, polished }`

Environment:
- `POLISHER_SECRET` (required)
- `OPENAI_API_KEY` (required)
- `PORT` (optional, defaults to 3001)
- `LOG_LEVEL` (optional, defaults to `info`)
- `CORS_ORIGINS` (optional, comma-separated origins; if unset, CORS allows all)
