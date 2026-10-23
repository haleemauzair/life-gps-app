import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIMARY_MODEL_ID = 'gemma-4-31b-it';
const FALLBACK_MODEL_ID = 'gemma-4-26b-a4b-it';

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error(
      'Server configuration error: GEMINI_API_KEY is missing or not configured in the environment. Please ensure the secret is set in Google AI Studio.'
    );
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

const SYSTEM_INSTRUCTION = `You are Life GPS, a thoughtful, perceptive, and realistic life-navigation companion for students and young people.
Your role is to help a student turn an academic, career, or personal ambition into a concrete, navigable step-by-step route.

Core Philosophy & Writing Rules:
1. Grounded & Empathetic: Write as a calm, practical guide. Never talk down to the student, never assume they lack discipline, and never treat structural constraints (money, time, lack of network) as mindset problems.
2. Strict Anti-Cliché Policy: NEVER use phrases like "Unlock your full potential", "Become the best version of yourself", "Your journey to greatness starts here", "Success is just one click away", or "Crush your goals".
3. Zero Fabrication of Student Background: In "currentLocation", summarize ONLY what the student actually shared. Never invent qualifications, prior coursework, savings, or connections they did not mention.
4. Zero Fabrication of External Opportunities: Never invent fake scholarships, specific company internship openings, URLs, or guaranteed application deadlines. When opportunities, prices, eligibility rules, or deadlines are relevant, explicitly state that the student must verify current details.
5. Respect Time Constraints: Ensure the 3 to 5 milestones and the 7-day plan strictly fit within the student's stated weekly time commitment. If a student only has 2–3 hours per week, the total time across all 7 days of the sevenDayPlan MUST NOT exceed 2–3 hours total (include rest days with "0 mins (Rest day)").
6. Actionable "Next Turn": The "nextTurn" must be a single, concrete step small enough to begin today (typically 15–45 minutes) with an unambiguous definition of done.
7. Be Concise: Keep each field concise and direct (1–2 sentences per field) so the student can scan their route immediately.`;

