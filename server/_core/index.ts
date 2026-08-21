import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerLocalAuthRoutes } from "./localAuth";
import { registerFilesRoute } from "./filesRoute";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic } from "./static";
import { initWebSocket } from "./websocket";
import { trpcRateLimiter } from "./rateLimiter";
import { logger } from "./logger";
import {
  registerErrorHandler,
  registerHttpLogging,
  registerProcessHandlers,
} from "./httpLogging";
import cors from "cors";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Journalisation en tout premier : on veut voir même les requêtes rejetées
  // par les middlewares suivants (corps trop volumineux, quota atteint…).
  registerHttpLogging(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Connexion autonome (mode standalone uniquement). En mode "manus", cet
  // appel ne monte aucune route : le comportement existant est inchangé.
  registerLocalAuthRoutes(app);
  
  // CORS pour les endpoints p5data — permet l'accès depuis editor.p5js.org
  // et d'autres origines (localhost, fichiers locaux, etc.)
  const p5Cors = cors({
    origin: true, // Accepter toutes les origines pour les endpoints p5data (données publiques)
    methods: ["GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  });
  
  // Appliquer CORS uniquement aux routes p5data
  // Le middleware CORS doit intercepter les requêtes OPTIONS AVANT tRPC
  app.use("/api/trpc/p5data", p5Cors);
  app.options("/api/trpc/p5data*", p5Cors); // Pré-vol CORS explicite

  // Fichiers stockés, servis sous une URL stable (voir ./filesRoute.ts).
  // Monté AVANT le repli SPA pour ne pas être intercepté par celui-ci.
  registerFilesRoute(app);

  // Lot 2 — Rate limiting sur toute l'API tRPC (voir ./rateLimiter.ts)
  app.use("/api/trpc", trpcRateLimiter);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files.
  // L'import de ./vite est DYNAMIQUE et volontairement placé ici : ce module
  // dépend de Vite (dépendance de développement). Un import statique le
  // ferait apparaître dans le bundle de production, qui ne pourrait alors
  // plus démarrer sans les dépendances de développement installées.
  if (process.env.NODE_ENV === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Doit être enregistré APRÈS toutes les routes : Express sélectionne le
  // gestionnaire d'erreurs par ordre de déclaration.
  registerErrorHandler(app);

  // Initialiser le WebSocket pour la collaboration temps réel
  initWebSocket(server);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    logger.warn("port occupé, repli", { demandé: preferredPort, utilisé: port });
  }

  server.listen(port, () => {
    logger.info("serveur démarré", {
      url: `http://localhost:${port}/`,
      env: process.env.NODE_ENV ?? "development",
    });
  });
}

registerProcessHandlers();

startServer().catch(error => {
  logger.error("échec du démarrage du serveur", { error });
  process.exit(1);
});
