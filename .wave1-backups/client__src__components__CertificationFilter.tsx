// @ts-nocheck
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  ShieldCheck, 
  TreePine, 
  Award, 
  CheckCircle2,
  X
} from "lucide-react";

// Types de certifications disponibles
export type CertificationType = "Bio" | "UEBT" | "Commerce Équitable" | "Rainforest Alliance" | "B Corp" | "ISO 9001" | "COSMOS" | "Artisanal" | "IFRA" | "Origine contrôlée";

// Configuration des certifications avec icônes et couleurs
export const certificationConfig: Record<CertificationType, { icon: React.ReactNode; color: string; description: string }> = {
  "Bio": {
    icon: <Leaf className="h-3 w-3" />,
    color: "bg-green-500 text-white hover:bg-green-600",
    description: "Agriculture biologique certifiée"
  },
  "UEBT": {
    icon: <TreePine className="h-3 w-3" />,
    color: "bg-emerald-500 text-white hover:bg-emerald-600",
    description: "Union for Ethical BioTrade"
  },
  "Commerce Équitable": {
    icon: <ShieldCheck className="h-3 w-3" />,
    color: "bg-amber-500 text-white hover:bg-amber-600",
    description: "Commerce équitable certifié"
  },
  "Rainforest Alliance": {
    icon: <TreePine className="h-3 w-3" />,
    color: "bg-teal-500 text-white hover:bg-teal-600",
    description: "Certification Rainforest Alliance"
  },
  "B Corp": {
    icon: <Award className="h-3 w-3" />,
    color: "bg-blue-500 text-white hover:bg-blue-600",
    description: "Entreprise certifiée B Corporation"
  },
  "ISO 9001": {
    icon: <CheckCircle2 className="h-3 w-3" />,
    color: "bg-slate-500 text-white hover:bg-slate-600",
    description: "Système de management de la qualité"
  },
  "COSMOS": {
    icon: <Leaf className="h-3 w-3" />,
    color: "bg-lime-500 text-white hover:bg-lime-600",
    description: "Cosmétiques biologiques et naturels"
  },
  "Artisanal": {
    icon: <Award className="h-3 w-3" />,
    color: "bg-purple-500 text-white hover:bg-purple-600",
    description: "Production artisanale traditionnelle"
  },
  "IFRA": {
    icon: <ShieldCheck className="h-3 w-3" />,
    color: "bg-indigo-500 text-white hover:bg-indigo-600",
    description: "International Fragrance Association"
  },
  "Origine contrôlée": {
    icon: <CheckCircle2 className="h-3 w-3" />,
    color: "bg-orange-500 text-white hover:bg-orange-600",
    description: "Appellation d'origine contrôlée"
  }
};

// Liste des certifications principales à afficher par défaut
export const mainCertifications: CertificationType[] = ["Bio", "UEBT", "Commerce Équitable"];

interface CertificationFilterProps {
  selectedCertifications: CertificationType[];
  onCertificationChange: (certifications: CertificationType[]) => void;
  availableCertifications?: CertificationType[];
  showAllCertifications?: boolean;
}

export function CertificationFilter({
  selectedCertifications,
  onCertificationChange,
  availableCertifications = Object.keys(certificationConfig) as CertificationType[],
  showAllCertifications = false
}: CertificationFilterProps) {
  const [showAll, setShowAll] = useState(showAllCertifications);

  const displayedCertifications = showAll 
    ? availableCertifications 
    : availableCertifications.filter(c => mainCertifications.includes(c));

  const toggleCertification = (cert: CertificationType) => {
    if (selectedCertifications.includes(cert)) {
      onCertificationChange(selectedCertifications.filter(c => c !== cert));
    } else {
      onCertificationChange([...selectedCertifications, cert]);
    }
  };

  const clearAll = () => {
    onCertificationChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Filtrer par certification</h3>
        {selectedCertifications.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAll}
            className="h-7 text-xs gap-1"
          >
            <X className="h-3 w-3" />
            Effacer ({selectedCertifications.length})
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {displayedCertifications.map((cert) => {
          const config = certificationConfig[cert];
          const isSelected = selectedCertifications.includes(cert);
          
          return (
            <button
              key={cert}
              onClick={() => toggleCertification(cert)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                transition-all duration-200 border-2
                ${isSelected 
                  ? `${config.color} border-transparent shadow-md scale-105` 
                  : 'bg-background border-border hover:border-primary/50 text-foreground'
                }
              `}
              title={config.description}
            >
              {config.icon}
              {cert}
              {isSelected && <CheckCircle2 className="h-3 w-3 ml-1" />}
            </button>
          );
        })}
      </div>

      {!showAll && availableCertifications.length > mainCertifications.length && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setShowAll(true)}
          className="h-auto p-0 text-xs"
        >
          Voir toutes les certifications ({availableCertifications.length - mainCertifications.filter(c => availableCertifications.includes(c)).length} de plus)
        </Button>
      )}

      {showAll && !showAllCertifications && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setShowAll(false)}
          className="h-auto p-0 text-xs"
        >
          Afficher moins
        </Button>
      )}
    </div>
  );
}

// Badge de certification pour affichage individuel
export function CertificationBadge({ certification }: { certification: CertificationType }) {
  const config = certificationConfig[certification];
  if (!config) return <Badge variant="secondary">{certification}</Badge>;
  
  return (
    <Badge className={`${config.color} gap-1`}>
      {config.icon}
      {certification}
    </Badge>
  );
}