function buildPrompt(body: Record<string, unknown>): string {
  const goal = String(body.goal || '').trim();
  const currentSituation = String(body.currentSituation || '').trim();
  const biggestObstacle = String(body.biggestObstacle || '').trim();
  const timeAvailable = String(body.timeAvailable || '').trim();
  const additionalContext = String(body.additionalContext || '').trim();
  const isRecalculation = Boolean(body.isRecalculation);
  const previousDestination = String(body.previousDestination || '').trim();
  const recalculationReason = String(body.recalculationReason || '').trim();
  const completedSummary = Array.isArray(body.completedSummary)
    ? body.completedSummary.map((s) => String(s)).filter(Boolean)
    : [];

  let prompt = `${SYSTEM_INSTRUCTION}\n\nGenerate a personalized Life GPS navigation route in valid JSON format for the following student:\n`;
  prompt += `- Stated Destination / Goal: ${goal}\n`;
  prompt += `- Current Location (Starting Point): ${currentSituation}\n`;
  prompt += `- Biggest Roadblock: ${biggestObstacle}\n`;
  prompt += `- Realistic Weekly Time Commitment: ${timeAvailable}\n`;
  if (additionalContext) {
    prompt += `- Additional Context / Constraints: ${additionalContext}\n`;
  }

  if (isRecalculation) {
    prompt += `\n--- ROUTE RECALCULATION CONTEXT ---\n`;
    prompt += `The student is recalculating an existing route because circumstances or constraints changed.\n`;
    if (previousDestination) {
      prompt += `- Original Destination to Preserve (unless updated above): ${previousDestination}\n`;
    }
    if (recalculationReason) {
      prompt += `- What Changed / Why Recalculating: ${recalculationReason}\n`;
    }
    if (completedSummary.length > 0) {
      prompt += `- Steps Already Completed by the Student (acknowledge this momentum and do not repeat completed setup steps):\n`;
      for (const item of completedSummary) {
        prompt += `  * ${item}\n`;
      }
    }
  }

  prompt += `\nRequirements:
1. Include 3 to 4 milestones in "milestones" (numbered sequentially starting at 1).
2. Include all 7 days in "sevenDayPlan" (dayNumber 1 through 7). Ensure the sum of daily time estimates matches "${timeAvailable}" per week, using rest days ("isRestOrLightDay": true, timeEstimate: "0 mins (Rest day)").
3. Include 2 to 3 realistic roadblocks in "roadblocks" with concrete alternate routes and verification notes.
4. Include 2 measurable progress indicators in "progressIndicators".
5. Keep all text concise (1-2 sentences per field). Respond with ONLY a valid JSON object matching this exact schema (no markdown commentary outside the JSON):
{
  "destination": {
    "statedGoal": "string",
    "concreteDestination": "string",
    "clarityNote": "string",
    "estimatedHorizon": "string"
  },
  "currentLocation": {
    "summary": "string",
    "strengths": ["string", "string"],
    "uncertainties": ["string", "string"]
  },
  "nextTurn": {
    "headline": "string",
    "action": "string",
    "timeNeeded": "string",
    "whyFirst": "string",
    "definitionOfDone": "string"
  },
  "milestones": [
    {
      "stepNumber": 1,
      "title": "string",
      "description": "string",
      "whyItMatters": "string",
      "connectionToNext": "string",
      "estimatedTime": "string",
      "deliverable": "string"
    }
  ],
  "sevenDayPlan": [
    {
      "dayNumber": 1,
      "dayLabel": "Day 1",
      "title": "string",
      "action": "string",
      "timeEstimate": "string",
      "definitionOfDone": "string",
      "isRestOrLightDay": false
    }
  ],
  "roadblocks": [
    {
      "obstacle": "string",
      "whyItHappens": "string",
      "alternateRoute": "string",
      "verificationNote": "string"
    }
  ],
  "progressIndicators": [
    {
      "metric": "string",
      "tangibleOutput": "string",
      "cadence": "string"
    }
  ],
  "navigatorNote": "string"
}`;

  return prompt;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientServerError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const status = (err as { status?: number })?.status;
  return (
    status === 500 ||
    status === 503 ||
    msg.includes('500') ||
    msg.includes('503') ||
    msg.includes('INTERNAL') ||
    msg.includes('Internal error encountered')
  );
}

async function callGemmaModelWithRetries(
  ai: GoogleGenAI,
  modelId: string,
  prompt: string,
  maxRetries = 2
): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
      });
      if (result.text && result.text.trim().length > 0) {
        return result.text;
      }
      throw new Error(`Model ${modelId} returned an empty response.`);
    } catch (err: unknown) {
      lastError = err;
      console.warn(
        `[Life GPS] Attempt ${attempt + 1}/${maxRetries + 1} for ${modelId} failed:`,
        err instanceof Error ? err.message : err
      );
      if (attempt < maxRetries && isTransientServerError(err)) {
        await sleep(1200 * (attempt + 1));
        continue;
      }
      break;
    }
  }
  throw lastError;
}

async function generateRouteWithGemma4(
  ai: GoogleGenAI,
  prompt: string
): Promise<{ text: string; modelUsed: string }> {
  // Use gemma-4-31b-it (verified working Gemma 4 model) with up to 2 retries on HTTP 500,
  // and fall back to gemma-4-26b-a4b-it if needed.
  try {
    const text = await callGemmaModelWithRetries(ai, PRIMARY_MODEL_ID, prompt, 2);
    return { text, modelUsed: PRIMARY_MODEL_ID };
  } catch (primaryErr: unknown) {
    console.warn(
      `[Life GPS] ${PRIMARY_MODEL_ID} failed after retries; attempting ${FALLBACK_MODEL_ID}...`
    );
    try {
      const text = await callGemmaModelWithRetries(ai, FALLBACK_MODEL_ID, prompt, 1);
      return { text, modelUsed: FALLBACK_MODEL_ID };
    } catch {
      throw primaryErr;
    }
  }
}

