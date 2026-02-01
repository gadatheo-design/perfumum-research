/**
 * IFRAStatusBadge - Composant pour afficher le statut réglementaire IFRA
 * 
 * Affiche un badge coloré selon le statut:
 * - Rouge: Interdit (banned)
 * - Orange: Restreint (restricted)
 * - Jaune: Spécification requise (specification_required)
 * - Vert: Non réglementé (not_regulated)
 */

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, Ban, CheckCircle, AlertCircle } from "lucide-react";

interface IFRAStatusBadgeProps {
  status: 'banned' | 'restricted' | 'specification_required' | 'not_regulated' | null;
  maxPercent?: number | null;
  reason?: string | null;
  compact?: boolean;
}

export function IFRAStatusBadge({ 
  status, 
  maxPercent, 
  reason,
  compact = false 
}: IFRAStatusBadgeProps) {
  if (!status || status === 'not_regulated') {
    if (compact) return null;
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30">
        <CheckCircle className="w-3 h-3 mr-1" />
        Non réglementé
      </Badge>
    );
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'banned':
        return {
          label: 'Interdit IFRA',
          shortLabel: 'Interdit',
          icon: Ban,
          className: 'bg-red-500/10 text-red-700 border-red-500/30',
          tooltipBg: 'bg-red-50 border-red-200',
        };
      case 'restricted':
        return {
          label: `Restreint IFRA${maxPercent ? ` (max ${maxPercent}%)` : ''}`,
          shortLabel: `Max ${maxPercent || '?'}%`,
          icon: AlertTriangle,
          className: 'bg-orange-500/10 text-orange-700 border-orange-500/30',
          tooltipBg: 'bg-orange-50 border-orange-200',
        };
      case 'specification_required':
        return {
          label: 'Spécification requise',
          shortLabel: 'Spéc. req.',
          icon: AlertCircle,
          className: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
          tooltipBg: 'bg-yellow-50 border-yellow-200',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={config.className}>
              <Icon className="w-3 h-3" />
            </Badge>
          </TooltipTrigger>
          <TooltipContent className={config.tooltipBg}>
            <div className="text-sm">
              <p className="font-medium">{config.label}</p>
              {reason && <p className="text-xs mt-1 opacity-80">{reason}</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={config.className}>
            <Icon className="w-3 h-3 mr-1" />
            {config.shortLabel}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className={config.tooltipBg}>
          <div className="text-sm max-w-xs">
            <p className="font-medium">{config.label}</p>
            {reason && <p className="text-xs mt-1 opacity-80">{reason}</p>}
            <p className="text-xs mt-1 text-muted-foreground">
              Source: IFRA 51st Amendment (2024)
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default IFRAStatusBadge;
