import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomBadge } from "@/components/ui/badge-custom";
import { cn } from "@/lib/utils";
import { GammeBadge } from "@/components/GammeBadge";
import { getGammeFromPrototype } from "@/lib/gammeMapping";

interface PrototypeCardProps {
  code: string;
  name: string;
  emoji?: string;
  conceptualAxis?: string;
  sensoryForm?: string;
  color?: "c1" | "c2" | "c3" | "c4";
  href: string;
}

export function PrototypeCard({
  code,
  name,
  emoji,
  conceptualAxis,
  sensoryForm,
  color,
  href,
}: PrototypeCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 duration-300 overflow-hidden group">
          {/* Color accent bar */}
          <div className={cn("h-2", color && `bg-${color}`)} />
          
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {emoji && <span className="text-3xl">{emoji}</span>}
                  <CustomBadge color={color} className="text-xs">
                    {code}
                  </CustomBadge>
                </div>
                <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                  {name}
                </CardTitle>
              </div>
              {getGammeFromPrototype(code) && (
                <GammeBadge 
                  gamme={getGammeFromPrototype(code)!} 
                  size="sm" 
                  showIcon={false}
                />
              )}
            </div>
            {conceptualAxis && (
              <CardDescription className="text-sm italic">
                {conceptualAxis}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent>
            {sensoryForm && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Forme sensible :</span> {sensoryForm}
              </p>
            )}
          </CardContent>
      </Card>
    </Link>
  );
}
