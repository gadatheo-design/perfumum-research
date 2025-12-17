import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  const profiles = aromaticProfile ? JSON.parse(aromaticProfile as any) : [];

  return (
    <Link href={`/laboratoire/accords/${id}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg mb-1">{name}</CardTitle>
                {familyName && (
                  <CardDescription className="text-xs">
                    {familyName}
                  </CardDescription>
                )}
              </div>
              {texture && (
                <Badge variant="outline" className="text-xs shrink-0">
                  {textureLabels[texture] || texture}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {profiles.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {profiles.slice(0, 4).map((profile: string, index: number) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                  >
                    {profile}
                  </span>
                ))}
                {profiles.length > 4 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    +{profiles.length - 4}
                  </span>
                )}
              </div>
            )}

            {description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {description}
              </p>
            )}
          </CardContent>
      </Card>
    </Link>
  );
}
