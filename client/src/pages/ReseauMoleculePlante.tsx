import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { 
  Search, 
  Network, 
  Loader2, 
  Leaf, 
  FlaskConical, 
  MapPin,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useLocation } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type EntityType = "molecule" | "plant" | "terroir" | "rawMaterial";

// Couleurs par type d'entité
const entityColors = {
  molecule: { bg: "#8b5cf6", border: "#7c3aed", text: "white" }, // Violet
  plant: { bg: "#22c55e", border: "#16a34a", text: "white" },    // Vert
  terroir: { bg: "#f59e0b", border: "#d97706", text: "white" },  // Ambre
  rawMaterial: { bg: "#06b6d4", border: "#0891b2", text: "white" }, // Cyan
};

// Couleurs par rôle de molécule
const roleColors = {
  majeur: "#ef4444",     // Rouge
  secondaire: "#f97316", // Orange
  trace: "#94a3b8",      // Gris
  variable: "#a855f7",   // Violet
};

export default function ReseauMoleculePlante() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([
    "molecule",
    "plant",
    "terroir",
  ]);
  const [showSignatureOnly, setShowSignatureOnly] = useState(false);
  const [minPercentage, setMinPercentage] = useState(0);
  const [selectedNode, setSelectedNode] = useState<{
    type: EntityType;
    id: number;
    name: string;
  } | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const { data: networkData, isLoading } = trpc.network.getMoleculePlantTerroirNetwork.useQuery();

  // Générer les nœuds et arêtes à partir des données
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!networkData || !networkData.entities || !networkData.relationships) {
      return { nodes: [], edges: [] };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const processedMolecules = new Set<number>();
    const processedPlants = new Set<number>();
    const processedTerroirs = new Set<number>();

    // Filtrer les relations par pourcentage minimum
    const filteredRelations = (networkData.relationships.plantMolecules || []).filter(
      (rel) => {
        const pct = parseFloat(String(rel.percentageTypical || rel.percentageMax || 0));
        const passesPercentage = pct >= minPercentage;
        const passesSignature = !showSignatureOnly || rel.isSignature === 1;
        return passesPercentage && passesSignature;
      }
    );

    // Filtrer par recherche
    const searchLower = searchQuery.toLowerCase();
    const entitiesPlants = networkData.entities.plants || [];
    const entitiesMolecules = networkData.entities.molecules || [];
    const entitiesTerroirs = networkData.entities.terroirs || [];
    
    const matchingPlants = entitiesPlants.filter(
      (p) => p.name.toLowerCase().includes(searchLower) || 
             (p.latinName && p.latinName.toLowerCase().includes(searchLower))
    );
    const matchingMolecules = entitiesMolecules.filter(
      (m) => m.name.toLowerCase().includes(searchLower)
    );
    const matchingTerroirs = entitiesTerroirs.filter(
      (t) => t.name.toLowerCase().includes(searchLower)
    );

    // Si recherche active, ne montrer que les entités correspondantes
    const plantIds = searchQuery 
      ? new Set(matchingPlants.map(p => p.id))
      : new Set(entitiesPlants.map(p => p.id));
    const moleculeIds = searchQuery
      ? new Set(matchingMolecules.map(m => m.id))
      : new Set(entitiesMolecules.map(m => m.id));
    const terroirIds = searchQuery
      ? new Set(matchingTerroirs.map(t => t.id))
      : new Set(entitiesTerroirs.map(t => t.id));

    // Disposition en cercles concentriques
    const centerX = 600;
    const centerY = 400;
    
    // 1. Ajouter les nœuds plantes (cercle intérieur)
    if (selectedTypes.includes("plant")) {
      const plantsWithMolecules = entitiesPlants.filter(
        (p) => plantIds.has(p.id) && filteredRelations.some(r => r.plantId === p.id)
      );
      
      const plantAngleStep = (2 * Math.PI) / Math.max(plantsWithMolecules.length, 1);
      plantsWithMolecules.forEach((plant, index) => {
        if (processedPlants.has(plant.id)) return;
        processedPlants.add(plant.id);
        
        const angle = index * plantAngleStep - Math.PI / 2;
        const radius = 200;
        
        nodes.push({
          id: `plant-${plant.id}`,
          type: "default",
          data: {
            label: plant.name,
            latinName: plant.latinName,
            type: "plant",
            entityId: plant.id,
          },
          position: { 
            x: centerX + Math.cos(angle) * radius, 
            y: centerY + Math.sin(angle) * radius 
          },
          style: {
            background: entityColors.plant.bg,
            color: entityColors.plant.text,
            border: `2px solid ${entityColors.plant.border}`,
            borderRadius: "50%",
            padding: "12px",
            fontSize: "11px",
            fontWeight: "600",
            cursor: "pointer",
            width: "auto",
            minWidth: "80px",
            textAlign: "center",
          },
        });
      });
    }

    // 2. Ajouter les nœuds molécules (cercle extérieur)
    if (selectedTypes.includes("molecule")) {
      const moleculesInRelations = filteredRelations
        .filter(r => processedPlants.has(r.plantId) || !selectedTypes.includes("plant"))
        .map(r => r.moleculeId);
      const uniqueMoleculeIds = Array.from(new Set(moleculesInRelations));
      
      const moleculeAngleStep = (2 * Math.PI) / Math.max(uniqueMoleculeIds.length, 1);
      uniqueMoleculeIds.forEach((molId, index) => {
        if (processedMolecules.has(molId)) return;
        if (!moleculeIds.has(molId) && searchQuery) return;
        
        const molecule = entitiesMolecules.find(m => m.id === molId);
        if (!molecule) return;
        
        processedMolecules.add(molId);
        
        const angle = index * moleculeAngleStep - Math.PI / 2;
        const radius = 450;
        
        // Trouver le rôle dominant de cette molécule
        const relations = filteredRelations.filter(r => r.moleculeId === molId);
        const dominantRole = relations.find(r => r.role === "majeur")?.role || 
                           relations.find(r => r.role === "secondaire")?.role || 
                           relations[0]?.role || "trace";
        
        nodes.push({
          id: `molecule-${molecule.id}`,
          type: "default",
          data: {
            label: molecule.name,
            type: "molecule",
            entityId: molecule.id,
            role: dominantRole,
          },
          position: { 
            x: centerX + Math.cos(angle) * radius, 
            y: centerY + Math.sin(angle) * radius 
          },
          style: {
            background: entityColors.molecule.bg,
            color: entityColors.molecule.text,
            border: `3px solid ${roleColors[dominantRole as keyof typeof roleColors] || roleColors.trace}`,
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "10px",
            fontWeight: "500",
            cursor: "pointer",
          },
        });
      });
    }

    // 3. Ajouter les nœuds terroirs
    if (selectedTypes.includes("terroir")) {
      const terroirsWithPlants = (networkData.entities.terroirs || []).filter(
        (t) => terroirIds.has(t.id) && (networkData.relationships.terroirPlants || []).some(r => r.terroirId === t.id)
      );
      
      const terroirAngleStep = (2 * Math.PI) / Math.max(terroirsWithPlants.length, 1);
      terroirsWithPlants.forEach((terroir, index) => {
        if (processedTerroirs.has(terroir.id)) return;
        processedTerroirs.add(terroir.id);
        
        const angle = index * terroirAngleStep + Math.PI / 4;
        const radius = 100;
        
        nodes.push({
          id: `terroir-${terroir.id}`,
          type: "default",
          data: {
            label: terroir.name,
            type: "terroir",
            entityId: terroir.id,
          },
          position: { 
            x: centerX + Math.cos(angle) * radius, 
            y: centerY + Math.sin(angle) * radius 
          },
          style: {
            background: entityColors.terroir.bg,
            color: entityColors.terroir.text,
            border: `2px solid ${entityColors.terroir.border}`,
            borderRadius: "4px",
            padding: "10px 14px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
          },
        });
      });
    }

    // 4. Créer les arêtes plante-molécule
    filteredRelations.forEach((rel, index) => {
      if (!processedPlants.has(rel.plantId) || !processedMolecules.has(rel.moleculeId)) return;
      
      const percentage = parseFloat(String(rel.percentageTypical || rel.percentageMax || 0));
      const strokeWidth = Math.max(1, Math.min(5, percentage / 10));
      const opacity = Math.max(0.3, Math.min(1, percentage / 50));
      
      edges.push({
        id: `edge-pm-${rel.plantId}-${rel.moleculeId}`,
        source: `plant-${rel.plantId}`,
        target: `molecule-${rel.moleculeId}`,
        type: "default",
        animated: rel.isSignature === 1,
        style: {
          stroke: roleColors[rel.role as keyof typeof roleColors] || "#94a3b8",
          strokeWidth,
          opacity,
        },
        label: percentage > 0 ? `${percentage.toFixed(1)}%` : undefined,
        labelStyle: { fontSize: 9, fill: "#666" },
        labelBgStyle: { fill: "white", fillOpacity: 0.8 },
      });
    });

    // 5. Créer les arêtes terroir-plante
    (networkData.relationships.terroirPlants || []).forEach((rel) => {
      if (!processedTerroirs.has(rel.terroirId) || !processedPlants.has(rel.plantId!)) return;
      
      edges.push({
        id: `edge-tp-${rel.terroirId}-${rel.plantId}`,
        source: `terroir-${rel.terroirId}`,
        target: `plant-${rel.plantId}`,
        type: "default",
        animated: rel.isSignature === 1,
        style: {
          stroke: entityColors.terroir.border,
          strokeWidth: 2,
          strokeDasharray: "5,5",
        },
      });
    });

    return { nodes, edges };
  }, [networkData, selectedTypes, searchQuery, showSignatureOnly, minPercentage]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Mettre à jour les nœuds et arêtes quand les données changent
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const { type, entityId, label } = node.data;
    setSelectedNode({ type, id: entityId, name: label });
    
    // Navigation vers la page de détail
    if (type === "plant") {
      setLocation(`/plantes/${entityId}`);
    } else if (type === "molecule") {
      setLocation(`/molecules/${entityId}`);
    } else if (type === "terroir") {
      setLocation(`/terroirs/${entityId}`);
    }
  }, [setLocation]);

  const toggleType = (type: EntityType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement du réseau...</p>
        </div>
      </div>
    );
  }

  const stats = {
    plants: networkData?.entities?.plants?.length || 0,
    molecules: networkData?.entities?.molecules?.length || 0,
    terroirs: networkData?.entities?.terroirs?.length || 0,
    relations: networkData?.relationships?.plantMolecules?.length || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        <Breadcrumbs
          customItems={[
            { label: "Accueil", path: "/" },
            { label: "Réseau Molécule-Plante-Terroir" },
          ]}
        />

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Network className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Réseau Molécule-Plante-Terroir</h1>
            <p className="text-sm text-muted-foreground">
              Visualisation interactive des connexions entre molécules, plantes et terroirs
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ background: entityColors.plant.bg }}>
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.plants}</p>
                <p className="text-xs text-muted-foreground">Plantes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ background: entityColors.molecule.bg }}>
                <FlaskConical className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.molecules}</p>
                <p className="text-xs text-muted-foreground">Molécules</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ background: entityColors.terroir.bg }}>
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.terroirs}</p>
                <p className="text-xs text-muted-foreground">Terroirs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-slate-500">
                <Network className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.relations}</p>
                <p className="text-xs text-muted-foreground">Relations</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphe et contrôles */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panneau de contrôle */}
          <div className="lg:col-span-1 space-y-4">
            {/* Recherche */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Filtres */}
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filtres
                      </span>
                      {isFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {/* Types d'entités */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Types d'entités</p>
                      <div className="space-y-2">
                        {(["plant", "molecule", "terroir"] as EntityType[]).map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={selectedTypes.includes(type)}
                              onCheckedChange={() => toggleType(type)}
                            />
                            <label
                              htmlFor={type}
                              className="text-sm flex items-center gap-2 cursor-pointer"
                            >
                              <div
                                className="w-3 h-3 rounded"
                                style={{ background: entityColors[type].bg }}
                              />
                              {type === "plant" && "Plantes"}
                              {type === "molecule" && "Molécules"}
                              {type === "terroir" && "Terroirs"}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pourcentage minimum */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Pourcentage minimum: {minPercentage}%
                      </p>
                      <Slider
                        value={[minPercentage]}
                        onValueChange={([value]) => setMinPercentage(value)}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Molécules signatures */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="signature"
                        checked={showSignatureOnly}
                        onCheckedChange={(checked) => setShowSignatureOnly(!!checked)}
                      />
                      <label htmlFor="signature" className="text-sm cursor-pointer">
                        Molécules signatures uniquement
                      </label>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Légende */}
            <Collapsible open={isLegendOpen} onOpenChange={setIsLegendOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Légende
                      </span>
                      {isLegendOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {/* Entités */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Entités</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-4 h-4 rounded-full" style={{ background: entityColors.plant.bg }} />
                          <span>Plante</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-4 h-4 rounded" style={{ background: entityColors.molecule.bg }} />
                          <span>Molécule</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-4 h-4 rounded-sm" style={{ background: entityColors.terroir.bg }} />
                          <span>Terroir</span>
                        </div>
                      </div>
                    </div>

                    {/* Rôles des molécules */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Rôle (bordure)</p>
                      <div className="space-y-1">
                        {Object.entries(roleColors).map(([role, color]) => (
                          <div key={role} className="flex items-center gap-2 text-xs">
                            <div className="w-4 h-1 rounded" style={{ background: color }} />
                            <span className="capitalize">{role}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Liens */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Liens</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>• Épaisseur = concentration</p>
                        <p>• Animation = signature</p>
                        <p>• Pointillés = terroir-plante</p>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Graphe */}
          <Card className="lg:col-span-3">
            <CardContent className="p-0">
              <div style={{ height: "700px" }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  fitView
                  attributionPosition="bottom-left"
                  minZoom={0.1}
                  maxZoom={2}
                >
                  <Controls />
                  <MiniMap 
                    nodeColor={(node) => {
                      const type = node.data?.type as EntityType;
                      return entityColors[type]?.bg || "#666";
                    }}
                    maskColor="rgba(0,0,0,0.1)"
                  />
                  <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                  <Panel position="top-right" className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
                    <div className="text-xs text-muted-foreground">
                      {nodes.length} nœuds • {edges.length} liens
                    </div>
                  </Panel>
                </ReactFlow>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Comment utiliser ce graphe</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Cliquez sur un nœud pour accéder à sa fiche détaillée</li>
                  <li>Utilisez la molette pour zoomer, cliquez-glissez pour déplacer</li>
                  <li>Les pourcentages sur les liens indiquent la concentration typique</li>
                  <li>Les liens animés indiquent les molécules signatures de la plante</li>
                  <li>Ajustez les filtres pour explorer différentes relations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
