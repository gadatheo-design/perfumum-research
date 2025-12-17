import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type EntityType = "molecules" | "recettes" | "accords" | "familles" | "matieres";

interface ExportCSVButtonProps {
  entityType: EntityType;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const entityLabels: Record<EntityType, string> = {
  molecules: "Molécules",
  recettes: "Recettes",
  accords: "Accords",
  familles: "Familles",
  matieres: "Matières Premières",
};

export function ExportCSVButton({ 
  entityType, 
  label,
  variant = "outline",
  size = "default",
  className = ""
}: ExportCSVButtonProps) {
  // Use a single query based on entityType
  const query = trpc.export[entityType].useQuery(undefined, { enabled: false });
  
  const handleExport = async () => {
    try {
      const result = await query.refetch();
      const csvData = result.data;
      
      if (!csvData) {
        throw new Error("No data received from server");
      }
      
      // Create a blob and download it
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfumum_${entityType}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Export CSV réussi : ${entityLabels[entityType]}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Erreur lors de l'export : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };
  
  return (
    <Button
      onClick={handleExport}
      disabled={query.isFetching}
      variant={variant}
      size={size}
      className={className}
    >
      {query.isFetching ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Export en cours...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          {label || `Exporter ${entityLabels[entityType]}`}
        </>
      )}
    </Button>
  );
}
