// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Beaker, FlaskConical } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export function RecentActivity() {
  const { data: activity, isLoading } = trpc.home.getRecentActivity.useQuery();

  if (isLoading) {
    return (
      <Card className="brutal-border animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Activité récente</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activity || activity.length === 0) {
    return null;
  }

  return (
    <Card className="brutal-border animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>Activité récente</CardTitle>
        </div>
        <CardDescription>Les 10 derniers ajouts à la base de données</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activity.map((entry, index) => {
            const isRecette = entry.type === 'recette';
            const item = entry.item as any;
            const href = isRecette ? `/recette/${item.id}` : `/molecule/${item.id}`;
            
            return (
              <Link key={`${entry.type}-${item.id}`} href={href}>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isRecette ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {isRecette ? (
                      <FlaskConical className="h-5 w-5" />
                    ) : (
                      <Beaker className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                        {item.name}
                      </p>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {isRecette ? 'Recette' : 'Molécule'}
                      </Badge>
                    </div>
                    {item.profilOlfactif && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.profilOlfactif}
                      </p>
                    )}
                    {item.familleChimique && (
                      <p className="text-xs text-muted-foreground">
                        {item.familleChimique}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
