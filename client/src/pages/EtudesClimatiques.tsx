import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Thermometer, Cloud, Leaf, FlaskConical, BookOpen } from 'lucide-react';
import { Link } from 'wouter';

export default function EtudesClimatiques() {
  const { data: studies, isLoading } = trpc.climateStudies.list.useQuery();

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Études Climatiques</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
      field_observation: { variant: "secondary", label: "Observation terrain" },
      lab_translation: { variant: "default", label: "Traduction labo" },
      completed: { variant: "outline", label: "Complété" },
    };
    const config = variants[status] || variants.field_observation;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Études Climatiques</h1>
        <p className="text-muted-foreground text-lg">
          Recherches olfactives situées liées aux conditions climatiques et géographiques
        </p>
      </div>

      {studies && studies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Cloud className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Aucune étude climatique disponible pour le moment.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {studies?.map((study) => (
          <Link key={study.id} href={`/etudes-climatiques/${study.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl line-clamp-2">{study.name}</CardTitle>
                  {study.status && getStatusBadge(study.status)}
                </div>
                <CardDescription className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {study.collection}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {study.concept && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{study.concept}</p>
                )}

                <div className="space-y-2 text-sm">
                  {study.zone && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="line-clamp-1">{study.zone}</span>
                    </div>
                  )}
                  {study.altitude && (
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="line-clamp-1">{study.altitude}</span>
                    </div>
                  )}
                  {study.axis && (
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="line-clamp-1">Axe : {study.axis}</span>
                    </div>
                  )}
                </div>

                {study.thresholdOdor === 'yes' && (
                  <Badge variant="outline" className="w-fit">
                    <FlaskConical className="w-3 h-3 mr-1" />
                    Odeur de seuil
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
