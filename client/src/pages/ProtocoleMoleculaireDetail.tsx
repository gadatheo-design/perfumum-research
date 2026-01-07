import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { FlaskConical, ArrowLeft, Layers, Target, Beaker, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function ProtocoleMoleculaireDetail() {
  const params = useParams();
  const protocolId = parseInt(params.id || "0");

  const { data: protocol, isLoading } = trpc.molecularProtocols.getById.useQuery(protocolId);

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-96 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Protocole non trouvé</h1>
        <Link href="/protocoles-moleculaires">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux protocoles
          </Button>
        </Link>
      </div>
    );
  }

  type MoleculeEntry = {
    molecule: string;
    percentage: number;
    function: string;
    warning?: string;
  };

  const renderPalette = (
    palette: MoleculeEntry[] | null,
    title: string,
    color: string,
    bgColor: string
  ) => {
    if (!palette || palette.length === 0) return null;

    return (
      <Card>
        <CardHeader className={`${bgColor}`}>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className={`h-3 w-3 rounded-full ${color}`}></div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {palette.map((entry, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm text-stone-800">{entry.molecule}</p>
                  <p className="text-xs text-stone-500">{entry.function}</p>
                </div>
                <Badge variant="outline" className="ml-2">
                  {entry.percentage}%
                </Badge>
              </div>
              {entry.warning && (
                <div className="flex items-start gap-2 p-2 bg-amber-50 rounded text-xs text-amber-800">
                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{entry.warning}</span>
                </div>
              )}
              <Progress value={entry.percentage} className="h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/30 to-indigo-50/20">
      {/* Breadcrumbs */}
      <div className="container pt-4">
        <Breadcrumbs currentLabel={protocol.name || "Protocole"} />
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-900 text-white py-12">
        <div className="container">
          <Link href="/protocoles-moleculaires">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux protocoles
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">{protocol.name}</h1>
        </div>
      </div>

      <div className="container py-8">
        {/* Objectif et architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {protocol.objective && (
            <Card>
              <CardHeader className="bg-gradient-to-br from-violet-50 to-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-violet-600" />
                  Objectif
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-stone-600 leading-relaxed">{protocol.objective}</p>
              </CardContent>
            </Card>
          )}
          {protocol.olfactiveArchitecture && (
            <Card>
              <CardHeader className="bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-600" />
                  Architecture Olfactive
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-stone-600 leading-relaxed">{protocol.olfactiveArchitecture}</p>
                {protocol.function && (
                  <div className="mt-3 p-3 bg-purple-50 rounded">
                    <p className="text-xs font-medium text-purple-900 mb-1">Fonction</p>
                    <p className="text-sm text-purple-800">{protocol.function}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ratios visuels */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-amber-50 via-rose-50 to-stone-50">
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-violet-600" />
              Ratios de Formulation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-3">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-stone-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(protocol.headRatio || 0) * 3.52} 352`}
                      className="text-amber-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-amber-900">{protocol.headRatio}%</span>
                  </div>
                </div>
                <p className="font-semibold text-amber-900">Notes de Tête</p>
                <p className="text-xs text-stone-500 mt-1">Volatilité haute</p>
              </div>
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-3">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-stone-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(protocol.heartRatio || 0) * 3.52} 352`}
                      className="text-rose-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-rose-900">{protocol.heartRatio}%</span>
                  </div>
                </div>
                <p className="font-semibold text-rose-900">Notes de Cœur</p>
                <p className="text-xs text-stone-500 mt-1">Volatilité moyenne</p>
              </div>
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-3">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-stone-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(protocol.baseRatio || 0) * 3.52} 352`}
                      className="text-stone-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-stone-900">{protocol.baseRatio}%</span>
                  </div>
                </div>
                <p className="font-semibold text-stone-900">Notes de Fond</p>
                <p className="text-xs text-stone-500 mt-1">Volatilité basse</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Palettes moléculaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {renderPalette(
            protocol.headPalette as MoleculeEntry[] | null,
            "Palette de Tête",
            "bg-amber-500",
            "bg-gradient-to-br from-amber-50 to-yellow-50"
          )}
          {renderPalette(
            protocol.heartPalette as MoleculeEntry[] | null,
            "Palette de Cœur",
            "bg-rose-500",
            "bg-gradient-to-br from-rose-50 to-pink-50"
          )}
          {renderPalette(
            protocol.basePalette as MoleculeEntry[] | null,
            "Palette de Fond",
            "bg-stone-600",
            "bg-gradient-to-br from-stone-50 to-slate-50"
          )}
        </div>

        {/* Protocole de formulation */}
        {protocol.formulationProtocol && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50">
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-indigo-600" />
                Protocole de Formulation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                  {protocol.formulationProtocol}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
