// @ts-nocheck
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Layers, Wind, Droplets, Mountain, Sparkles, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordCardProps {
  id: number;
  name: string;
  familyName?: string;
  texture?: string;
  description?: string;
  aromaticProfile?: string[];
}

export function AccordCard({
  id,
  name,
  familyName,
  texture,
  description,
  aromaticProfile,
}: AccordCardProps) {
  const textureLabels: Record<string, string> = {
    sec: "Sec",
    humide: "Humide",
    lactone: "Lactonique",
    resine: "Résineux",
    pierre: "Minéral",
    air: "Aérien",
  };

  // Icônes et couleurs par texture
  const textureConfig: Record<string, { icon: typeof Wind; color: string; gradient: string }> = {
    sec: { icon: Wind, color: "text-amber-600 dark:text-amber-400", gradient: "from-amber-500 to-orange-500" },
    humide: { icon: Droplets, color: "text-blue-600 dark:text-blue-400", gradient: "from-blue-500 to-cyan-500" },
    lactone: { icon: Sparkles, color: "text-rose-600 dark:text-rose-400", gradient: "from-rose-500 to-pink-500" },
    resine: { icon: Layers, color: "text-orange-600 dark:text-orange-400", gradient: "from-orange-500 to-red-500" },
    pierre: { icon: Mountain, color: "text-stone-600 dark:text-stone-400", gradient: "from-stone-500 to-gray-500" },
    air: { icon: Cloud, color: "text-sky-600 dark:text-sky-400", gradient: "from-sky-500 to-blue-500" },
  };

  const config = texture ? textureConfig[texture] : null;
  const TextureIcon = config?.icon || Layers;
  const profiles = aromaticProfile ? JSON.parse(aromaticProfile as any) : [];

  return (
    <Link href={`/laboratoire/accords/${id}`} className="block h-full group">
      <Card className={cn(
        "h-full transition-all duration-300 relative overflow-hidden",
        "border-border/50 hover:border-primary/30",
        "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      )}>
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Top accent line based on texture */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-0.5 transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100",
          config ? `bg-gradient-to-r ${config.gradient}` : "bg-gradient-to-r from-primary to-accent"
        )} />
        
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors duration-200">
                {name}
              </CardTitle>
              {familyName && (
                <CardDescription className="text-xs flex items-center gap-1.5">
                  <Layers className="h-3 w-3 shrink-0" />
                  {familyName}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {texture && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs gap-1 transition-colors duration-200",
                    config?.color
                  )}
                >
                  <TextureIcon className="h-3 w-3" />
                  {textureLabels[texture] || texture}
                </Badge>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-3">
          {profiles.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profiles.slice(0, 4).map((profile: string, index: number) => (
                <span
                  key={index}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full transition-all duration-200",
                    "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  {profile}
                </span>
              ))}
              {profiles.length > 4 && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  +{profiles.length - 4}
                </span>
              )}
            </div>
          )}

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
