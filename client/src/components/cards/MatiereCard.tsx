import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteBadge, StatusBadge, FamilyBadge } from "@/components/ui/badge-custom";

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

  const families = olfactiveFamily ? JSON.parse(olfactiveFamily as any) : [];

  return (
    <Link href={`/laboratoire/matieres/${id}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg mb-1 truncate">{name}</CardTitle>
                {botanicalName && (
                  <CardDescription className="text-xs italic truncate">
                    {botanicalName}
                  </CardDescription>
                )}
              </div>
              {status && <StatusBadge status={status} />}
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-2">
              <FamilyBadge family={typeLabels[type] || type} />
              {note && <NoteBadge note={note} />}
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {origin && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Origine :</span> {origin}
              </p>
            )}
            
            {families.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {families.slice(0, 3).map((family: string, index: number) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
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
              <p className="text-sm text-muted-foreground line-clamp-2">
                {olfactiveProfile}
              </p>
            )}
          </CardContent>
      </Card>
    </Link>
  );
}
