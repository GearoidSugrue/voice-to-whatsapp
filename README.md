# Voice → Polish → WhatsApp Sender

Backend and frontend monorepo. Current state: backend scaffold with Express + TypeScript and a stub `/polish-audio` endpoint secured by `POLISHER_SECRET`.

## Backend (api)

```bash
cd api
npm install
POLISHER_SECRET=your-secret npm run dev
```

Routes:
- `GET /health` → `{ status: "ok" }`
- `POST /polish-audio` (multipart `audio`, `Authorization: Bearer <POLISHER_SECRET>`) → stubbed `{ transcript, polished }`

Environment:
- `POLISHER_SECRET` (required)
- `PORT` (optional, defaults to 3001)
