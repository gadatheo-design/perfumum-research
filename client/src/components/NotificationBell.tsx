import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  Bell, 
  BellDot, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2,
  Trash2,
  ExternalLink
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const SEVERITY_ICONS = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle2,
};

const SEVERITY_COLORS = {
  info: "text-blue-500",
  warning: "text-amber-500",
  error: "text-red-500",
  success: "text-green-500",
};

export function NotificationBell() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.notifications.list.useQuery({ limit: 20 });

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
    },
  });

  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      toast({
        title: "Notifications marquées comme lues",
        description: "Toutes les notifications ont été marquées comme lues",
      });
    },
  });

  const deleteMutation = trpc.notifications.delete.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
    },
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleMarkAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const getNotificationLink = (notification: typeof notifications[0]) => {
    switch (notification.type) {
      case 'import_orphan_molecules':
        return '/admin/orphan-molecules';
      case 'new_contribution':
      case 'validation_required':
        return '/admin/validation';
      case 'classification_milestone':
        return '/admin/progress-report';
      default:
        return null;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellDot className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Tout marquer lu
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Chargement...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Aucune notification
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            {notifications.map((notification) => {
              const SeverityIcon = SEVERITY_ICONS[notification.severity as keyof typeof SEVERITY_ICONS] || Info;
              const severityColor = SEVERITY_COLORS[notification.severity as keyof typeof SEVERITY_COLORS] || "text-muted-foreground";
              const link = getNotificationLink(notification);

              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                    !notification.isRead ? 'bg-primary/5' : ''
                  }`}
                  onSelect={(e) => {
                    if (!notification.isRead) {
                      markAsReadMutation.mutate(notification.id);
                    }
                    if (link) {
                      setOpen(false);
                    }
                  }}
                >
                  {link ? (
                    <Link href={link} className="w-full">
                      <NotificationContent 
                        notification={notification}
                        SeverityIcon={SeverityIcon}
                        severityColor={severityColor}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                        hasLink={true}
                      />
                    </Link>
                  ) : (
                    <NotificationContent 
                      notification={notification}
                      SeverityIcon={SeverityIcon}
                      severityColor={severityColor}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                      hasLink={false}
                    />
                  )}
                </DropdownMenuItem>
              );
            })}
          </ScrollArea>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/notifications" className="w-full justify-center">
            Voir toutes les notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationContent({ 
  notification, 
  SeverityIcon, 
  severityColor, 
  onMarkAsRead, 
  onDelete,
  hasLink 
}: {
  notification: {
    id: number;
    title: string;
    message: string;
    severity: string;
    isRead: boolean;
    createdAt: Date;
  };
  SeverityIcon: React.ComponentType<{ className?: string }>;
  severityColor: string;
  onMarkAsRead: (id: number, e: React.MouseEvent) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
  hasLink: boolean;
}) {
  return (
    <div className="w-full">
      <div className="flex items-start gap-2 w-full">
        <SeverityIcon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${severityColor}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">{notification.title}</p>
            {!notification.isRead && (
              <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), { 
                addSuffix: true, 
                locale: fr 
              })}
            </p>
            <div className="flex items-center gap-1">
              {hasLink && (
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              )}
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => onMarkAsRead(notification.id, e)}
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={(e) => onDelete(notification.id, e)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
