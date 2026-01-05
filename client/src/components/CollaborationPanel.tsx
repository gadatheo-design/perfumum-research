import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCollaboration, type CollaboratorPresence, type ActivityItem, type Comment } from "@/hooks/useCollaboration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  MessageSquare,
  Edit3,
  Clock,
  Send,
  Bell,
  BellOff,
  UserPlus,
  Settings,
  MoreVertical,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Activity,
  Eye,
  FileText,
  FlaskConical,
  Beaker,
  BookOpen,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

// Les types sont maintenant importés depuis useCollaboration

interface CollaborationPanelProps {
  className?: string;
  variant?: "sidebar" | "panel" | "floating";
  targetType?: string;
  targetId?: number;
}

// Données de fallback quand WebSocket n'est pas connecté
const FALLBACK_COLLABORATORS: CollaboratorPresence[] = [];
const FALLBACK_ACTIVITIES: ActivityItem[] = [];
const FALLBACK_COMMENTS: Comment[] = [];

// Composant d'avatar avec indicateur de statut
function CollaboratorAvatar({ 
  collaborator, 
  size = "default" 
}: { 
  collaborator: CollaboratorPresence;
  size?: "sm" | "default" | "lg";
}) {
  const sizeClasses = {
    sm: "h-6 w-6",
    default: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
  };

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={collaborator.avatar} />
        <AvatarFallback className="text-xs">
          {collaborator.name.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div 
        className={cn(
          "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background",
          statusColors[collaborator.status],
          size === "sm" ? "h-2 w-2" : "h-3 w-3"
        )}
      />
    </div>
  );
}

