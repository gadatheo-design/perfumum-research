import { Server as HttpServer, IncomingMessage } from "http";
import { WebSocketServer, WebSocket, RawData } from "ws";
import { parse as parseCookie } from "cookie";
import jwt from "jsonwebtoken";
import { ENV } from "./env";

// Types pour la collaboration temps réel
interface CollaboratorPresence {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "away" | "busy";
  currentPage?: string;
  lastActivity: Date;
  cursorPosition?: { x: number; y: number };
}

interface CollaborationMessage {
  type: "presence" | "cursor" | "activity" | "comment" | "ping" | "pong";
  payload: Record<string, unknown>;
  userId?: string;
  timestamp: number;
}

interface ConnectedClient {
  ws: WebSocket;
  userId: string;
  userName: string;
  userAvatar?: string;
  currentPage?: string;
  lastActivity: Date;
  status: "online" | "away" | "busy";
}

interface ActivityRecord {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetType?: string;
  targetId?: number;
  targetName?: string;
  details?: string;
  timestamp: Date;
}

// Store des clients connectés
const connectedClients = new Map<string, ConnectedClient>();

// Store des activités récentes
const recentActivities: ActivityRecord[] = [];
const MAX_ACTIVITIES = 50;

// Vérifier le token JWT depuis les cookies
function verifyToken(cookieHeader: string | undefined): { userId: string; userName: string } | null {
  if (!cookieHeader) return null;
  
  try {
    const cookies = parseCookie(cookieHeader);
    const token = cookies["auth_token"];
    
    if (!token) return null;
    
    const decoded = jwt.verify(token, ENV.cookieSecret) as { sub?: string; id?: string; name?: string };
    return {
      userId: decoded.sub || decoded.id || "unknown",
      userName: decoded.name || "Utilisateur",
    };
  } catch {
    return null;
  }
}

// Diffuser un message à tous les clients connectés
function broadcast(message: CollaborationMessage, excludeUserId?: string) {
  const messageStr = JSON.stringify(message);
  
  connectedClients.forEach((client) => {
    if (excludeUserId && client.userId === excludeUserId) return;
    
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(messageStr);
    }
  });
}

// Envoyer la liste des utilisateurs connectés
function sendPresenceList(ws: WebSocket) {
  const presenceList: CollaboratorPresence[] = [];
  
  connectedClients.forEach((client) => {
    presenceList.push({
      id: client.userId,
      name: client.userName,
      avatar: client.userAvatar,
      status: client.status,
      currentPage: client.currentPage,
      lastActivity: client.lastActivity,
    });
  });
  
  const message: CollaborationMessage = {
    type: "presence",
    payload: { users: presenceList },
    timestamp: Date.now(),
  };
  
  ws.send(JSON.stringify(message));
}

// Ajouter une activité
function addActivity(activity: Omit<ActivityRecord, "id" | "timestamp">) {
  const newActivity: ActivityRecord = {
    ...activity,
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  };
  
  recentActivities.unshift(newActivity);
  
  // Limiter le nombre d'activités
  if (recentActivities.length > MAX_ACTIVITIES) {
    recentActivities.pop();
  }
  
  // Diffuser l'activité
  broadcast({
    type: "activity",
    payload: { activity: newActivity },
    timestamp: Date.now(),
  });
}

