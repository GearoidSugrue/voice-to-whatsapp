# Voice → Polish → WhatsApp (Frontend)

Vue 3 + TypeScript + Vite shell with light/dark theming and folder structure ready for recorder, recipient chooser, and output panels.

## Commands

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
```

## Env
- `VITE_API_URL` (optional; defaults to same-origin). Points to backend `/polish-audio`.

## Structure
- `src/components/` → UI components (recorder, recipient chooser, outputs)
- `src/composables/` → shared state/hooks
- `src/lib/` → utilities (API client, config)
- `src/styles/theme.css` → design tokens + light/dark styles

## Current flow
- Enter `POLISHER_SECRET` in the Auth card.
- Start/stop recording, then send for polish (uses MediaRecorder → multipart upload).
- Recipient is persisted to `localStorage` and used for the WhatsApp deeplink once results arrive.