function extractAndValidateRoute(
  rawText: string,
  inputBody: Record<string, unknown>,
  modelUsed: string
) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  const parsed = JSON.parse(cleaned);

  if (
    !parsed ||
    typeof parsed !== 'object' ||
    !parsed.destination ||
    !parsed.currentLocation ||
    !parsed.nextTurn ||
    !Array.isArray(parsed.milestones) ||
    parsed.milestones.length < 3 ||
    !Array.isArray(parsed.sevenDayPlan) ||
    parsed.sevenDayPlan.length === 0
  ) {
    throw new Error('Model response did not match the required Life GPS route schema.');
  }

  const now = new Date().toISOString();
  const routeId = `route-${Date.now()}`;

  return {
    id: routeId,
    createdAt: now,
    updatedAt: now,
    modelUsed,
    isSample: false,
    input: {
      goal: String(inputBody.goal || '').trim(),
      currentSituation: String(inputBody.currentSituation || '').trim(),
      biggestObstacle: String(inputBody.biggestObstacle || '').trim(),
      timeAvailable: String(inputBody.timeAvailable || '').trim(),
      additionalContext: String(inputBody.additionalContext || '').trim(),
      isRecalculation: Boolean(inputBody.isRecalculation),
      previousDestination: String(inputBody.previousDestination || '').trim(),
      recalculationReason: String(inputBody.recalculationReason || '').trim(),
    },
    destination: {
      statedGoal: String(parsed.destination.statedGoal || inputBody.goal || ''),
      concreteDestination: String(parsed.destination.concreteDestination || ''),
      clarityNote: String(parsed.destination.clarityNote || ''),
      estimatedHorizon: String(parsed.destination.estimatedHorizon || ''),
    },
    currentLocation: {
      summary: String(parsed.currentLocation.summary || ''),
      strengths: Array.isArray(parsed.currentLocation.strengths)
        ? parsed.currentLocation.strengths.map(String)
        : [],
      uncertainties: Array.isArray(parsed.currentLocation.uncertainties)
        ? parsed.currentLocation.uncertainties.map(String)
        : [],
    },
    nextTurn: {
      id: `${routeId}-next-turn`,
      headline: String(parsed.nextTurn.headline || 'Your immediate first step'),
      action: String(parsed.nextTurn.action || ''),
      timeNeeded: String(parsed.nextTurn.timeNeeded || '30 mins'),
      whyFirst: String(parsed.nextTurn.whyFirst || ''),
      definitionOfDone: String(parsed.nextTurn.definitionOfDone || ''),
    },
    milestones: parsed.milestones.slice(0, 6).map((m: Record<string, unknown>, idx: number) => ({
      id: `${routeId}-milestone-${idx + 1}`,
      stepNumber: idx + 1,
      title: String(m.title || `Milestone ${idx + 1}`),
      description: String(m.description || ''),
      whyItMatters: String(m.whyItMatters || ''),
      connectionToNext: String(m.connectionToNext || ''),
      estimatedTime: String(m.estimatedTime || ''),
      deliverable: String(m.deliverable || ''),
    })),
    sevenDayPlan: parsed.sevenDayPlan.slice(0, 7).map((d: Record<string, unknown>, idx: number) => ({
      id: `${routeId}-day-${idx + 1}`,
      dayNumber: Number(d.dayNumber) || idx + 1,
      dayLabel: String(d.dayLabel || `Day ${idx + 1}`),
      title: String(d.title || ''),
      action: String(d.action || ''),
      timeEstimate: String(d.timeEstimate || ''),
      definitionOfDone: String(d.definitionOfDone || ''),
      isRestOrLightDay: Boolean(d.isRestOrLightDay),
    })),
    roadblocks: Array.isArray(parsed.roadblocks)
      ? parsed.roadblocks.map((r: Record<string, unknown>, idx: number) => ({
          id: `${routeId}-roadblock-${idx + 1}`,
          obstacle: String(r.obstacle || ''),
          whyItHappens: String(r.whyItHappens || ''),
          alternateRoute: String(r.alternateRoute || ''),
          verificationNote: String(
            r.verificationNote ||
              'Verify current availability, eligibility requirements, and deadlines independently.'
          ),
        }))
      : [],
    progressIndicators: Array.isArray(parsed.progressIndicators)
      ? parsed.progressIndicators.map((p: Record<string, unknown>, idx: number) => ({
          id: `${routeId}-indicator-${idx + 1}`,
          metric: String(p.metric || ''),
          tangibleOutput: String(p.tangibleOutput || ''),
          cadence: String(p.cadence || 'Weekly'),
        }))
      : [],
    navigatorNote: String(parsed.navigatorNote || ''),
    recalculationCount: Number(inputBody.recalculationCount || 0),
  };
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  // Allow cross-origin requests to /api/* when the frontend is hosted separately (e.g. GitHub Pages pointing VITE_API_BASE_URL to this Node.js backend)
  app.use('/api', (req: Request, res: Response, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    const hasKey = Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    );
    res.json({
      status: 'ok',
      model: PRIMARY_MODEL_ID,
      fallbackModel: FALLBACK_MODEL_ID,
      apiKeyConfigured: hasKey,
    });
  });

  app.post('/api/route/generate', async (req: Request, res: Response) => {
    try {
      const { goal, currentSituation, biggestObstacle, timeAvailable } = req.body || {};

      if (!goal || typeof goal !== 'string' || goal.trim().length < 5) {
        res.status(400).json({
          error: 'Please describe your destination goal in at least a few words so we can plot a meaningful route.',
        });
        return;
      }
      if (!currentSituation || typeof currentSituation !== 'string' || currentSituation.trim().length < 5) {
        res.status(400).json({
          error: 'Please share a brief description of where you are starting from.',
        });
        return;
      }
      if (!biggestObstacle || typeof biggestObstacle !== 'string' || biggestObstacle.trim().length < 3) {
        res.status(400).json({
          error: 'Please tell us the main roadblock or challenge standing in your way.',
        });
        return;
      }
      if (!timeAvailable || typeof timeAvailable !== 'string' || timeAvailable.trim().length < 2) {
        res.status(400).json({
          error: 'Please select or enter how much time you can realistically commit each week.',
        });
        return;
      }

      const ai = getGenAIClient();
      const prompt = buildPrompt(req.body);

      const { text: responseText, modelUsed } = await generateRouteWithGemma4(ai, prompt);

      const validatedRoute = extractAndValidateRoute(responseText, req.body, modelUsed);
      res.json({ route: validatedRoute });
    } catch (error: unknown) {
      console.error('[Life GPS] Error calling Gemma 4 model:', error);
      const rawMessage = error instanceof Error ? error.message : String(error);

      let userFriendlyError = `Unable to generate route with Gemma 4 (${PRIMARY_MODEL_ID}). `;
      if (rawMessage.includes('500') || rawMessage.includes('INTERNAL')) {
        userFriendlyError += `The upstream Gemma 4 API returned a temporary HTTP 500 internal server error after retrying. Your API key is configured, and your inputs are saved—please wait a few seconds and click Retry.`;
      } else if (rawMessage.includes('404') || rawMessage.toLowerCase().includes('not found')) {
        userFriendlyError += `The requested Gemma 4 model was not found (${rawMessage}).`;
      } else if (
        rawMessage.includes('401') ||
        rawMessage.includes('403') ||
        rawMessage.toLowerCase().includes('api_key_invalid')
      ) {
        userFriendlyError += `API key authentication or permission error (${rawMessage}). Please verify GEMINI_API_KEY in Settings > Secrets.`;
      } else if (rawMessage.includes('429') || rawMessage.toLowerCase().includes('quota')) {
        userFriendlyError += `Rate limit or quota reached for Gemma 4. Please wait a moment and click Retry.`;
      } else {
        userFriendlyError += `Details: ${rawMessage}`;
      }

      res.status(500).json({
        error: userFriendlyError,
        model: PRIMARY_MODEL_ID,
      });
    }
  });

  app.all('/api/route/generate', (req: Request, res: Response) => {
    res.status(405).json({
      error: `Method ${req.method} not allowed on /api/route/generate. Use POST with JSON body.`,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ws: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Life GPS server running on http://0.0.0.0:${PORT} using primary model ${PRIMARY_MODEL_ID}`
    );
  });
}

startServer();
