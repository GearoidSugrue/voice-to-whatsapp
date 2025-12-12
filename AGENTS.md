# Repository Guidelines (Voice → Polish → WhatsApp Sender)

These guidelines are for this monorepo MVP: a Vite React web app (web/) + Node.js TypeScript backend (api/) that records audio, transcribes + polishes text via OpenAI, and opens WhatsApp with a prefilled message.

---

## Project Structure & Module Organization

Monorepo layout

    root/
      api/              # Node + TypeScript backend (Express/Fastify)
        src/
        package.json
        tsconfig.json
      web/              # Vite + React + TypeScript frontend
        src/
        index.html
        package.json
        tsconfig.json
      README.md

Backend (api/)
- Keep backend code under api/src/.
- Suggested folders:
  - api/src/routes/  → HTTP endpoints (start with /polish-audio).
  - api/src/lib/     → OpenAI clients, prompt helpers, auth middleware.
  - api/src/types/   → shared request/response DTOs if needed.
- The backend owns:
  1) Secret auth (Iteration 1)
  2) Audio transcription via OpenAI (gpt-4o-transcribe)
  3) Message polishing via OpenAI text model (gpt-4o-mini or similar)

Frontend (web/)
- Keep frontend code under web/src/.
- Suggested folders:
  - web/src/components/ → UI components (Recorder, RecipientChooser, OutputPanels).
  - web/src/lib/        → recorder helpers, API client, number normalization.
  - web/src/styles/     → global styles if needed.
- The frontend owns:
  1) Mic recording via getUserMedia + MediaRecorder
  2) Uploading audio to backend
  3) Displaying transcript + polished text
  4) WhatsApp deep link: https://wa.me/<number>?text=<urlencoded message>
  5) Recipient persistence in localStorage("favRecipient")

---

## Build, Test, and Development Commands

Root-level
- There is no single root build by default. Run FE/BE separately.

Backend commands

    cd api
    npm install
    npm run dev       # ts-node / nodemon hot reload
    npm run build
    npm start
    npm test
    npm run lint

Frontend commands

    cd web
    npm install
    npm run dev       # Vite dev server (likely http://localhost:5173)
    npm run build     # outputs dist/
    npm run preview
    npm test
    npm run lint

Note: Mic access requires HTTPS (localhost is okay). Test on Android Chrome.

---

## Coding Style & Naming Conventions

TypeScript
- Prefer explicit types and interfaces for public surfaces (API handlers, DTOs).
- Use async/await and avoid nested promise chains.

Formatting
- Use Prettier + ESLint defaults in each package.
- 2-space indentation.
- Keep files small and single-purpose.

Naming
- React components: PascalCase.tsx exports.
- Utilities/helpers: kebab-case.ts or camelCase.ts is fine — be consistent within each package.
- Environment variables:
  - Backend: OPENAI_API_KEY, POLISHER_SECRET
  - Frontend: VITE_API_URL (only if not same-origin)

---

## API & Prompting Conventions

Endpoint
- Single MVP endpoint: POST /polish-audio
- Accepts multipart/form-data field "audio"
- Requires Authorization: Bearer <POLISHER_SECRET>

Response shape

    {
      "transcript": "...raw transcription...",
      "polished": "...WhatsApp-ready text..."
    }

Polish prompt (system)
- Keep it stable and conservative:
  - fix typos/grammar
  - improve clarity
  - keep tone casual and natural
  - do not add new info
  - keep concise

Do not introduce new content or structure beyond what the user said.

---

## Testing Guidelines

Backend
- Add unit tests for:
  - auth middleware (accept/reject)
  - OpenAI client wrappers (mocked)
  - prompt polish behavior (snapshot-style is fine)
- Add an integration test for /polish-audio using a small fixture audio or mocked transcription.

Frontend
- Add light component tests for:
  - recorder state transitions
  - recipient persistence in localStorage
  - deep link generation / encoding
- Prefer testing behavior (not implementation).

---

## Commit & Pull Request Guidelines

- Use conventional commits:
  - feat(api): ...
  - feat(web): ...
  - fix(api): ...
  - docs: ...
- Keep commits scoped to one concern.
- PRs should include:
  - A short summary
  - How to test locally
  - Screenshots for UX changes or example JSON for API changes

---

## Deployment Notes (Railway)

- Deploy two Railway services from this repo:
  1) api service rooted at api/
  2) web service rooted at web/ (static Vite build)
- Backend env vars must be set in Railway:
  - OPENAI_API_KEY
  - POLISHER_SECRET
- Frontend may need VITE_API_URL pointing to the api service if not same-origin.

---

## Future Iterations (Do Not Implement in MVP Unless Requested)

- Replace shared secret auth with Google Identity Services:
  - SPA obtains Google ID token
  - Backend verifies token and allowlists a single email
- Optional port of backend to Go or Deno after MVP validation.
- UX upgrades:
  - editable polished text
  - tone presets
  - PWA install + icons
  - recents / favorite chips

Keep MVP lean; ship first, then expand.