// Composant de liste des collaborateurs en ligne
function OnlineCollaborators({ collaborators }: { collaborators: CollaboratorPresence[] }) {
  const onlineCount = collaborators.filter(c => c.status === "online").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" />
          En ligne ({onlineCount})
        </h4>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-2">
        {collaborators.map((collab) => (
          <motion.div
            key={collab.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <CollaboratorAvatar collaborator={collab} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{collab.name}</p>
              {collab.currentPage && (
                <p className="text-xs text-muted-foreground truncate">
                  {collab.currentPage}
                </p>
              )}
            </div>
            <Badge variant="outline" className="text-xs shrink-0">
              {collab.status === "online" ? "Actif" : collab.status === "away" ? "Absent" : "Occupé"}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Composant de flux d'activité
function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  const getActionIcon = (action: ActivityItem["action"]) => {
    switch (action) {
      case "create": return <Sparkles className="h-3 w-3 text-green-500" />;
      case "edit": return <Edit3 className="h-3 w-3 text-blue-500" />;
      case "delete": return <X className="h-3 w-3 text-red-500" />;
      case "comment": return <MessageSquare className="h-3 w-3 text-purple-500" />;
      case "view": return <Eye className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTargetIcon = (type: ActivityItem["targetType"]) => {
    switch (type) {
      case "molecule": return <FlaskConical className="h-3 w-3" />;
      case "recette": return <Beaker className="h-3 w-3" />;
      case "note": return <FileText className="h-3 w-3" />;
      case "comment": return <MessageSquare className="h-3 w-3" />;
    }
  };

  const getActionText = (action: ActivityItem["action"]) => {
    switch (action) {
      case "create": return "a créé";
      case "edit": return "a modifié";
      case "delete": return "a supprimé";
      case "comment": return "a commenté";
      case "view": return "a consulté";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Activité récente
        </h4>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-3 pr-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="shrink-0 mt-1">
                {getActionIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.userName}</span>
                  {" "}{getActionText(activity.action)}{" "}
                  <span className="inline-flex items-center gap-1 font-medium">
                    {getTargetIcon(activity.targetType)}
                    {activity.targetName}
                  </span>
                </p>
                {activity.details && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.details}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: fr })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// Composant de commentaires
function CommentsSection({ 
  comments, 
  targetType, 
  targetId,
  onAddComment 
}: { 
  comments: Comment[];
  targetType?: string;
  targetId?: number;
  onAddComment: (content: string) => void;
}) {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  const filteredComments = targetType && targetId
    ? comments.filter(c => c.targetType === targetType && c.targetId === targetId)
    : comments;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Commentaires ({filteredComments.length})
        </h4>
      </div>

      {/* Liste des commentaires */}
      <ScrollArea className="h-[200px]">
        <div className="space-y-4 pr-4">
          {filteredComments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun commentaire pour le moment</p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={comment.userAvatar} />
                  <AvatarFallback className="text-xs">
                    {comment.userName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.timestamp, { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Formulaire de nouveau commentaire */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Ajouter un commentaire..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!newComment.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

// Composant de notifications collaboratives
function CollaborativeNotifications() {
  const [notifications, setNotifications] = useState([
    { id: "1", type: "mention", message: "Clara vous a mentionné dans un commentaire", read: false, timestamp: new Date() },
    { id: "2", type: "edit", message: "Thomas a modifié la recette 'Accord Pétrichor'", read: true, timestamp: new Date(Date.now() - 3600000) },
  ]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
        >
          {notificationsEnabled ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.slice(0, 3).map((notif) => (
          <div
            key={notif.id}
            className={cn(
              "p-2 rounded-lg text-sm",
              notif.read ? "bg-muted/30" : "bg-primary/10"
            )}
          >
            <p className={cn(!notif.read && "font-medium")}>{notif.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(notif.timestamp, { addSuffix: true, locale: fr })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant principal
export function CollaborationPanel({
  className,
  variant = "panel",
  targetType,
  targetId,
}: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState<"presence" | "activity" | "comments">("presence");
  const { user } = useAuth();
  
  // Utiliser le hook de collaboration WebSocket
  const {
    isConnected,
    connectionError,
    collaborators: wsCollaborators,
    activities: wsActivities,
    comments: wsComments,
    sendComment,
    sendActivity,
  } = useCollaboration({ autoConnect: true });

  // Utiliser les données WebSocket ou les fallbacks
  const collaborators = wsCollaborators.length > 0 ? wsCollaborators : FALLBACK_COLLABORATORS;
  const activities = wsActivities.length > 0 ? wsActivities : FALLBACK_ACTIVITIES;
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const comments = [...wsComments, ...localComments];

  const handleAddComment = useCallback((content: string) => {
    if (isConnected) {
      // Envoyer via WebSocket
      sendComment({
        content,
        targetType: targetType || "general",
        targetId: targetId || 0,
        targetName: targetType ? `${targetType} #${targetId}` : "Discussion générale",
      });
    } else {
      // Fallback local
      const newComment: Comment = {
        id: Date.now().toString(),
        userId: String(user?.id || "unknown"),
        userName: user?.name || "Utilisateur",
        content,
        timestamp: new Date(),
        targetType: targetType || "general",
        targetId: targetId || 0,
      };
      setLocalComments(prev => [newComment, ...prev]);
    }
  }, [isConnected, sendComment, targetType, targetId, user]);

  if (variant === "floating") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "fixed bottom-4 right-4 w-80 bg-background border rounded-lg shadow-lg overflow-hidden z-50",
          className
        )}
      >
        <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Collaboration
          </h3>
          <Badge variant="outline" className="text-xs">
            {collaborators.filter(c => c.status === "online").length} en ligne
          </Badge>
        </div>
        <div className="p-3">
          <OnlineCollaborators collaborators={collaborators} />
        </div>
      </motion.div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={cn("space-y-6", className)}>
        <OnlineCollaborators collaborators={collaborators} />
        <Separator />
        <CollaborativeNotifications />
      </div>
    );
  }

  // Variant panel (complet)
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Espace Collaboratif
              {isConnected ? (
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Connecté" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-gray-400" title="Déconnecté" />
              )}
            </CardTitle>
            <CardDescription>
              {isConnected 
                ? `${collaborators.filter(c => c.status === "online").length} collaborateur(s) en ligne`
                : connectionError || "Connexion en cours..."
              }
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="presence" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Présence</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activité</span>
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Discussion</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presence">
            <OnlineCollaborators collaborators={collaborators} />
            <Separator className="my-4" />
            <CollaborativeNotifications />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityFeed activities={activities} />
          </TabsContent>

          <TabsContent value="comments">
            <CommentsSection
              comments={comments}
              targetType={targetType}
              targetId={targetId}
              onAddComment={handleAddComment}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default CollaborationPanel;
