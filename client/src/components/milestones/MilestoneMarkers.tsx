// @ts-nocheck
import { trpc } from "@/lib/trpc";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MILESTONE_ICONS = {
  prototype: "🧪",
  discovery: "💡",
  collaboration: "🤝",
  publication: "📄",
  other: "📌",
} as const;

const MILESTONE_COLORS = {
  prototype: "bg-blue-500",
  discovery: "bg-yellow-500",
  collaboration: "bg-green-500",
  publication: "bg-purple-500",
  other: "bg-gray-500",
} as const;

interface MilestoneMarkersProps {
  timelineData: Array<{ month: string; count: number; cumulative: number; molecules: string[] }>;
}

export function MilestoneMarkers({ timelineData }: MilestoneMarkersProps) {
  const { data: milestones = [] } = trpc.milestones.list.useQuery();

  if (milestones.length === 0) return null;

  // Group milestones by month
  const milestonesByMonth = milestones.reduce((acc, milestone) => {
    const date = new Date(milestone.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(milestone);
    return acc;
  }, {} as Record<string, typeof milestones>);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <TooltipProvider>
        {timelineData.map((dataPoint, index) => {
          const monthMilestones = milestonesByMonth[dataPoint.month] || [];
          if (monthMilestones.length === 0) return null;

          // Calculate position based on index
          const xPercent = (index / (timelineData.length - 1)) * 100;

          return (
            <div
              key={dataPoint.month}
              className="absolute pointer-events-auto"
              style={{
                left: `${xPercent}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {monthMilestones.map((milestone) => (
                <Tooltip key={milestone.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer shadow-lg ${
                        MILESTONE_COLORS[milestone.type as keyof typeof MILESTONE_COLORS]
                      }`}
                    >
                      {MILESTONE_ICONS[milestone.type as keyof typeof MILESTONE_ICONS]}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">{milestone.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(milestone.date).toLocaleDateString("fr-FR")}
                      </p>
                      {milestone.description && (
                        <p className="text-sm">{milestone.description}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
