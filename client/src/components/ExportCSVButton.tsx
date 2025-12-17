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
  // Use tRPC queries for each entity type
  const moleculesQuery = trpc.export.molecules.useQuery(undefined, { enabled: false });
  const recettesQuery = trpc.export.recettes.useQuery(undefined, { enabled: false });
  const accordsQuery = trpc.export.accords.useQuery(undefined, { enabled: false });
  const famillesQuery = trpc.export.familles.useQuery(undefined, { enabled: false });
  const matieresQuery = trpc.export.matieres.useQuery(undefined, { enabled: false });
  
  const handleExport = async () => {
    try {
      let csvData: string | undefined;
      
      // Trigger the appropriate query based on entity type
      switch (entityType) {
        case "molecules":
          const moleculesResult = await moleculesQuery.refetch();
          csvData = moleculesResult.data;
          break;
        case "recettes":
          const recettesResult = await recettesQuery.refetch();
          csvData = recettesResult.data;
          break;
        case "accords":
          const accordsResult = await accordsQuery.refetch();
          csvData = accordsResult.data;
          break;
        case "familles":
          const famillesResult = await famillesQuery.refetch();
          csvData = famillesResult.data;
          break;
        case "matieres":
          const matieresResult = await matieresQuery.refetch();
          csvData = matieresResult.data;
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      
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
  
  // Determine if any query is loading
  const isLoading = 
    moleculesQuery.isFetching || 
    recettesQuery.isFetching || 
    accordsQuery.isFetching || 
    famillesQuery.isFetching || 
    matieresQuery.isFetching;
  
  return (
    <Button
      onClick={handleExport}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
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
