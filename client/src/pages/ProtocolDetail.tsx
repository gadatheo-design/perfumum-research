// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Beaker, Clock, Target, Wrench, DollarSign } from "lucide-react";

export default function ProtocolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: protocol, isLoading } = trpc.protocols.getById.useQuery({ slug });

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "débutant": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "intermédiaire": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "avancé": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "expert": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Protocole non trouvé</p>
        <Link href="/protocoles">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux protocoles
          </Button>
        </Link>
      </div>
    );
  }

  const equipmentList = safeJsonParse(protocol.equipment_required, null);

  return (
    <div className="container py-8">
      <Link href="/protocoles">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux protocoles
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Beaker className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{protocol.name}</h1>
          {protocol.difficulty_level && (
            <Badge variant="outline" className={getDifficultyColor(protocol.difficulty_level)}>
              {protocol.difficulty_level}
            </Badge>
          )}
        </div>
        
        {protocol.category && (
          <Badge variant="secondary" className="mb-4">
            {protocol.category}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {protocol.objective && (
          <Card className="bg-card/50 border-border/50 md:col-span-3">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Objectif</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{protocol.objective}</p>
            </CardContent>
          </Card>
        )}
        
        {protocol.duration && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Durée</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-foreground">{protocol.duration}</p>
            </CardContent>
          </Card>
        )}
        
        {protocol.estimated_cost && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle>Coût estimé</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-foreground">€{protocol.estimated_cost}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {protocol.summary && (
        <Card className="bg-card/50 border-border/50 mb-6">
          <CardHeader>
            <CardTitle>Résumé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{protocol.summary}</p>
          </CardContent>
        </Card>
      )}

      {equipmentList && Array.isArray(equipmentList) && equipmentList.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              <CardTitle>Équipement requis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {equipmentList.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
