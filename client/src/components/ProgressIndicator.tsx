import { safeToFixed } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

export function ProgressIndicator({ start, end, change, changePercent, label }: {
  start: number;
  end: number;
  change: number;
  changePercent: number;
  label: string;
}) {
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';
  
  // Vérifications de type pour éviter les erreurs toFixed
  const safeChange = typeof change === 'number' ? (change).toFixed(1) : '0.0';
  const safeStart = typeof start === 'number' ? (start).toFixed(1) : '0.0';
  const safeEnd = typeof end === 'number' ? (end).toFixed(1) : '0.0';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
          <TrendIcon className="h-4 w-4" />
          <span>{change >= 0 ? '+' : ''}{safeChange}%</span>
        </div>
      </div>
      <Progress value={end} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Début: {safeStart}%</span>
        <span className="font-medium">Actuel: {safeEnd}%</span>
      </div>
    </div>
  );
}
