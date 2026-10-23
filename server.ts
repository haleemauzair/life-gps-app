import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { PRIMARY_MODEL_ID, handleGenerateRoute, healthPayload } from './lib/routeEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All Gemma prompt-building, retry/fallback and validation logic lives in
// lib/routeEngine.js so this Express server and the Vercel function
// (api/route/generate.js) always behave identically.

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  // Allow cross-origin requests to /api/* when the frontend is hosted separately (e.g. GitHub Pages pointing VITE_API_BASE_URL to this Node.js backend)
  app.use(['/api', '/life-gps-app/api'], (req: Request, res: Response, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.get(['/api/health', '/life-gps-app/api/health'], (_req: Request, res: Response) => {
    res.json(healthPayload());
  });

  app.post(['/api/route/generate', '/life-gps-app/api/route/generate'], async (req: Request, res: Response) => {
    const result = await handleGenerateRoute(req.body || {});
    res.status(result.status).json(result.body);
  });

  app.all(['/api/route/generate', '/life-gps-app/api/route/generate'], (req: Request, res: Response) => {
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
    app.use('/life-gps-app', express.static(distPath));
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
