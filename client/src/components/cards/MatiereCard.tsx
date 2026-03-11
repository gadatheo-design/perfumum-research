import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteBadge, StatusBadge, FamilyBadge } from "@/components/ui/badge-custom";
import { ChevronRight, MapPin, Leaf } from "lucide-react";
import { cn , safeJsonParse} from "@/lib/utils";

interface MatiereCardProps {
  id: number;
  name: string;
  botanicalName?: string;
  type: string;
  olfactiveFamily?: string[];
  note?: string;
  origin?: string;
  status?: string;
  olfactiveProfile?: string;
}

export function MatiereCard({
  id,
  name,
  botanicalName,
  type,
  olfactiveFamily,
  note,
  origin,
  status,
  olfactiveProfile,
}: MatiereCardProps) {
  const typeLabels: Record<string, string> = {
    huile_essentielle: "Huile essentielle",
    absolu: "Absolu",
    resinoid: "Résinoïde",
    concrete: "Concrète",
    co2: "CO2",
    teinture: "Teinture",
    poudre: "Poudre",
    alcoolat: "Alcoolat",
    autre: "Autre",
  };

  // Couleurs par type de matière
  const typeColors: Record<string, { bg: string; border: string; text: string }> = {
    huile_essentielle: { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200/50 dark:border-emerald-800/30", text: "text-emerald-700 dark:text-emerald-400" },
    absolu: { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200/50 dark:border-amber-800/30", text: "text-amber-700 dark:text-amber-400" },
    resinoid: { bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200/50 dark:border-orange-800/30", text: "text-orange-700 dark:text-orange-400" },
    concrete: { bg: "bg-rose-50 dark:bg-rose-950/30", border: "border-rose-200/50 dark:border-rose-800/30", text: "text-rose-700 dark:text-rose-400" },
    co2: { bg: "bg-cyan-50 dark:bg-cyan-950/30", border: "border-cyan-200/50 dark:border-cyan-800/30", text: "text-cyan-700 dark:text-cyan-400" },
    teinture: { bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200/50 dark:border-violet-800/30", text: "text-violet-700 dark:text-violet-400" },
    poudre: { bg: "bg-stone-50 dark:bg-stone-950/30", border: "border-stone-200/50 dark:border-stone-800/30", text: "text-stone-700 dark:text-stone-400" },
    alcoolat: { bg: "bg-sky-50 dark:bg-sky-950/30", border: "border-sky-200/50 dark:border-sky-800/30", text: "text-sky-700 dark:text-sky-400" },
    autre: { bg: "bg-gray-50 dark:bg-gray-950/30", border: "border-gray-200/50 dark:border-gray-800/30", text: "text-gray-700 dark:text-gray-400" },
  };

  const colors = typeColors[type] || typeColors.autre;
  const families = safeJsonParse(olfactiveFamily, []);

  return (
    <Link href={`/laboratoire/matieres/${id}`} className="block h-full group">
      <Card className={cn(
        "h-full transition-all duration-300 relative overflow-hidden",
        "border-border/50 hover:border-primary/30",
        "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      )}>
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Top accent line based on type */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-0.5 transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100",
          type === "huile_essentielle" && "bg-gradient-to-r from-emerald-500 to-teal-500",
          type === "absolu" && "bg-gradient-to-r from-amber-500 to-yellow-500",
          type === "resinoid" && "bg-gradient-to-r from-orange-500 to-red-500",
          type === "concrete" && "bg-gradient-to-r from-rose-500 to-pink-500",
          type === "co2" && "bg-gradient-to-r from-cyan-500 to-blue-500",
          type === "teinture" && "bg-gradient-to-r from-violet-500 to-purple-500",
          !["huile_essentielle", "absolu", "resinoid", "concrete", "co2", "teinture"].includes(type) && "bg-gradient-to-r from-primary to-accent"
        )} />
        
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 truncate group-hover:text-primary transition-colors duration-200">
                {name}
              </CardTitle>
              {botanicalName && (
                <CardDescription className="text-xs italic truncate flex items-center gap-1">
                  <Leaf className="h-3 w-3 shrink-0" />
                  {botanicalName}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              {status && <StatusBadge status={status} />}
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            <FamilyBadge family={typeLabels[type] || type} />
            {note && <NoteBadge note={note} />}
          </div>
        </CardHeader>

        <CardContent className="relative space-y-3">
          {origin && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0 text-primary/60" />
              <span className="font-medium">Origine :</span> {origin}
            </p>
          )}
          
          {families.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {families.slice(0, 3).map((family: string, index: number) => (
                <span
                  key={index}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full transition-colors duration-200",
                    colors.bg, colors.text
                  )}
                >
                  {family}
                </span>
              ))}
              {families.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  +{families.length - 3}
                </span>
              )}
            </div>
          )}

          {olfactiveProfile && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {olfactiveProfile}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