// Initialiser le serveur WebSocket
export function initWebSocket(server: HttpServer) {
  const wss = new WebSocketServer({ 
    server,
    path: "/ws/collaboration",
  });
  
  console.log("[WebSocket] Collaboration WebSocket server initialized on /ws/collaboration");
  
  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    // Vérifier l'authentification
    const auth = verifyToken(req.headers.cookie);
    
    const clientId = auth?.userId || `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const clientName = auth?.userName || "Visiteur";
    
    // Enregistrer le client
    const client: ConnectedClient = {
      ws,
      userId: clientId,
      userName: clientName,
      lastActivity: new Date(),
      status: "online",
    };
    
    connectedClients.set(clientId, client);
    
    console.log(`[WebSocket] Client connected: ${clientName} (${clientId})`);
    
    // Envoyer la liste des utilisateurs connectés
    sendPresenceList(ws);
    
    // Envoyer les activités récentes
    ws.send(JSON.stringify({
      type: "activity",
      payload: { history: recentActivities.slice(0, 20) },
      timestamp: Date.now(),
    }));
    
    // Notifier les autres utilisateurs
    broadcast({
      type: "presence",
      payload: {
        action: "join",
        user: {
          id: clientId,
          name: clientName,
          status: "online",
          lastActivity: new Date(),
        },
      },
      timestamp: Date.now(),
    }, clientId);
    
    // Gérer les messages entrants
    ws.on("message", (data: RawData) => {
      try {
        const message = JSON.parse(data.toString()) as CollaborationMessage;
        
        // Mettre à jour l'activité
        client.lastActivity = new Date();
        
        switch (message.type) {
          case "ping":
            ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
            break;
            
          case "cursor":
            // Diffuser la position du curseur
            broadcast({
              type: "cursor",
              payload: {
                userId: clientId,
                userName: clientName,
                ...(message.payload as Record<string, unknown>),
              },
              timestamp: Date.now(),
            }, clientId);
            break;
            
          case "presence":
            // Mettre à jour le statut ou la page actuelle
            if (message.payload.status) {
              client.status = message.payload.status as "online" | "away" | "busy";
            }
            if (message.payload.currentPage) {
              client.currentPage = message.payload.currentPage as string;
            }
            
            // Diffuser la mise à jour
            broadcast({
              type: "presence",
              payload: {
                action: "update",
                user: {
                  id: clientId,
                  name: clientName,
                  status: client.status,
                  currentPage: client.currentPage,
                  lastActivity: client.lastActivity,
                },
              },
              timestamp: Date.now(),
            });
            break;
            
          case "activity":
            // Ajouter une nouvelle activité
            addActivity({
              userId: clientId,
              userName: clientName,
              action: (message.payload.action as string) || "view",
              targetType: message.payload.targetType as string | undefined,
              targetId: message.payload.targetId as number | undefined,
              targetName: message.payload.targetName as string | undefined,
              details: message.payload.details as string | undefined,
            });
            break;
            
          case "comment":
            // Diffuser un commentaire
            broadcast({
              type: "comment",
              payload: {
                userId: clientId,
                userName: clientName,
                ...(message.payload as Record<string, unknown>),
              },
              timestamp: Date.now(),
            });
            
            // Ajouter comme activité
            addActivity({
              userId: clientId,
              userName: clientName,
              action: "comment",
              targetType: message.payload.targetType as string | undefined,
              targetId: message.payload.targetId as number | undefined,
              targetName: message.payload.targetName as string | undefined,
              details: ((message.payload.content as string) || "").substring(0, 100),
            });
            break;
        }
      } catch (error) {
        console.error("[WebSocket] Error parsing message:", error);
      }
    });
    
    // Gérer la déconnexion
    ws.on("close", () => {
      console.log(`[WebSocket] Client disconnected: ${clientName} (${clientId})`);
      
      connectedClients.delete(clientId);
      
      // Notifier les autres utilisateurs
      broadcast({
        type: "presence",
        payload: {
          action: "leave",
          user: {
            id: clientId,
            name: clientName,
          },
        },
        timestamp: Date.now(),
      });
    });
    
    // Gérer les erreurs
    ws.on("error", (error: Error) => {
      console.error(`[WebSocket] Error for client ${clientId}:`, error);
    });
  });
  
  // Ping périodique pour maintenir les connexions
  setInterval(() => {
    wss.clients.forEach((ws: WebSocket) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    });
  }, 30000);
  
  return wss;
}

// Exporter les fonctions utilitaires
export { broadcast, addActivity, connectedClients };
