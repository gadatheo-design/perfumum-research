import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Beaker, Filter, X, ChevronRight, Layers, FlaskConical, Droplets, Wind } from "lucide-react";
import { ViewToggle, type ViewMode } from "@/components/ViewToggle";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { GridSkeleton, FilterBarSkeleton } from "@/components/skeletons";
import formulesData from "../../data/FORMULES_REFERENCE_16.json";

interface Molecule {
  name: string;
  proportion: number;
  role: "tête" | "cœur" | "fond";
}

interface FormuleReference {
  name: string;
  family: string;
  description: string;
  notes_tete: string;
  notes_coeur: string;
  notes_fond: string;
  molecules: Molecule[];
}

const FAMILIES = [
  "Toutes",
  "Fougère",
  "Chypré",
  "Oriental",
  "Floral",
  "Boisé",
  "Hespéridé",
  "Aromatique",
  "Cuir"
];

const FAMILY_STYLES: Record<string, { 
  bg: string; 
  text: string; 
  border: string;
}> = {
  "Fougère": { bg: "bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-500/20" },
  "Chypré": { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-500/20" },
  "Oriental": { bg: "bg-purple-500/10", text: "text-purple-700 dark:text-purple-400", border: "border-purple-500/20" },
  "Floral": { bg: "bg-pink-500/10", text: "text-pink-700 dark:text-pink-400", border: "border-pink-500/20" },
  "Boisé": { bg: "bg-orange-500/10", text: "text-orange-700 dark:text-orange-400", border: "border-orange-500/20" },
  "Hespéridé": { bg: "bg-yellow-500/10", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-500/20" },
  "Aromatique": { bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", border: "border-blue-500/20" },
  "Cuir": { bg: "bg-stone-500/10", text: "text-stone-700 dark:text-stone-400", border: "border-stone-500/20" }
};

const ROLE_STYLES: Record<string, { 
  bg: string; 
  text: string; 
  label: string;
}> = {
  "tête": { bg: "bg-sky-500/10", text: "text-sky-700 dark:text-sky-400", label: "Tête" },
  "cœur": { bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-400", label: "Cœur" },
  "fond": { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", label: "Fond" }
};

const calculateRadarProfile = (molecules: Molecule[]): { axis: string; value: number }[] => {
  const teteTotal = molecules.filter(m => m.role === "tête").reduce((sum, m) => sum + m.proportion, 0);
  const coeurTotal = molecules.filter(m => m.role === "cœur").reduce((sum, m) => sum + m.proportion, 0);
  const fondTotal = molecules.filter(m => m.role === "fond").reduce((sum, m) => sum + m.proportion, 0);

  return [
    { axis: "Intensité", value: Math.min(100, (fondTotal + coeurTotal) * 1.2) },
    { axis: "Fraîcheur", value: Math.min(100, teteTotal * 2) },
    { axis: "Chaleur", value: Math.min(100, fondTotal * 1.8) },
    { axis: "Douceur", value: Math.min(100, coeurTotal * 1.5) },
    { axis: "Épices", value: Math.min(100, (coeurTotal + fondTotal) * 0.8) },
    { axis: "Terreux", value: Math.min(100, fondTotal * 1.3) }
  ];
};

/**
 * FormulesReferenceContent - The core content of the formules reference page
 * 
 * This component contains all the functionality of the FormulesReference page
 * but without the Header/Footer wrapper, making it embeddable in
 * the consolidated RecettesHub page.
 */
export function FormulesReferenceContent() {
  const [selectedFamily, setSelectedFamily] = useState<string>("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormule, setSelectedFormule] = useState<FormuleReference | null>(null);
  const [showFilters, setShowFilters] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("formules-view-mode");
      if (stored === "grid" || stored === "list" || stored === "compact") {
        return stored;
      }
    }
    return "grid";
  });

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("formules-view-mode", mode);
  };

  const formules = formulesData as FormuleReference[];

  const filteredFormules = useMemo(() => {
    let result = formules;
    
    if (selectedFamily !== "Toutes") {
      result = result.filter(f => f.family === selectedFamily);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.family.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [selectedFamily, searchQuery, formules]);

  const familyStyles = (family: string) => FAMILY_STYLES[family] || { 
    bg: "bg-muted", 
    text: "text-muted-foreground", 
    border: "border-muted"
  };

  const familyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    formules.forEach(f => {
      counts[f.family] = (counts[f.family] || 0) + 1;
    });
    return counts;
  }, [formules]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedFamily !== "Toutes") count++;
    return count;
  }, [searchQuery, selectedFamily]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFamily("Toutes");
  };

  // Family options for filter
  const familyOptions = FAMILIES.map(f => ({
    value: f,
    label: f === "Toutes" ? "Toutes les familles" : `${f} (${familyCounts[f] || 0})`
  }));

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="space-y-4">
        {/* Search and Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher une formule..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtres
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <ViewToggle viewMode={viewMode} setViewMode={handleViewChange} />
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FilterSelect
                  label="Famille olfactive"
                  value={selectedFamily}
                  onChange={setSelectedFamily}
                  options={familyOptions}
                />
              </div>
              
              {activeFilterCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredFormules.length} formule{filteredFormules.length > 1 ? "s" : ""} de référence
        </p>
      </div>

      {/* Results Grid */}
      {filteredFormules.length === 0 ? (
        <div className="text-center py-12">
          <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune formule trouvée</h3>
          <p className="text-muted-foreground mb-4">
            Essayez de modifier vos critères de recherche
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <motion.div 
          className={`grid gap-5 ${viewMode === "compact" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : viewMode === "list" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
          }}
        >
          {filteredFormules.map((formule) => {
            const style = familyStyles(formule.family);
            const radarData = calculateRadarProfile(formule.molecules);
            
            return (
              <motion.div
                key={formule.name}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } }
                }}
              >
                <Card 
                  className={`h-full border ${style.border} bg-card overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
                  onClick={() => setSelectedFormule(formule)}
                >
                  <CardHeader className={viewMode === "compact" ? "p-4" : "pb-3"}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <CardTitle className={`${viewMode === "compact" ? "text-base" : "text-lg"} font-semibold leading-tight group-hover:text-primary transition-colors`}>
                        {formule.name}
                      </CardTitle>
                      <Badge className={`${style.bg} ${style.text} border-0 shrink-0`}>
                        {formule.family}
                      </Badge>
                    </div>
                    {viewMode !== "compact" && (
                      <CardDescription className="line-clamp-2">
                        {formule.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  {viewMode !== "compact" && (
                    <CardContent className="pt-0 space-y-3">
                      {/* Notes pyramide */}
                      {["tête", "cœur", "fond"].map((role) => {
                        const roleStyle = ROLE_STYLES[role];
                        const notes = role === "tête" ? formule.notes_tete : role === "cœur" ? formule.notes_coeur : formule.notes_fond;
                        if (!notes) return null;
                        
                        return (
                          <div key={role} className="flex items-start gap-2">
                            <Badge variant="outline" className={`${roleStyle.bg} ${roleStyle.text} border-0 text-xs shrink-0`}>
                              {roleStyle.label}
                            </Badge>
                            <span className="text-sm text-muted-foreground line-clamp-1">
                              {notes}
                            </span>
                          </div>
                        );
                      })}
                      
                      {/* Molecules count */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                        <span className="text-sm text-muted-foreground">
                          {formule.molecules.length} molécules
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedFormule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedFormule(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedFormule.name}</h2>
                    <Badge className={`${familyStyles(selectedFormule.family).bg} ${familyStyles(selectedFormule.family).text} border-0 mt-2`}>
                      {selectedFormule.family}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedFormule(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <p className="text-muted-foreground mb-6">{selectedFormule.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Radar Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={calculateRadarProfile(selectedFormule.molecules)}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="axis" className="text-xs" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Profil"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Molecules List */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Composition</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedFormule.molecules.map((mol, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`${ROLE_STYLES[mol.role].bg} ${ROLE_STYLES[mol.role].text} border-0 text-xs`}>
                              {ROLE_STYLES[mol.role].label}
                            </Badge>
                            <span className="text-sm">{mol.name}</span>
                          </div>
                          <span className="text-sm font-medium">{mol.proportion}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FormulesReferenceContent;
