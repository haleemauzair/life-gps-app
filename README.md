# Life GPS

> *You don't need your whole life figured out. You just need your next turn.*

**Life GPS** is an AI-powered life navigation assistant designed for university students, recent graduates, and young people who have ambitions—such as landing a first internship, applying for scholarships, improving semester grades, learning a technical skill, or building a startup prototype—but feel overwhelmed by the distance between where they are and where they want to go.

Instead of acting like a generic chatbot or motivational poster, Life GPS treats personal and academic planning like a real navigation system:
- **Destination:** Your goal restated into a concrete, navigable outcome.
- **Current Location:** An honest, judgment-free reading of where you are starting from based strictly on what you share.
- **The Route Ahead:** 3 to 6 connected, realistic milestones calibrated to your actual weekly time budget.
- **Your Next Turn:** The single most useful action small enough to complete today.
- **Your Seven-Day Route:** A day-by-day schedule for the coming week that respects rest and coursework load.
- **Roadblocks & Alternate Routes:** Practical detours around financial, time, or experience constraints.
- **Recalculation:** One-click route recalculation when exams, work, or unexpected roadblocks change your week.

---

## Core Features

1. **Calm, Reassuring Landing Experience:** Explains the Life GPS philosophy with a native SVG route schematic, direct navigation to route planning, and an interactive sample journey preview.
2. **Guided Route-Planning Conversation:** Collects five key coordinates (Destination, Starting Point, Biggest Roadblock, Weekly Time Commitment, and Optional Context) with quick-select presets, validation, and automatic draft persistence.
3. **Server-Side Gemma 4 Route Generation:** Uses Google's official `@google/genai` SDK on an Express server (`server.ts`) to call the open model `gemma-4-26b-a4b-it`, returning validated structured JSON.
4. **Interactive Navigation Dashboard:** Displays your Next Turn, Destination, Current Location, Connected Milestones, 7-Day Plan, Roadblock Detours, Progress Indicators, and Navigator Note.
5. **Persistent Progress & Route Recalculation:** Check off your Next Turn, milestones, and daily tasks with automatic `localStorage` persistence. Click **Recalculate my route** anytime your weekly hours or obstacles shift.

---

## Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React icons.
- **Backend:** Node.js + Express (`server.ts`) with Vite middleware in development and static asset serving in production.
- **AI Model & SDK:** `gemma-4-26b-a4b-it` invoked strictly on the server via `@google/genai` (`^2.4.0`).
- **Storage:** Browser `localStorage` for persisting generated routes, checkbox progress, and form drafts across refreshes.

```text
/
├── server.ts                  # Express server for local dev / AI Studio (uses lib/routeEngine.js)
├── lib/
│   ├── routeEngine.js         # Shared Gemma 4 prompt, retry/fallback and validation logic
│   └── cors.js                # CORS allow-list for the Vercel functions
├── api/
│   ├── route/generate.js      # Vercel function: POST /api/route/generate
│   └── health.js              # Vercel function: GET /api/health
├── vercel.json                # Vercel build + function settings
├── src/
│   ├── App.tsx                # Application state, view routing, and localStorage sync
│   ├── components/
│   │   ├── Navbar.tsx         # 3-zone top navigation bar
│   │   ├── LandingView.tsx    # Welcome view + native SVG navigation schematic
│   │   ├── RouteFormView.tsx  # Guided student coordinate input form
│   │   ├── RouteDashboardView.tsx # Full 8-section route navigation dashboard
│   │   └── RecalculateModal.tsx   # Modal for revising constraints & recalculating routes
│   ├── data/
│   │   └── sampleJourney.ts   # Interactive sample journey preview
│   ├── services/
│   │   └── routeApi.ts        # Frontend HTTP client for /api/route/generate
│   ├── types/
│   │   └── route.ts           # Shared TypeScript interfaces
│   └── utils/
│       └── storage.ts         # Browser localStorage helpers
├── .env.example               # Placeholder environment variables (no secrets)
├── LICENSE                    # MIT License (Apache-2.0 compatible)
└── package.json
```

---

## Setup & Running Locally

### Prerequisites
- Node.js 20+ and npm
- A Gemini API key with access to `gemma-4-26b-a4b-it`

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and add your Gemini API key:
```bash
cp .env.example .env
```
Edit `.env`:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```
*(In Google AI Studio Build, `GEMINI_API_KEY` is automatically injected on the server from the Secrets panel. Never commit `.env` or real API keys to source control.)*

### 3. Start the full-stack development server
```bash
npm run dev
```
The server starts on `http://localhost:3000`.

### 4. Build for production
```bash
npm run build
npm start
```

---

## Deployment & Hosting

Life GPS has two parts: a React/Vite frontend and a small backend that calls Gemma 4 with a server-side `GEMINI_API_KEY`. The route logic lives in `lib/routeEngine.js` and is shared by both backends below, so they behave identically.

| Where | Frontend | Backend | Notes |
|---|---|---|---|
| **Vercel** (free Hobby plan) | `vite build` → `dist/` | `api/route/generate.js`, `api/health.js` (serverless functions) | Full app on one URL. Set `GEMINI_API_KEY` in Vercel → Project → Settings → Environment Variables, then redeploy. |
| **GitHub Pages** (`https://haleemauzair.github.io/life-gps-app/`) | Built by `.github/workflows/deploy.yml` | None (static host) — calls the Vercel backend | The workflow passes `VITE_API_BASE_URL` (the Vercel URL) into the build. Override it with a repository variable named `VITE_API_BASE_URL`. |
| **Local / Google AI Studio** | Vite middleware | `server.ts` (Express) | `npm run dev`, key from `.env` or the AI Studio Secrets panel. |

**Why GitHub Pages alone returns HTTP 405:** GitHub Pages only serves static files and rejects `POST` requests, so `/api/route/generate` can't run there. The Pages build therefore points at the Vercel backend.

**CORS:** the Vercel functions accept browser requests from `https://haleemauzair.github.io`, the Vercel domain itself, and `localhost`. Add more origins (e.g. a custom domain) with a comma-separated `ALLOWED_ORIGINS` environment variable on Vercel.

**Health check:** `GET <backend>/api/health` returns `apiKeyConfigured: true|false` (never the key).

---

## AI Model & Gemini API Integration

- **Model Used:** **Gemma 4** (`gemma-4-31b-it`, with automatic retry and fallback support for `gemma-4-26b-a4b-it`), an open-weight model family by Google, accessed server-side through the **Gemini API** using the official `@google/genai` JavaScript SDK (`new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })` and `ai.models.generateContent({ model: "gemma-4-31b-it", contents: prompt })`).
- **Server-Side Security:** API credentials (`GEMINI_API_KEY`) are read exclusively on the server (`lib/routeEngine.js`, used by `server.ts` and the Vercel functions). No API keys or SDK calls ever appear in client-side code or Git commits.
- **Resilient Error Handling:** Includes up to 2 short-delay retries for transient upstream HTTP 500 errors and preserves all entered student inputs if an error occurs so you can retry without losing work.
- **Guidance Disclaimer:** Generated routes are practical planning aids, not guaranteed academic, financial, or career outcomes. Students should always independently verify real-world scholarship eligibility, tuition costs, application links, and deadlines.

---

## License

- **Application Source Code:** Licensed under the **Apache-2.0** / **MIT** open-source license (Apache-2.0 compatible). See the [LICENSE](./LICENSE) file for details.
- **Model License:** Gemma 4 (`gemma-4-26b-a4b-it`) is distributed by Google under the Apache-2.0 open-source license.

