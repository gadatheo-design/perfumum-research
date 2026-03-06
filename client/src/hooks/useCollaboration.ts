// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";

// Types pour la collaboration temps réel
export interface CollaboratorPresence {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "away" | "busy";
  currentPage?: string;
  lastActivity: Date;
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: "create" | "edit" | "delete" | "comment" | "view";
  targetType: "molecule" | "recette" | "note" | "comment";
  targetId: number;
  targetName: string;
  timestamp: Date;
  details?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  targetType: string;
  targetId: number;
  replies?: Comment[];
}

interface CollaborationMessage {
  type: "presence" | "cursor" | "activity" | "comment" | "ping" | "pong";
  payload: Record<string, unknown>;
  userId?: string;
  timestamp: number;
}

interface UseCollaborationOptions {
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useCollaboration(options: UseCollaborationOptions = {}) {
  const {
    autoConnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [location] = useLocation();

  // Construire l'URL WebSocket
  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    return `${protocol}//${host}/ws/collaboration`;
  }, []);

  // Envoyer un message via WebSocket
  const sendMessage = useCallback((message: Omit<CollaborationMessage, "timestamp">) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        ...message,
        timestamp: Date.now(),
      }));
    }
  }, []);

  // Mettre à jour la présence (page actuelle, statut)
  const updatePresence = useCallback((data: { currentPage?: string; status?: "online" | "away" | "busy" }) => {
    sendMessage({
      type: "presence",
      payload: data,
    });
  }, [sendMessage]);

  // Envoyer une activité
  const sendActivity = useCallback((activity: {
    action: string;
    targetType?: string;
    targetId?: number;
    targetName?: string;
    details?: string;
  }) => {
    sendMessage({
      type: "activity",
      payload: activity,
    });
  }, [sendMessage]);

  // Envoyer un commentaire
  const sendComment = useCallback((comment: {
    content: string;
    targetType: string;
    targetId: number;
    targetName?: string;
  }) => {
    sendMessage({
      type: "comment",
      payload: comment,
    });
  }, [sendMessage]);

  // Envoyer la position du curseur
  const sendCursor = useCallback((position: { x: number; y: number }) => {
    sendMessage({
      type: "cursor",
      payload: position,
    });
  }, [sendMessage]);

  // Gérer les messages entrants
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: CollaborationMessage = safeJsonParse(event.data, null); if (!message) return;

      switch (message.type) {
        case "presence":
          const presencePayload = message.payload as {
            action?: string;
            user?: CollaboratorPresence;
            users?: CollaboratorPresence[];
          };
          
          if (presencePayload.users) {
            // Liste complète des utilisateurs
            setCollaborators(presencePayload.users.map(u => ({
              ...u,
              lastActivity: new Date(u.lastActivity),
            })));
          } else if (presencePayload.action && presencePayload.user) {
            // Mise à jour individuelle
            setCollaborators(prev => {
              switch (presencePayload.action) {
                case "join":
                  return [...prev.filter(c => c.id !== presencePayload.user!.id), {
                    ...presencePayload.user!,
                    lastActivity: new Date(presencePayload.user!.lastActivity),
                  }];
                case "leave":
                  return prev.filter(c => c.id !== presencePayload.user!.id);
                case "update":
                  return prev.map(c => 
                    c.id === presencePayload.user!.id 
                      ? { ...presencePayload.user!, lastActivity: new Date(presencePayload.user!.lastActivity) }
                      : c
                  );
                default:
                  return prev;
              }
            });
          }
          break;

        case "activity":
          const activityPayload = message.payload as {
            history?: ActivityItem[];
            activity?: ActivityItem;
          };
          
          if (activityPayload.history) {
            setActivities(activityPayload.history.map(a => ({
              ...a,
              timestamp: new Date(a.timestamp),
            })));
          } else if (activityPayload.activity) {
            setActivities(prev => [{
              ...activityPayload.activity!,
              timestamp: new Date(activityPayload.activity!.timestamp),
            }, ...prev].slice(0, 50));
          }
          break;

        case "comment":
          const commentPayload = message.payload as unknown as Comment;
          if (commentPayload.id && commentPayload.content) {
            setComments(prev => [{
              ...commentPayload,
              timestamp: new Date(commentPayload.timestamp),
            }, ...prev]);
          }
          break;

        case "pong":
          // Réponse au ping, connexion active
          break;
      }
    } catch (error) {
      console.error("[Collaboration] Error parsing message:", error);
    }
  }, []);

  // Connecter au WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(getWebSocketUrl());
      wsRef.current = ws;

      ws.onopen = () => {
        if (import.meta.env.DEV) console.debug("[Collaboration] Connected to WebSocket");
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        
        // Envoyer la page actuelle
        updatePresence({ currentPage: location });
      };

      ws.onmessage = handleMessage;

      ws.onclose = () => {
        if (import.meta.env.DEV) console.debug("[Collaboration] Disconnected from WebSocket");
        setIsConnected(false);
        wsRef.current = null;

        // Tenter de reconnecter
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            if (import.meta.env.DEV) console.debug(`[Collaboration] Reconnecting... (attempt ${reconnectAttemptsRef.current})`);
            connect();
          }, reconnectInterval);
        } else {
          setConnectionError("Impossible de se reconnecter au serveur de collaboration");
        }
      };

      ws.onerror = (error) => {
        console.error("[Collaboration] WebSocket error:", error);
        setConnectionError("Erreur de connexion au serveur de collaboration");
      };
    } catch (error) {
      console.error("[Collaboration] Failed to connect:", error);
      setConnectionError("Échec de la connexion au serveur de collaboration");
    }
  }, [getWebSocketUrl, handleMessage, location, maxReconnectAttempts, reconnectInterval, updatePresence]);

  // Déconnecter du WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    reconnectAttemptsRef.current = maxReconnectAttempts; // Empêcher la reconnexion automatique
  }, [maxReconnectAttempts]);

  // Connexion automatique
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Mettre à jour la page actuelle quand la location change
  useEffect(() => {
    if (isConnected) {
      updatePresence({ currentPage: location });
    }
  }, [location, isConnected, updatePresence]);

  // Ping périodique pour maintenir la connexion
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      sendMessage({ type: "ping", payload: {} });
    }, 25000);

    return () => clearInterval(pingInterval);
  }, [isConnected, sendMessage]);

  return {
    isConnected,
    connectionError,
    collaborators,
    activities,
    comments,
    connect,
    disconnect,
    updatePresence,
    sendActivity,
    sendComment,
    sendCursor,
  };
}
