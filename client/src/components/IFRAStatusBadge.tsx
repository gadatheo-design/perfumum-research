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
          explanation: 'Cette substance est totalement interdite dans les formulations parfumées en raison de risques avérés pour la santé (allergies sévères, toxicité, ou photosensibilisation).',
          action: 'Ne pas utiliser dans les produits finis.',
        };
      case 'restricted':
        return {
          label: `Restreint IFRA${maxPercent ? ` (max ${maxPercent}%)` : ''}`,
          shortLabel: `Max ${maxPercent || '?'}%`,
          icon: AlertTriangle,
          className: 'bg-orange-500/10 text-orange-700 border-orange-500/30',
          tooltipBg: 'bg-orange-50 border-orange-200',
          explanation: maxPercent 
            ? `Concentration maximale autorisée : ${maxPercent}% dans le produit fini. Dépassement interdit pour éviter les réactions allergiques.`
            : 'Concentration limitée selon la catégorie de produit. Vérifier les spécifications IFRA.',
          action: 'Respecter strictement les limites de concentration.',
        };
      case 'specification_required':
        return {
          label: 'Spécification requise',
          shortLabel: 'Spéc. req.',
          icon: AlertCircle,
          className: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
          tooltipBg: 'bg-yellow-50 border-yellow-200',
          explanation: 'Cette substance nécessite des spécifications de qualité particulières (pureté, origine, traitement) pour être conforme.',
          action: 'Vérifier les spécifications du fournisseur avant utilisation.',
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
          <TooltipContent className={`${config.tooltipBg} max-w-sm`}>
            <div className="text-sm space-y-2">
              <p className="font-semibold text-base">{config.label}</p>
              <p className="text-xs leading-relaxed">{config.explanation}</p>
              {reason && <p className="text-xs italic border-l-2 border-current/30 pl-2">{reason}</p>}
              <p className="text-xs font-medium text-current/80">→ {config.action}</p>
              <p className="text-[10px] text-muted-foreground pt-1 border-t border-current/10">
                Source: IFRA 51st Amendment (2024)
              </p>
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
        <TooltipContent className={`${config.tooltipBg} max-w-sm`}>
          <div className="text-sm space-y-2">
            <p className="font-semibold text-base">{config.label}</p>
            <p className="text-xs leading-relaxed">{config.explanation}</p>
            {reason && <p className="text-xs italic border-l-2 border-current/30 pl-2">{reason}</p>}
            <p className="text-xs font-medium text-current/80">→ {config.action}</p>
            <p className="text-[10px] text-muted-foreground pt-1 border-t border-current/10">
              Source: IFRA 51st Amendment (2024)
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default IFRAStatusBadge;
