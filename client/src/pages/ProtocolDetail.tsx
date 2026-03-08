// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Beaker, Clock, Target, Wrench, DollarSign, ShieldAlert, CheckCircle2, FileText, ChevronRight } from "lucide-react";

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
  const steps = safeJsonParse(protocol.steps, null);

  return (
    <div className="container py-8 max-w-4xl">
      <Link href="/protocoles">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux protocoles
        </Button>
      </Link>

      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Beaker className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{protocol.name}</h1>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {protocol.difficulty_level && (
            <Badge variant="outline" className={getDifficultyColor(protocol.difficulty_level)}>
              {protocol.difficulty_level}
            </Badge>
          )}
          {protocol.category && (
            <Badge variant="secondary">{protocol.category}</Badge>
          )}
        </div>
        {protocol.objective && (
          <p className="text-muted-foreground text-base leading-relaxed">{protocol.objective}</p>
        )}
      </div>

      {/* Méta-infos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {protocol.duration && (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Durée</span>
              </div>
              <p className="font-semibold text-foreground">{protocol.duration}</p>
            </CardContent>
          </Card>
        )}
        {protocol.estimated_cost && (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Coût estimé</span>
              </div>
              <p className="font-semibold text-foreground">{protocol.estimated_cost}</p>
            </CardContent>
          </Card>
        )}
        {protocol.source_file && (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Source</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{protocol.source_file}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Résumé */}
      {protocol.summary && (
        <Card className="bg-card/50 border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Résumé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{protocol.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Étapes */}
      {steps && Array.isArray(steps) && steps.length > 0 && (
        <Card className="bg-card/50 border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-primary" />
              Protocole — {steps.length} étapes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {steps.map((step: any, index: number) => (
              <div key={index}>
                <div className="flex gap-4 py-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{step.step || index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      {step.duration && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {step.duration}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && <Separator className="opacity-30" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Équipement */}
      {equipmentList && Array.isArray(equipmentList) && equipmentList.length > 0 && (
        <Card className="bg-card/50 border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Équipement requis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {equipmentList.map((item: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Sécurité */}
      {protocol.safety_notes && (
        <Card className="bg-red-500/5 border-red-500/20 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <ShieldAlert className="h-5 w-5" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{protocol.safety_notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Contrôle qualité */}
      {protocol.quality_control && (
        <Card className="bg-green-500/5 border-green-500/20 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              Contrôle qualité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{protocol.quality_control}</p>
          </CardContent>
        </Card>
      )}

      {/* Contenu complet */}
      {protocol.full_content && (
        <Card className="bg-card/50 border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Documentation complète
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
              {protocol.full_content}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
