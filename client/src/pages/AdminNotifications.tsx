// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2,
  Trash2,
  ExternalLink,
  Filter,
  Loader2,
  RefreshCw
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const NOTIFICATION_TYPES = [
  { value: 'all', label: 'Tous les types' },
  { value: 'import_orphan_molecules', label: 'Import molécules orphelines' },
  { value: 'new_contribution', label: 'Nouvelle contribution' },
  { value: 'validation_required', label: 'Validation requise' },
  { value: 'classification_milestone', label: 'Jalon de classification' },
  { value: 'system_alert', label: 'Alerte système' },
  { value: 'data_quality', label: 'Qualité des données' },
  { value: 'other', label: 'Autre' },
];

const SEVERITY_ICONS = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle2,
};

const SEVERITY_COLORS = {
  info: "text-blue-500 bg-blue-500/10",
  warning: "text-amber-500 bg-amber-500/10",
  error: "text-red-500 bg-red-500/10",
  success: "text-green-500 bg-green-500/10",
};

export default function AdminNotifications() {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<number>>(new Set());

  const { data, isLoading, refetch } = trpc.notifications.list.useQuery({
    type: typeFilter === 'all' ? undefined : typeFilter,
    unreadOnly: showUnreadOnly,
    limit: 100,
  });

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
      setSelectedNotifications(new Set());
    },
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleSelectAll = () => {
    if (selectedNotifications.size === notifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map(n => n.id)));
    }
  };

  const handleToggleNotification = (id: number) => {
    const newSet = new Set(selectedNotifications);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedNotifications(newSet);
  };

  const handleBatchDelete = () => {
    selectedNotifications.forEach(id => {
      deleteMutation.mutate(id);
    });
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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Bell className="h-8 w-8 text-primary" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : 'Toutes les notifications sont lues'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            {unreadCount > 0 && (
              <Button 
                variant="outline"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Tout marquer lu
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[250px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type de notification" />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="unreadOnly"
                  checked={showUnreadOnly}
                  onCheckedChange={(checked) => setShowUnreadOnly(checked === true)}
                />
                <label htmlFor="unreadOnly" className="text-sm cursor-pointer">
                  Non lues uniquement
                </label>
              </div>

              {selectedNotifications.size > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleBatchDelete}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer ({selectedNotifications.size})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Liste des Notifications</CardTitle>
                <CardDescription>
                  {notifications.length} notification(s)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Aucune notification</h3>
                <p className="text-muted-foreground mt-2">
                  Les notifications apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-4">
                  <Checkbox
                    checked={selectedNotifications.size === notifications.length && notifications.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium flex-1">Notification</span>
                  <span className="text-sm font-medium w-32 hidden md:block">Type</span>
                  <span className="text-sm font-medium w-32 hidden lg:block">Date</span>
                  <span className="text-sm font-medium w-24">Actions</span>
                </div>

                {/* Table Body */}
                <div className="divide-y">
                  {notifications.map((notification) => {
                    const SeverityIcon = SEVERITY_ICONS[notification.severity as keyof typeof SEVERITY_ICONS] || Info;
                    const severityColor = SEVERITY_COLORS[notification.severity as keyof typeof SEVERITY_COLORS] || "text-muted-foreground bg-muted";
                    const link = getNotificationLink(notification);

                    return (
                      <div 
                        key={notification.id} 
                        className={`px-4 py-3 flex items-center gap-4 hover:bg-muted/30 transition-colors ${
                          !notification.isRead ? 'bg-primary/5' : ''
                        }`}
                      >
                        <Checkbox
                          checked={selectedNotifications.has(notification.id)}
                          onCheckedChange={() => handleToggleNotification(notification.id)}
                        />
                        <div className="flex-1 min-w-0 flex items-start gap-3">
                          <div className={`p-2 rounded-full ${severityColor}`}>
                            <SeverityIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{notification.title}</p>
                              {!notification.isRead && (
                                <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        <div className="w-32 hidden md:block">
                          <Badge variant="outline" className="truncate max-w-full">
                            {NOTIFICATION_TYPES.find(t => t.value === notification.type)?.label || notification.type}
                          </Badge>
                        </div>
                        <div className="w-32 hidden lg:block text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </div>
                        <div className="w-24 flex items-center gap-1">
                          {link && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={link}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsReadMutation.mutate(notification.id)}
                              disabled={markAsReadMutation.isPending}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteMutation.mutate(notification.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
