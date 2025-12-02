import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Calendar, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";

export function Timeline() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { data: milestones = [], isLoading } = trpc.timeline.list.useQuery();
  const { data: stats } = trpc.timeline.stats.useQuery();

  // Group milestones by quarter
  const groupedByQuarter = milestones.reduce((acc, milestone) => {
    if (!acc[milestone.quarter]) {
      acc[milestone.quarter] = [];
    }
    acc[milestone.quarter].push(milestone);
    return acc;
  }, {} as Record<string, typeof milestones>);

  // Get unique years
  const years = Array.from(new Set(milestones.map((m) => m.year))).sort();

  // Filter by year if selected
  const filteredQuarters = selectedYear
    ? Object.keys(groupedByQuarter).filter((q) => q.startsWith(String(selectedYear)))
    : Object.keys(groupedByQuarter);

  // Status icons and colors
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "delayed":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: "Terminé",
      in_progress: "En cours",
      planned: "Planifié",
      delayed: "Retardé",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800 border-green-200",
      in_progress: "bg-blue-100 text-blue-800 border-blue-200",
      planned: "bg-gray-100 text-gray-800 border-gray-200",
      delayed: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      research: "bg-purple-100 text-purple-800 border-purple-200",
      formulation: "bg-pink-100 text-pink-800 border-pink-200",
      testing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      documentation: "bg-blue-100 text-blue-800 border-blue-200",
      infrastructure: "bg-green-100 text-green-800 border-green-200",
      collaboration: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      research: "Recherche",
      formulation: "Formulation",
      testing: "Tests",
      documentation: "Documentation",
      infrastructure: "Infrastructure",
      collaboration: "Collaboration",
    };
    return labels[category] || category;
  };

  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, string> = {
      foundation: "Fondation",
      development: "Développement",
      expansion: "Expansion",
      consolidation: "Consolidation",
      innovation: "Innovation",
    };
    return labels[phase] || phase;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "text-red-600 font-bold",
      high: "text-orange-600 font-semibold",
      medium: "text-gray-600",
      low: "text-gray-400",
    };
    return colors[priority] || "text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Calendrier de Recherche</h1>
        </div>
        <p className="text-lg text-gray-600">
          Planification progressive sur 18 mois (extensible à 2-3 ans)
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Terminés</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {stats.byStatus.completed || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>En cours</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {stats.byStatus.in_progress || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Planifiés</CardDescription>
              <CardTitle className="text-3xl text-gray-600">
                {stats.byStatus.planned || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Year filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedYear(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedYear === null
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Toutes les années
        </button>
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedYear === year
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {filteredQuarters.sort().map((quarter) => {
          const quarterMilestones = groupedByQuarter[quarter];
          return (
            <div key={quarter} className="relative">
              {/* Quarter header */}
              <div className="sticky top-16 z-10 bg-background/95 backdrop-blur py-3 mb-4 border-b">
                <h2 className="text-2xl font-bold text-primary">{quarter}</h2>
                <p className="text-sm text-gray-600">
                  {quarterMilestones.length}{" "}
                  {quarterMilestones.length === 1 ? "jalon" : "jalons"}
                </p>
              </div>

              {/* Milestones */}
              <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                {quarterMilestones.map((milestone, idx) => (
                  <div key={milestone.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[29px] top-6">
                      {getStatusIcon(milestone.status)}
                    </div>

                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className={getPriorityColor(milestone.priority)}>
                                {milestone.title}
                              </CardTitle>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className={getStatusColor(milestone.status)}
                              >
                                {getStatusLabel(milestone.status)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getCategoryColor(milestone.category)}
                              >
                                {getCategoryLabel(milestone.category)}
                              </Badge>
                              <Badge variant="outline" className="bg-gray-50">
                                {getPhaseLabel(milestone.phase)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {milestone.description && (
                          <p className="text-gray-700 leading-relaxed">
                            {milestone.description}
                          </p>
                        )}

                        {milestone.progress > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progression</span>
                              <span className="font-semibold">{milestone.progress}%</span>
                            </div>
                            <Progress value={milestone.progress} />
                          </div>
                        )}

                        {milestone.deliverables && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
                              Livrables
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {JSON.parse(milestone.deliverables).map(
                                (deliverable: string, i: number) => (
                                  <li key={i}>{deliverable}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-4 text-sm text-gray-500">
                          {milestone.startDate && (
                            <span>Début : {milestone.startDate}</span>
                          )}
                          {milestone.endDate && (
                            <span>Fin : {milestone.endDate}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
