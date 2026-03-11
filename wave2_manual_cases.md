# PERFUMUM — Rapport Vague 2 : Cas Manuels

Généré le 2026-03-11 10:05

Ce rapport liste les occurrences de `any` qui **ne peuvent pas être corrigées automatiquement**
et nécessitent une intervention manuelle. Elles sont classées par type de problème.

---

## Résumé

| Type | Occurrences | Fichiers |
|---|---|---|
| Paramètres de callback `(item: any) =>` | 1131 | 140 |
| Callbacks D3 `(d: any)` | 494 | 35 |
| Casts complexes `as any` | 264 | 61 |
| Propriétés d'interface `: any` | 234 | 67 |
| Autres cas | 152 | 39 |
| Propriétés typées `any[]` | 112 | 27 |
| Paramètres de fonction `(x: any)` | 63 | 23 |
| Variables locales `const x: any` | 10 | 4 |
| Props de composant destructurées `({ prop }: any)` | 4 | 1 |
| **TOTAL** | **2464** | **213** |

---

## Paramètres de callback `(item: any) =>`

**Correction suggérée :** Inférer depuis le type du tableau source

### `client/src/components/AIEnrichButton.tsx`

- **L33** : `onSuccess: (data: any) => setPreview(data.enriched),`
- **L37** : `onSuccess: (data: any) => setPreview(data.enriched),`
- **L41** : `onSuccess: (data: any) => {`
- **L48** : `onSuccess: (data: any) => {`
- **L33** : `onSuccess: (data: any) => setPreview(data.enriched),`
- **L37** : `onSuccess: (data: any) => setPreview(data.enriched),`
- **L41** : `onSuccess: (data: any) => {`
- **L48** : `onSuccess: (data: any) => {`

### `client/src/components/AxisSelector.tsx`

- **L95** : `(axis: any) => !linkedAxes?.some((linked: any) => linked.id === axis.id)`
- **L203** : `availableAxes.map((axis: any) => (`
- **L95** : `(axis: any) => !linkedAxes?.some((linked: any) => linked.id === axis.id)`
- **L203** : `availableAxes.map((axis: any) => (`

### `client/src/components/BiosyntheticPathwayViz.tsx`

- **L355** : `.attr("opacity", (l: any) => {`
- **L360** : `.attr("stroke-width", (l: any) => {`
- **L368** : `.filter((n: any) => n.id !== d.id)`
- **L389** : `.attr("stroke-width", (l: any) => l.type === "catalysis" ? 1 : 2);`
- **L355** : `.attr("opacity", (l: any) => {`
- **L360** : `.attr("stroke-width", (l: any) => {`
- **L368** : `.filter((n: any) => n.id !== d.id)`
- **L389** : `.attr("stroke-width", (l: any) => l.type === "catalysis" ? 1 : 2);`

### `client/src/components/ChemicalFamilyHierarchyGraph.tsx`

- **L390** : `link.attr("stroke-opacity", (l: any) => {`
- **L393** : `node.attr("opacity", (n: any) => {`
- **L396** : `(l: any) => (l.source.id === d.id && l.target.id === n.id) ||`
- **L390** : `link.attr("stroke-opacity", (l: any) => {`
- **L393** : `node.attr("opacity", (n: any) => {`
- **L396** : `(l: any) => (l.source.id === d.id && l.target.id === n.id) ||`

### `client/src/components/CitationGraph.tsx`

- **L54** : `onFiltersChange?: (filters: any) => void;`
- **L523** : `<Select value={colorBy} onValueChange={(v: any) => setColorBy(v)}>`
- **L709** : `{linkedAxes.map((axis: any) => (`
- **L54** : `onFiltersChange?: (filters: any) => void;`
- **L523** : `<Select value={colorBy} onValueChange={(v: any) => setColorBy(v)}>`
- **L709** : `{linkedAxes.map((axis: any) => (`

### `client/src/components/CitationManager.tsx`

- **L159** : `const existingCitingIds = new Set(citingList?.citations?.map((c: any) => c.citedId) || []);`
- **L160** : `const existingCitedIds = new Set(citedList?.citations?.map((c: any) => c.citingId) || []);`
- **L162** : `const availableRefs = allRefs?.entries?.filter((ref: any) => {`
- **L185** : `{citingList.citations.map((citation: any) => (`
- **L258** : `{citedList.citations.map((citation: any) => (`
- **L370** : `{availableRefs.map((ref: any) => (`
- **L159** : `const existingCitingIds = new Set(citingList?.citations?.map((c: any) => c.citedId) || []);`
- **L160** : `const existingCitedIds = new Set(citedList?.citations?.map((c: any) => c.citingId) || []);`
- *... et 4 autres occurrences*

### `client/src/components/CitationNetworkView.tsx`

- **L98** : `const nodeIds = new Set(filteredNodes.map((n: any) => n.id));`
- **L259** : `{thematicAxes?.map((axis: any) => (`
- **L381** : `(n: any) => n.id === (typeof link.source === "number" ? link.source : link.source.id)`
- **L384** : `(n: any) => n.id === (typeof link.target === "number" ? link.target : link.target.id)`
- **L466** : `{citationTypeDistribution.map((item: any) => (`
- **L593** : `? citationGraph.nodes.filter((n: any) => n.inDegree === 0 && n.outDegree === 0).length`
- **L98** : `const nodeIds = new Set(filteredNodes.map((n: any) => n.id));`
- **L259** : `{thematicAxes?.map((axis: any) => (`
- *... et 4 autres occurrences*

### `client/src/components/DuplicateManagementModal.tsx`

- **L319** : `{otherEntries.map((entry: any) => (`
- **L319** : `{otherEntries.map((entry: any) => (`

### `client/src/components/EntityLinker.tsx`

- **L142** : `entities = (terroirsData || []).map((t: any) => ({ id: t.id, name: t.name }));`
- **L142** : `entities = (terroirsData || []).map((t: any) => ({ id: t.id, name: t.name }));`

### `client/src/components/ForceGraphAxes.tsx`

- **L124** : `const nodes: GraphNode[] = data.nodes.map((n: any) => ({ ...n }));`
- **L125** : `const links: GraphLink[] = data.links.map((l: any) => ({ ...l }));`
- **L218** : `link.attr("stroke-opacity", (l: any) => {`
- **L231** : `link.attr("stroke-opacity", (l: any) => l.type === "primary" ? 0.8 : 0.4);`
- **L124** : `const nodes: GraphNode[] = data.nodes.map((n: any) => ({ ...n }));`
- **L125** : `const links: GraphLink[] = data.links.map((l: any) => ({ ...l }));`
- **L218** : `link.attr("stroke-opacity", (l: any) => {`
- **L231** : `link.attr("stroke-opacity", (l: any) => l.type === "primary" ? 0.8 : 0.4);`

### `client/src/components/GenealogyTree.tsx`

- **L86** : `const ancestors = genealogyData.nodes.filter((n: any) => n.type === 'ancestor');`
- **L87** : `const descendants = genealogyData.nodes.filter((n: any) => n.type === 'descendant');`
- **L86** : `const ancestors = genealogyData.nodes.filter((n: any) => n.type === 'ancestor');`
- **L87** : `const descendants = genealogyData.nodes.filter((n: any) => n.type === 'descendant');`

### `client/src/components/PlantMoleculeGraph.tsx`

- **L316** : `link.attr("stroke-opacity", (l: any) => {`
- **L321** : `node.attr("opacity", (n: any) => {`
- **L324** : `(l: any) => (l.source.id === d.id && l.target.id === n.id) ||`
- **L316** : `link.attr("stroke-opacity", (l: any) => {`
- **L321** : `node.attr("opacity", (n: any) => {`
- **L324** : `(l: any) => (l.source.id === d.id && l.target.id === n.id) ||`

### `client/src/components/SeasonalVariations.tsx`

- **L99** : `(Array.isArray(v.keyMolecules) ? v.keyMolecules : []).map((m: any) => m.name)`
- **L107** : `const mol = mols.find((m: any) => m.name === molName);`
- **L99** : `(Array.isArray(v.keyMolecules) ? v.keyMolecules : []).map((m: any) => m.name)`
- **L107** : `const mol = mols.find((m: any) => m.name === molName);`

### `client/src/components/SmartSearch.tsx`

- **L435** : `searchResults.molecules.forEach((mol: any) => {`
- **L451** : `searchResults.recettes.forEach((rec: any) => {`
- **L467** : `searchResults.glossary.forEach((term: any) => {`
- **L482** : `searchResults.plants.forEach((plant: any) => {`
- **L435** : `searchResults.molecules.forEach((mol: any) => {`
- **L451** : `searchResults.recettes.forEach((rec: any) => {`
- **L467** : `searchResults.glossary.forEach((term: any) => {`
- **L482** : `searchResults.plants.forEach((plant: any) => {`

### `client/src/components/SynergySuggestions.tsx`

- **L102** : `allSynergies.terpeneSynergies?.forEach((syn: any) => {`
- **L132** : `allSynergies.moleculeSynergies?.forEach((syn: any) => {`
- **L102** : `allSynergies.terpeneSynergies?.forEach((syn: any) => {`
- **L132** : `allSynergies.moleculeSynergies?.forEach((syn: any) => {`

### `client/src/components/TerroirMap.tsx`

- **L478** : `const plantsForDisplay: PlantTerroir[] = selectedTerroirPlants?.map((p: any) => ({`
- **L478** : `const plantsForDisplay: PlantTerroir[] = selectedTerroirPlants?.map((p: any) => ({`

### `client/src/components/TerroirMapLeaflet.tsx`

- **L228** : `const selectedTerroir = terroirs?.find((t: any) => t.id === selectedTerroirId) as Terroir | undefined ?? null;`
- **L231** : `const filteredTerroirs = (terroirs?.filter((t: any) => {`
- **L319** : `const plantsForDisplay: PlantTerroir[] = selectedTerroirPlants?.map((p: any) => ({`
- **L228** : `const selectedTerroir = terroirs?.find((t: any) => t.id === selectedTerroirId) as Terroir | undefined ?? null;`
- **L231** : `const filteredTerroirs = (terroirs?.filter((t: any) => {`
- **L319** : `const plantsForDisplay: PlantTerroir[] = selectedTerroirPlants?.map((p: any) => ({`

### `client/src/components/VerifiedSuppliersPanel.tsx`

- **L245** : `{suppliers.map((s: any) => (`
- **L245** : `{suppliers.map((s: any) => (`

### `client/src/components/charts/EnhancedSankeyDiagram.tsx`

- **L293** : `links.attr("opacity", (l: any) =>`
- **L293** : `links.attr("opacity", (l: any) =>`

### `client/src/components/charts/PlantTerroirNetworkGraph.tsx`

- **L266** : `.attr("stroke-opacity", (l: any) => {`
- **L271** : `.attr("stroke-width", (l: any) => {`
- **L266** : `.attr("stroke-opacity", (l: any) => {`
- **L271** : `.attr("stroke-width", (l: any) => {`

### `client/src/components/charts/TerrainPlantMoleculeGraph.tsx`

- **L440** : `.attr("stroke-opacity", (l: any) => {`
- **L445** : `.attr("stroke-width", (l: any) => {`
- **L453** : `.attr("opacity", (n: any) => {`
- **L440** : `.attr("stroke-opacity", (l: any) => {`
- **L445** : `.attr("stroke-width", (l: any) => {`
- **L453** : `.attr("opacity", (n: any) => {`

### `client/src/components/content/CarteContent.tsx`

- **L143** : `plantTerroirs.forEach((pt: any) => {`
- **L393** : `{terroirPlants.map((pt: any) => (`
- **L143** : `plantTerroirs.forEach((pt: any) => {`
- **L393** : `{terroirPlants.map((pt: any) => (`

### `client/src/components/content/GammesOverviewContent.tsx`

- **L169** : `const matchingRecettes = recettes.filter((r: any) =>`
- **L176** : `const matchingMolecules = molecules.filter((m: any) =>`
- **L183** : `const matchingPlants = plants.filter((p: any) =>`
- **L169** : `const matchingRecettes = recettes.filter((r: any) =>`
- **L176** : `const matchingMolecules = molecules.filter((m: any) =>`
- **L183** : `const matchingPlants = plants.filter((p: any) =>`

### `client/src/components/content/PlantsContent.tsx`

- **L223** : `return plants.filter((plant: any) => {`
- **L408** : `{filteredPlants.map((plant: any) => (`
- **L414** : `{filteredPlants.map((plant: any) => (`
- **L223** : `return plants.filter((plant: any) => {`
- **L408** : `{filteredPlants.map((plant: any) => (`
- **L414** : `{filteredPlants.map((plant: any) => (`

### `client/src/components/content/TerroirsContent.tsx`

- **L179** : `return terroirs.filter((terroir: any) => {`
- **L367** : `{filteredTerroirs.map((terroir: any) => (`
- **L377** : `{filteredTerroirs.map((terroir: any) => {`
- **L179** : `return terroirs.filter((terroir: any) => {`
- **L367** : `{filteredTerroirs.map((terroir: any) => (`
- **L377** : `{filteredTerroirs.map((terroir: any) => {`

### `client/src/components/content/VarietiesContent.tsx`

- **L215** : `return varieties.filter((variety: any) => {`
- **L402** : `{filteredVarieties.map((variety: any) => (`
- **L408** : `{filteredVarieties.map((variety: any) => {`
- **L215** : `return varieties.filter((variety: any) => {`
- **L402** : `{filteredVarieties.map((variety: any) => (`
- **L408** : `{filteredVarieties.map((variety: any) => {`

### `client/src/lib/exportUtils.ts`

- **L8** : `autoTable: (options: any) => jsPDF;`
- **L8** : `autoTable: (options: any) => jsPDF;`

### `client/src/pages/AccordsDedies.tsx`

- **L210** : `return accord.terpeneProfile.slice(0, 6).map((t: any) => ({`
- **L210** : `return accord.terpeneProfile.slice(0, 6).map((t: any) => ({`

### `client/src/pages/AdminContributions.tsx`

- **L142** : `const filteredContributions = (activeContribs as unknown[] || []).filter((c: any) =>`
- **L325** : `{filteredContributions.map((contribution: any) => (`
- **L325** : `{filteredContributions.map((contribution: any) => (`

### `client/src/pages/AdminHistorique.tsx`

- **L99** : `{modifications?.filter((m: any) => m.action === "create").length || 0}`
- **L112** : `{modifications?.filter((m: any) => m.action === "delete").length || 0}`
- **L171** : `{modifications.map((modification: any) => (`
- **L99** : `{modifications?.filter((m: any) => m.action === "create").length || 0}`
- **L112** : `{modifications?.filter((m: any) => m.action === "delete").length || 0}`
- **L171** : `{modifications.map((modification: any) => (`

### `client/src/pages/AdminMolecules.tsx`

- **L148** : `setSelectedFamilyIds(moleculeFamilies.map((f: any) => f.id));`
- **L156** : `const handleEditMolecule = (molecule: any) => {`
- **L181** : `const currentFamilyIds = moleculeFamilies?.map((f: any) => f.id) || [];`
- **L378** : `const family = chemicalFamilies?.find((f: any) => f.id === familyId);`
- **L420** : `{chemicalFamilies?.map((family: any) => {`
- **L148** : `setSelectedFamilyIds(moleculeFamilies.map((f: any) => f.id));`
- **L156** : `const handleEditMolecule = (molecule: any) => {`
- **L181** : `const currentFamilyIds = moleculeFamilies?.map((f: any) => f.id) || [];`
- *... et 2 autres occurrences*

### `client/src/pages/AdminRecettes.tsx`

- **L281** : `onValueChange={(value: any) =>`
- **L304** : `onValueChange={(value: any) =>`
- **L342** : `onValueChange={(value: any) =>`
- **L281** : `onValueChange={(value: any) =>`
- **L304** : `onValueChange={(value: any) =>`
- **L342** : `onValueChange={(value: any) =>`

### `client/src/pages/AnalysisHub.tsx`

- **L127** : `{recentCompounds.map((compound: any) => (`
- **L127** : `{recentCompounds.map((compound: any) => (`

### `client/src/pages/AromaticRarities.tsx`

- **L50** : `const materials: AromaticRarity[] = (raritiesData?.data || []).map((r: any) => ({`
- **L50** : `const materials: AromaticRarity[] = (raritiesData?.data || []).map((r: any) => ({`

### `client/src/pages/AxeRechercheDetail.tsx`

- **L254** : `return allBibliography.entries.filter((b: any) =>`
- **L263** : `return bibliography?.some((b: any) => b.id === bibId);`
- **L322** : `const openEditDialog = (entry: any) => {`
- **L607** : `{entries.map((entry: any) => (`
- **L706** : `{subAxes.map((subAxis: any) => (`
- **L786** : `{filteredBibliography.map((bib: any) => (`
- **L841** : `{bibliography.map((entry: any) => (`
- **L254** : `return allBibliography.entries.filter((b: any) =>`
- *... et 6 autres occurrences*

### `client/src/pages/AxesRecherche.tsx`

- **L166** : `return allAxes.filter((a: any) => !a.parentAxisId);`
- **L216** : `const openEditDialog = (axis: any) => {`
- **L242** : `return axes.filter((axis: any) =>`
- **L341** : `.filter((a: any) => !selectedAxis || a.id !== selectedAxis.id)`
- **L342** : `.map((a: any) => (`
- **L491** : `{stats.byStatus?.find((s: any) => s.status === "en_cours")?.count || 0}`
- **L502** : `{stats.byStatus?.find((s: any) => s.status === "termine")?.count || 0}`
- **L513** : `{stats.byStatus?.find((s: any) => s.status === "pause")?.count || 0}`
- *... et 14 autres occurrences*

### `client/src/pages/Bibliographie.tsx`

- **L437** : `articles: references?.filter((r: any) => r.entryType === "article").length || 0,`
- **L438** : `books: references?.filter((r: any) => r.entryType === "book").length || 0,`
- **L439** : `read: references?.filter((r: any) => r.readStatus === "read").length || 0,`
- **L437** : `articles: references?.filter((r: any) => r.entryType === "article").length || 0,`
- **L438** : `books: references?.filter((r: any) => r.entryType === "book").length || 0,`
- **L439** : `read: references?.filter((r: any) => r.readStatus === "read").length || 0,`

### `client/src/pages/BibliographieGlobale.tsx`

- **L359** : `const copyAPA = async (entry: any) => {`
- **L371** : `const openEditDialog = (entry: any) => {`
- **L762** : `{stats.byReadStatus?.find((s: any) => s.status === "read")?.count || 0}`
- **L886** : `{entriesData.entries.map((entry: any) => (`
- **L359** : `const copyAPA = async (entry: any) => {`
- **L371** : `const openEditDialog = (entry: any) => {`
- **L762** : `{stats.byReadStatus?.find((s: any) => s.status === "read")?.count || 0}`
- **L886** : `{entriesData.entries.map((entry: any) => (`

### `client/src/pages/BibliographiePage.tsx`

- **L307** : `const readCount = stats.byReadStatus?.find((s: any) => s.status === "read")?.count || 0;`
- **L308** : `const readingCount = stats.byReadStatus?.find((s: any) => s.status === "reading")?.count || 0;`
- **L309** : `const unreadCount = stats.byReadStatus?.find((s: any) => s.status === "unread")?.count || 0;`
- **L310** : `const toReviewCount = stats.byReadStatus?.find((s: any) => s.status === "to_review")?.count || 0;`
- **L497** : `const axis = axes.find((a: any) => a.axisCode === selectedAxis);`
- **L524** : `const copyAPA = useCallback(async (entry: any) => {`
- **L594** : `entries.forEach((entry: any) => {`
- **L731** : `recentEntries.map((entry: any) => (`
- *... et 20 autres occurrences*

### `client/src/pages/BiosyntheticPathways.tsx`

- **L326** : `const filteredTpsGenes = tpsData?.success ? tpsData.data.filter((gene: any) => {`
- **L335** : `? [...new Set(tpsData.data.map((g: any) => g.subfamily).filter(Boolean))]`
- **L597** : `filteredTpsGenes.slice(0, 30).map((gene: any) => (`
- **L326** : `const filteredTpsGenes = tpsData?.success ? tpsData.data.filter((gene: any) => {`
- **L335** : `? [...new Set(tpsData.data.map((g: any) => g.subfamily).filter(Boolean))]`
- **L597** : `filteredTpsGenes.slice(0, 30).map((gene: any) => (`

### `client/src/pages/CSVValidationImport.tsx`

- **L331** : `existingMolecules.forEach((m: any) => existingNames.add(m.name.toLowerCase()));`
- **L333** : `existingPlants.forEach((p: any) => existingNames.add(p.name.toLowerCase()));`
- **L331** : `existingMolecules.forEach((m: any) => existingNames.add(m.name.toLowerCase()));`
- **L333** : `existingPlants.forEach((p: any) => existingNames.add(p.name.toLowerCase()));`

### `client/src/pages/CannabisLandraces.tsx`

- **L117** : `{stats.byConservation?.find((c: any) => c.conservation_status === "rare")?.count || 0}`
- **L125** : `{stats.byConservation?.find((c: any) => c.conservation_status === "menacé")?.count || 0}`
- **L183** : `{data?.landraces.map((landrace: any) => (`
- **L117** : `{stats.byConservation?.find((c: any) => c.conservation_status === "rare")?.count || 0}`
- **L125** : `{stats.byConservation?.find((c: any) => c.conservation_status === "menacé")?.count || 0}`
- **L183** : `{data?.landraces.map((landrace: any) => (`

### `client/src/pages/CarteInteractiveTerroirs.tsx`

- **L177** : `plantTerroirs.forEach((pt: any) => {`
- **L700** : `{terroirPlants.slice(0, 5).map((pt: any) => (`
- **L177** : `plantTerroirs.forEach((pt: any) => {`
- **L700** : `{terroirPlants.slice(0, 5).map((pt: any) => (`

### `client/src/pages/CarteTerroirsPlantes.tsx`

- **L163** : `plantTerroirs.forEach((pt: any) => {`
- **L545** : `{terroirPlants.map((pt: any) => (`
- **L163** : `plantTerroirs.forEach((pt: any) => {`
- **L545** : `{terroirPlants.map((pt: any) => (`

### `client/src/pages/CarteTerroirsRecherche.tsx`

- **L245** : `const selectPlant = (plant: any) => {`
- **L580** : `{plantMolecules.map((pm: any) => (`
- **L245** : `const selectPlant = (plant: any) => {`
- **L580** : `{plantMolecules.map((pm: any) => (`

### `client/src/pages/CarteVarietes.tsx`

- **L216** : `.filter((v: any) => v.countryOfOrigin)`
- **L217** : `.map((v: any) => {`
- **L216** : `.filter((v: any) => v.countryOfOrigin)`
- **L217** : `.map((v: any) => {`

### `client/src/pages/ChemicalFamilyGraph.tsx`

- **L124** : `networkData.relationships.moleculeFamilies.forEach((relation: any) => {`
- **L124** : `networkData.relationships.moleculeFamilies.forEach((relation: any) => {`

### `client/src/pages/ChemotypesExplorer.tsx`

- **L56** : `.filter((plant: any) => plant.chemotypes && plant.chemotypes.length > 2)`
- **L57** : `.map((plant: any) => {`
- **L56** : `.filter((plant: any) => plant.chemotypes && plant.chemotypes.length > 2)`
- **L57** : `.map((plant: any) => {`

### `client/src/pages/CigarilloRecipes.tsx`

- **L100** : `{collections?.map((c: any) => (`
- **L137** : `{data?.recipes.map((recipe: any) => (`
- **L100** : `{collections?.map((c: any) => (`
- **L137** : `{data?.recipes.map((recipe: any) => (`

### `client/src/pages/ClaimsAndProofs.tsx`

- **L56** : `const claims: Claim[] = (claimsData?.data || []).map((c: any) => ({`
- **L56** : `const claims: Claim[] = (claimsData?.data || []).map((c: any) => ({`

### `client/src/pages/ClaimsAndProofsPage.tsx`

- **L153** : `{claims.map((claim: any) => (`
- **L153** : `{claims.map((claim: any) => (`

### `client/src/pages/ClassificationReviewQueue.tsx`

- **L178** : `const openEditDialog = (review: any) => {`
- **L187** : `const openRejectDialog = (review: any) => {`
- **L455** : `{reviews.map((item: any) => (`
- **L178** : `const openEditDialog = (review: any) => {`
- **L187** : `const openRejectDialog = (review: any) => {`
- **L455** : `{reviews.map((item: any) => (`

### `client/src/pages/ComparaisonAvancee.tsx`

- **L101** : `onSelect: (molecule: any) => void;`
- **L502** : `const addMolecule = useCallback((molecule: any) => {`
- **L101** : `onSelect: (molecule: any) => void;`
- **L502** : `const addMolecule = useCallback((molecule: any) => {`

### `client/src/pages/ComparaisonExtractions.tsx`

- **L154** : `rawMaterials.forEach((rm: any) => {`
- **L154** : `rawMaterials.forEach((rm: any) => {`

### `client/src/pages/CompoundSearch.tsx`

- **L54** : `filtered = allPeaks.filter((peak: any) =>`
- **L62** : `filtered = filtered.filter((peak: any) =>`
- **L99** : `.map((c: any) => ({`
- **L329** : `{compoundStats.slice(0, 20).map((compound: any) => (`
- **L54** : `filtered = allPeaks.filter((peak: any) =>`
- **L62** : `filtered = filtered.filter((peak: any) =>`
- **L99** : `.map((c: any) => ({`
- **L329** : `{compoundStats.slice(0, 20).map((compound: any) => (`

### `client/src/pages/ContributorInterface.tsx`

- **L289** : `{exact.map((item: any) => (`
- **L314** : `{similar.slice(0, 5).map((item: any) => (`
- **L289** : `{exact.map((item: any) => (`
- **L314** : `{similar.slice(0, 5).map((item: any) => (`

### `client/src/pages/CoverageGoalDashboard.tsx`

- **L104** : `return auditStats.moleculesWithoutPlantList.filter((m: any) =>`
- **L112** : `return allPlants.filter((p: any) =>`
- **L441** : `{filteredOrphanMolecules.map((mol: any) => (`
- **L490** : `{filteredPlants.map((plant: any) => (`
- **L529** : `{allMolecules?.find((m: any) => m.id === selectedMolecule)?.name || `#${selectedMolecule}`}`
- **L536** : `{allPlants?.find((p: any) => p.id === selectedPlant)?.name || `#${selectedPlant}`}`
- **L651** : `{filteredOrphanMolecules.slice(0, 50).map((mol: any) => (`
- **L104** : `return auditStats.moleculesWithoutPlantList.filter((m: any) =>`
- *... et 6 autres occurrences*

### `client/src/pages/ExportBibliographique.tsx`

- **L105** : `const citations = result.data.citations.map((c: any) => c.citation).join("\n\n");`
- **L105** : `const citations = result.data.citations.map((c: any) => c.citation).join("\n\n");`

### `client/src/pages/ExtractionMethods.tsx`

- **L60** : `const filteredMethods = methods?.filter((method: any) => {`
- **L111** : `{methods?.filter((m: any) => m.category === "distillation" || m.category === "hydrodistillation").length || 0}`
- **L126** : `{methods?.filter((m: any) => m.complexityLevel === "simple" || m.complexityLevel === "moderate").length || 0}`
- **L141** : `{methods?.filter((m: any) => m.category === "co2_supercritique").length || 0}`
- **L224** : `{filteredMethods.map((method: any) => (`
- **L60** : `const filteredMethods = methods?.filter((method: any) => {`
- **L111** : `{methods?.filter((m: any) => m.category === "distillation" || m.category === "hydrodistillation").length || 0}`
- **L126** : `{methods?.filter((m: any) => m.complexityLevel === "simple" || m.complexityLevel === "moderate").length || 0}`
- *... et 2 autres occurrences*

### `client/src/pages/FamilyDetail.tsx`

- **L255** : `{plants.map((plant: any) => (`
- **L255** : `{plants.map((plant: any) => (`

### `client/src/pages/FinalRecipes.tsx`

- **L223** : `const filteredRecipes = recipes?.filter((recipe: any) => {`
- **L251** : `const radicalCount = recipes?.filter((r: any) => r.isRadical === 1).length || 0;`
- **L418** : `{filteredRecipes.map((recipe: any) => (`
- **L434** : `{typeRecipes.map((recipe: any) => (`
- **L223** : `const filteredRecipes = recipes?.filter((recipe: any) => {`
- **L251** : `const radicalCount = recipes?.filter((r: any) => r.isRadical === 1).length || 0;`
- **L418** : `{filteredRecipes.map((recipe: any) => (`
- **L434** : `{typeRecipes.map((recipe: any) => (`

### `client/src/pages/GCMSChromatograms.tsx`

- **L216** : `const selectedChromatogram = chromatograms?.find((c: any) => c.landrace_name === selectedLandrace);`
- **L267** : `{chromatograms?.map((c: any) => (`
- **L216** : `const selectedChromatogram = chromatograms?.find((c: any) => c.landrace_name === selectedLandrace);`
- **L267** : `{chromatograms?.map((c: any) => (`

### `client/src/pages/Gallery.tsx`

- **L277** : `onValueChange={(v: any) => setUploadForm(prev => ({ ...prev, category: v }))}`
- **L277** : `onValueChange={(v: any) => setUploadForm(prev => ({ ...prev, category: v }))}`

### `client/src/pages/GenerateurFormules.tsx`

- **L414** : `selectedMoleculeIds={suggestions.slice(0, 5).map((s: any) => s.id)}`
- **L414** : `selectedMoleculeIds={suggestions.slice(0, 5).map((s: any) => s.id)}`

### `client/src/pages/GrapheAxesThematiques.tsx`

- **L169** : `terroirs?.forEach((terroir: any) => {`
- **L169** : `terroirs?.forEach((terroir: any) => {`

### `client/src/pages/GrapheMoleculesRecettes.tsx`

- **L45** : `const terpenes = allMolecules?.filter((m: any) => [1, 2, 3, 4, 5, 6, 7].includes(m.id)) || [];`
- **L66** : `const filteredRecettes = recettesData.filter((r: any) => {`
- **L74** : `filteredRecettes.forEach((recette: any) => {`
- **L75** : `recette.molecules?.forEach((rm: any) => {`
- **L95** : `...filteredRecettes.map((r: any) => ({`
- **L152** : `const recette = filteredRecettes.find((r: any) => `recette-${r.id}` === d.id);`
- **L164** : `const mol = terpenes.find((t: any) => t.id === molId);`
- **L45** : `const terpenes = allMolecules?.filter((m: any) => [1, 2, 3, 4, 5, 6, 7].includes(m.id)) || [];`
- *... et 6 autres occurrences*

### `client/src/pages/GrapheReferencesAxes.tsx`

- **L133** : `{axes?.filter((a: any) => a.metaAxis === 'meta_a').map((axis: any) => (`
- **L143** : `{axes?.filter((a: any) => a.metaAxis === 'meta_a').length === 0 && (`
- **L156** : `{axes?.filter((a: any) => a.metaAxis === 'meta_b').map((axis: any) => (`
- **L166** : `{axes?.filter((a: any) => a.metaAxis === 'meta_b').length === 0 && (`
- **L179** : `{axes?.filter((a: any) => a.metaAxis === 'meta_c').map((axis: any) => (`
- **L189** : `{axes?.filter((a: any) => a.metaAxis === 'meta_c').length === 0 && (`
- **L133** : `{axes?.filter((a: any) => a.metaAxis === 'meta_a').map((axis: any) => (`
- **L143** : `{axes?.filter((a: any) => a.metaAxis === 'meta_a').length === 0 && (`
- *... et 4 autres occurrences*

### `client/src/pages/GrapheTerroirPlanteMolecule.tsx`

- **L46** : `networkData.entities.terroirs.forEach((terroir: any) => {`
- **L67** : `networkData.entities.plants.forEach((plant: any) => {`
- **L91** : `networkData.relationships.plantMolecules.forEach((rel: any) => {`
- **L97** : `.filter((m: any) => moleculesWithLinks.has(m.id))`
- **L99** : `.forEach((molecule: any) => {`
- **L119** : `networkData.relationships.terroirPlants.forEach((rel: any) => {`
- **L137** : `networkData.relationships.plantMolecules.forEach((rel: any) => {`
- **L46** : `networkData.entities.terroirs.forEach((terroir: any) => {`
- *... et 6 autres occurrences*

### `client/src/pages/H3LinkingInterface.tsx`

- **L489** : `existingLinks.forEach((item: any) => {`
- **L502** : `return existingLinks.some((item: any) =>`
- **L512** : `const link = existingLinks.find((item: any) =>`
- **L489** : `existingLinks.forEach((item: any) => {`
- **L502** : `return existingLinks.some((item: any) =>`
- **L512** : `const link = existingLinks.find((item: any) =>`

### `client/src/pages/HistoriqueFormules.tsx`

- **L31** : `const getRadarAverage = (formula: any) => {`
- **L31** : `const getRadarAverage = (formula: any) => {`

### `client/src/pages/LandraceComparator.tsx`

- **L36** : `lProfiles.forEach((p: any) => allTerpenes.add(p.terpene_name));`
- **L100** : `const profileMap = new Map(lProfiles.map((p: any) => [p.terpene_name, p.relative_abundance || 0]));`
- **L229** : `const profiles = allProfiles.filter((p: any) =>`
- **L412** : `.map((p: any) => p.terpene_name);`
- **L36** : `lProfiles.forEach((p: any) => allTerpenes.add(p.terpene_name));`
- **L100** : `const profileMap = new Map(lProfiles.map((p: any) => [p.terpene_name, p.relative_abundance || 0]));`
- **L229** : `const profiles = allProfiles.filter((p: any) =>`
- **L412** : `.map((p: any) => p.terpene_name);`

### `client/src/pages/MatriceInteractive.tsx`

- **L430** : `{moleculesWithSynergies.map((molecule: any) => (`
- **L430** : `{moleculesWithSynergies.map((molecule: any) => (`

### `client/src/pages/MolecularTransformations.tsx`

- **L444** : `{transformations.map((t: any) => {`
- **L565** : `{stats.impactCounts?.find((c: any) => c.impact_type === 'major')?.count || 0}`
- **L575** : `{stats.impactCounts?.find((c: any) => c.impact_type === 'moderate')?.count || 0}`
- **L585** : `{stats.impactCounts?.find((c: any) => c.impact_type === 'minor')?.count || 0}`
- **L667** : `{impacts.map((impact: any) => (`
- **L444** : `{transformations.map((t: any) => {`
- **L565** : `{stats.impactCounts?.find((c: any) => c.impact_type === 'major')?.count || 0}`
- **L575** : `{stats.impactCounts?.find((c: any) => c.impact_type === 'moderate')?.count || 0}`
- *... et 2 autres occurrences*

### `client/src/pages/MoleculeDetail.tsx`

- **L390** : `onChange={(e: any) => { setSearchQuery(e.target.value); setSelectedPlant(null); }}`
- **L397** : `{searchResults.map((plant: any) => (`
- **L445** : `onChange={(e: any) => setPercentageTypical(e.target.value)}`
- **L458** : `onChange={(e: any) => setIsSignature(e.target.checked)}`
- **L1654** : `{moleculeTransformations.asSource.map((t: any) => (`
- **L1703** : `{moleculeTransformations.asProduct.map((t: any) => (`
- **L1822** : `{[...new Set(tpsGenes.map((g: any) => g.species))].filter(Boolean).length > 0 && (`
- **L1824** : `{[...new Set(tpsGenes.map((g: any) => g.species))].filter(Boolean).length} espèce{[...new Set(tpsGenes.map((g: any) => g`
- *... et 24 autres occurrences*

### `client/src/pages/MoleculeRecetteAudit.tsx`

- **L55** : `return auditStats.moleculesWithoutRecetteList.filter((m: any) => {`
- **L65** : `return auditStats.recettesWithoutMoleculeList.filter((r: any) =>`
- **L75** : `.map((m: any) => m.family)`
- **L242** : `{auditStats?.topMoleculesByRecettes?.slice(0, 5).map((m: any) => (`
- **L265** : `{auditStats?.topRecettesByMolecules?.slice(0, 5).map((r: any) => (`
- **L298** : `{auditStats?.priorityMoleculesWithoutRecette?.slice(0, 5).map((m: any) => (`
- **L315** : `{auditStats?.priorityRecettesWithoutMolecule?.slice(0, 5).map((r: any) => (`
- **L377** : `{filteredMoleculesWithoutRecette.slice(0, 20).map((m: any) => (`
- *... et 10 autres occurrences*

### `client/src/pages/MoleculeRecetteDragDrop.tsx`

- **L77** : `return new Set(existingRelations.map((r: any) => `${r.moleculeId}-${r.recetteId}`));`
- **L83** : `return molecules.filter((m: any) =>`
- **L91** : `return recettes.filter((r: any) =>`
- **L130** : `const moleculeMap = new Map(molecules?.map((m: any) => [m.id, m.name]) || []);`
- **L131** : `const recetteMap = new Map(recettes?.map((r: any) => [r.id, r.name]) || []);`
- **L247** : `{filteredMolecules.slice(0, 100).map((m: any) => {`
- **L297** : `{filteredRecettes.slice(0, 100).map((r: any) => {`
- **L77** : `return new Set(existingRelations.map((r: any) => `${r.moleculeId}-${r.recetteId}`));`
- *... et 6 autres occurrences*

### `client/src/pages/MoleculeRecetteImportCSV.tsx`

- **L85** : `return new Set(molecules.map((m: any) => m.name.toLowerCase()));`
- **L90** : `return new Set(recettes.map((r: any) => r.name.toLowerCase()));`
- **L85** : `return new Set(molecules.map((m: any) => m.name.toLowerCase()));`
- **L90** : `return new Set(recettes.map((r: any) => r.name.toLowerCase()));`

### `client/src/pages/MoleculeRecetteLinking.tsx`

- **L115** : `(r: any) => r.molecules && r.molecules.length > 0`
- **L119** : `recettesWithMolecules.forEach((r: any) => {`
- **L120** : `r.molecules?.forEach((m: any) => {`
- **L131** : `.filter((r: any) => !r.molecules || r.molecules.length === 0)`
- **L135** : `.filter((m: any) => !moleculesUtiliseesSet.has(m.id))`
- **L169** : `const molecule = molecules.find((m: any) => m.id === mf.moleculeId);`
- **L192** : `return molecules.filter((m: any) =>`
- **L200** : `return recettes.filter((r: any) =>`
- *... et 28 autres occurrences*

### `client/src/pages/Molecules.tsx`

- **L144** : `return chemicalFamiliesData.map((f: any) => ({`
- **L292** : `const moleculeIdsInFamily = new Set((chemicalFamilyMoleculesData as Record<string, unknown>).molecules?.map((m: any) => `
- **L440** : `{chemicalFamiliesData.slice(0, 12).map((family: any) => (`
- **L144** : `return chemicalFamiliesData.map((f: any) => ({`
- **L440** : `{chemicalFamiliesData.slice(0, 12).map((family: any) => (`

### `client/src/pages/MonDashboard.tsx`

- **L60** : `return allMolecules.filter((m: any) => favoriteMolecules.includes(m.id));`
- **L259** : `{recentlyViewed.map((recipe: any) => (`
- **L60** : `return allMolecules.filter((m: any) => favoriteMolecules.includes(m.id));`
- **L259** : `{recentlyViewed.map((recipe: any) => (`

### `client/src/pages/OriginesGeographiques.tsx`

- **L21** : `? Array.from(new Set(origins.map((o: any) => o.country))).sort()`
- **L25** : `const filteredOrigins = origins?.filter((origin: any) => {`
- **L113** : `{origins?.filter((o: any) => o.latitude && o.longitude).length || 0}`
- **L121** : `{origins?.filter((o: any) => o.historicalContext).length || 0}`
- **L139** : `{countryOrigins.map((origin: any) => (`
- **L21** : `? Array.from(new Set(origins.map((o: any) => o.country))).sort()`
- **L25** : `const filteredOrigins = origins?.filter((origin: any) => {`
- **L113** : `{origins?.filter((o: any) => o.latitude && o.longitude).length || 0}`
- *... et 2 autres occurrences*

### `client/src/pages/OsmothequeMolecules.tsx`

- **L154** : `{data.molecules.map((molecule: any) => {`
- **L154** : `{data.molecules.map((molecule: any) => {`

### `client/src/pages/ParcoursOlfactif.tsx`

- **L245** : `.filter((pm: any) => pm.plantId === selectedPlant.id)`
- **L246** : `.map((pm: any) => pm.moleculeId);`
- **L801** : `filteredTerroirs.map((terroir: any) => {`
- **L867** : `plantsForTerroir.map((plant: any) => {`
- **L868** : `const moleculeCount = plantMolecules?.filter((pm: any) => pm.plantId === plant.id).length || 0;`
- **L942** : `moleculesForPlant.map((molecule: any) => (`
- **L1159** : `{featuredJourneys.map((journey: any) => (`
- **L1181** : `{curatedJourneys.map((journey: any) => (`
- *... et 8 autres occurrences*

### `client/src/pages/PerceptSearch.tsx`

- **L369** : `{searchResults.map((result: any) => (`
- **L369** : `{searchResults.map((result: any) => (`

### `client/src/pages/PeriqueCompounds.tsx`

- **L48** : `const cats = [...new Set(compounds.map((c: any) => c.category))].filter(Boolean);`
- **L54** : `return compounds.filter((compound: any) => {`
- **L67** : `compounds.forEach((c: any) => {`
- **L79** : `compounds.forEach((c: any) => {`
- **L90** : `return compounds.filter((c: any) => c.is_new_isolate).length;`
- **L147** : `{compounds?.filter((c: any) => c.perfumery_potential === "Exceptionnel" || c.perfumery_potential === "Très élevé").lengt`
- **L241** : `{filteredCompounds.slice(0, 50).map((compound: any) => (`
- **L384** : `?.filter((c: any) => c.perfumery_potential === "Exceptionnel" || c.perfumery_potential === "Très élevé")`
- *... et 10 autres occurrences*

### `client/src/pages/PlantMoleculeAudit.tsx`

- **L131** : `{auditStats?.plantsWithoutMoleculeList?.map((plant: any) => (`
- **L166** : `{auditStats?.moleculesWithoutPlantList?.map((molecule: any) => (`
- **L197** : `{auditStats?.topPlantsByMolecules?.map((plant: any) => (`
- **L131** : `{auditStats?.plantsWithoutMoleculeList?.map((plant: any) => (`
- **L166** : `{auditStats?.moleculesWithoutPlantList?.map((molecule: any) => (`
- **L197** : `{auditStats?.topPlantsByMolecules?.map((plant: any) => (`

### `client/src/pages/PlantTerroirAudit.tsx`

- **L98** : `return auditStats.plantsWithoutTerroirList.filter((p: any) =>`
- **L108** : `return auditStats.terroirsWithoutPlantList.filter((t: any) =>`
- **L116** : `const handleApplySuggestion = (suggestion: any) => {`
- **L395** : `{auditStats?.priorityPlantsWithoutTerroir?.map((plant: any) => (`
- **L436** : `{auditStats?.priorityTerroirsWithoutPlant?.map((terroir: any) => (`
- **L647** : `{filteredPlantsWithoutTerroir.map((plant: any) => (`
- **L707** : `{filteredTerroirsWithoutPlant.map((terroir: any) => (`
- **L98** : `return auditStats.plantsWithoutTerroirList.filter((p: any) =>`
- *... et 6 autres occurrences*

### `client/src/pages/PlantTerroirDragDrop.tsx`

- **L92** : `return plants.filter((p: any) =>`
- **L102** : `return terroirs.filter((t: any) =>`
- **L150** : `const plant = plants?.find((p: any) => p.id === plantId);`
- **L154** : `const terroir = terroirs?.find((t: any) => t.id === terroirId);`
- **L340** : `{filteredPlants.slice(0, 100).map((plant: any) => (`
- **L393** : `{filteredTerroirs.slice(0, 100).map((terroir: any) => (`
- **L92** : `return plants.filter((p: any) =>`
- **L102** : `return terroirs.filter((t: any) =>`
- *... et 4 autres occurrences*

### `client/src/pages/PlantTerroirImportCSV.tsx`

- **L100** : `plants.forEach((p: any) => {`
- **L112** : `terroirs.forEach((t: any) => {`
- **L100** : `plants.forEach((p: any) => {`
- **L112** : `terroirs.forEach((t: any) => {`

### `client/src/pages/PlantTerroirLinking.tsx`

- **L184** : `return plants.filter((p: any) =>`
- **L193** : `return terroirs.filter((t: any) =>`
- **L243** : `const selectPlantFromStats = (plant: any) => {`
- **L248** : `const selectTerroirFromStats = (terroir: any) => {`
- **L424** : `{stats.plantsSansTerroirs.map((p: any) => (`
- **L480** : `{stats.terroirsSansPlantes.map((t: any) => (`
- **L532** : `{plantesFiltrees.slice(0, 10).map((p: any) => (`
- **L598** : `{plantTerroirs.map((pt: any) => (`
- *... et 16 autres occurrences*

### `client/src/pages/PlantTerroirNetwork.tsx`

- **L38** : `? Array.from(new Set(terroirs.map((t: any) => t.country).filter((c: string | null | undefined): c is string => Boolean(c`
- **L38** : `? Array.from(new Set(terroirs.map((t: any) => t.country).filter((c: string | null | undefined): c is string => Boolean(c`

### `client/src/pages/PlantVarieties.tsx`

- **L565** : `{displayedVarieties.map((item: any) => (`
- **L565** : `{displayedVarieties.map((item: any) => (`

### `client/src/pages/PublicationMoleculeGraph.tsx`

- **L59** : `data.publications?.forEach((pub: any) => {`
- **L70** : `data.molecules?.forEach((mol: any) => {`
- **L59** : `data.publications?.forEach((pub: any) => {`
- **L70** : `data.molecules?.forEach((mol: any) => {`

### `client/src/pages/PyrolysisVisualization.tsx`

- **L397** : `const mechs = new Set(allTransformations.map((t: any) => t.mechanism).filter(Boolean));`
- **L403** : `return allTransformations.filter((t: any) => {`
- **L487** : `filtered.slice(0, 50).map((t: any) => (`
- **L397** : `const mechs = new Set(allTransformations.map((t: any) => t.mechanism).filter(Boolean));`
- **L403** : `return allTransformations.filter((t: any) => {`
- **L487** : `filtered.slice(0, 50).map((t: any) => (`

### `client/src/pages/RawMaterialDetail.tsx`

- **L573** : `{molecules.slice(0, 10).map((mol: any) => (`
- **L573** : `{molecules.slice(0, 10).map((mol: any) => (`

### `client/src/pages/RawMaterials.tsx`

- **L253** : `const filteredMaterials = rawMaterials?.filter((material: any) => {`
- **L386** : `{filteredMaterials.map((material: any) => (`
- **L403** : `{(materials as unknown[]).map((material: any) => (`
- **L253** : `const filteredMaterials = rawMaterials?.filter((material: any) => {`
- **L386** : `{filteredMaterials.map((material: any) => (`

### `client/src/pages/RawMaterialsInventory.tsx`

- **L125** : `{stats.byCategory?.find((c: any) => c.category === 'huile_essentielle')?.count || 0}`
- **L171** : `{materials.map((material: any) => (`
- **L125** : `{stats.byCategory?.find((c: any) => c.category === 'huile_essentielle')?.count || 0}`
- **L171** : `{materials.map((material: any) => (`

### `client/src/pages/RecetteCBDDetail.tsx`

- **L282** : `molecules={molecules.map((item: any) => ({`
- **L324** : `{molecules.map((item: any) => {`
- **L364** : `{molecules.map((item: any) => (`
- **L382** : `labels: molecules.map((item: any) => item.molecule.name),`
- **L385** : `data: molecules.map((item: any) => parseFloat(item.proportion) || 0),`
- **L282** : `molecules={molecules.map((item: any) => ({`
- **L324** : `{molecules.map((item: any) => {`
- **L364** : `{molecules.map((item: any) => (`
- *... et 2 autres occurrences*

### `client/src/pages/RecetteDetail.tsx`

- **L481** : `{molecules.slice(0, 12).map((m: any) => (`
- **L715** : `{molecules.filter((m: any) => m.role === 'tête').length > 0 && (`
- **L719** : `Notes de Tête ({molecules.filter((m: any) => m.role === 'tête').length})`
- **L722** : `{molecules.filter((m: any) => m.role === 'tête').map((molecule: any) => (`
- **L737** : `{molecules.filter((m: any) => m.role === 'cœur').length > 0 && (`
- **L741** : `Notes de Cœur ({molecules.filter((m: any) => m.role === 'cœur').length})`
- **L744** : `{molecules.filter((m: any) => m.role === 'cœur').map((molecule: any) => (`
- **L759** : `{molecules.filter((m: any) => m.role === 'fond').length > 0 && (`
- *... et 66 autres occurrences*

### `client/src/pages/RecettesTL.tsx`

- **L368** : `return allRecettes.filter((r: any) =>`
- **L376** : `return terpProfiles.filter((tp: any) =>`
- **L470** : `{tlRecipes.map((recipe: any) => (`
- **L560** : `{relatedProfiles.map((profile: any) => (`
- **L368** : `return allRecettes.filter((r: any) =>`
- **L376** : `return terpProfiles.filter((tp: any) =>`
- **L470** : `{tlRecipes.map((recipe: any) => (`
- **L560** : `{relatedProfiles.map((profile: any) => (`

### `client/src/pages/RechercheProfilMoleculaire.tsx`

- **L105** : `return plants.filter((plant: any) => {`
- **L342** : `{filteredPlants.map((plant: any) => (`
- **L105** : `return plants.filter((plant: any) => {`
- **L342** : `{filteredPlants.map((plant: any) => (`

### `client/src/pages/ReferenceEntityLinkManager.tsx`

- **L194** : `{links?.filter((l: any) => l.entityType === 'molecule').length || 0}`
- **L210** : `{links?.filter((l: any) => l.entityType === 'plant').length || 0}`
- **L226** : `{links?.filter((l: any) => l.entityType === 'prototype').length || 0}`
- **L383** : `{references?.map((ref: any) => (`
- **L400** : `{getEntitiesForType(selectedEntityType).map((entity: any) => (`
- **L194** : `{links?.filter((l: any) => l.entityType === 'molecule').length || 0}`
- **L210** : `{links?.filter((l: any) => l.entityType === 'plant').length || 0}`
- **L226** : `{links?.filter((l: any) => l.entityType === 'prototype').length || 0}`
- *... et 2 autres occurrences*

### `client/src/pages/ReferencesV3.tsx`

- **L120** : `const filteredReferences = (references as unknown[] | undefined)?.filter((ref: any) => {`
- **L136** : `v3: (references as unknown[] | undefined)?.filter((r: any) => r.packVersion === 'v3').length || 0,`
- **L137** : `v4: (references as unknown[] | undefined)?.filter((r: any) => r.packVersion === 'v4').length || 0,`
- **L345** : `nodes={graphData.nodes.map((n: any) => ({ ...n, color: n.color || META_AXIS_COLORS[n.metaAxis] || '#6366f1' }))}`
- **L659** : `{molecules?.map((mol: any) => (`
- **L345** : `nodes={graphData.nodes.map((n: any) => ({ ...n, color: n.color || META_AXIS_COLORS[n.metaAxis] || '#6366f1' }))}`
- **L659** : `{molecules?.map((mol: any) => (`

### `client/src/pages/RelationsGraph.tsx`

- **L73** : `const axis = axes?.find((a: any) => a.id === link.axisId);`
- **L93** : `const axis = axes?.find((a: any) => a.id === link.axisId);`
- **L109** : `(plants || []).slice(0, 30).forEach((plant: any) => {`
- **L130** : `botanicalAxes.slice(0, 1).forEach((axis: any) => {`
- **L144** : `(molecules || []).slice(0, 30).forEach((mol: any) => {`
- **L164** : `chemicalAxes.slice(0, 1).forEach((axis: any) => {`
- **L178** : `(terroirs || []).slice(0, 20).forEach((terroir: any) => {`
- **L198** : `terroirAxes.slice(0, 1).forEach((axis: any) => {`
- *... et 10 autres occurrences*

### `client/src/pages/ResearchData.tsx`

- **L246** : `{methodsPerformance.slice(0, 6).map((method: any) => (`
- **L271** : `{stats?.publicationsBySubject?.map((item: any) => (`
- **L291** : `{stats?.publicationsByYear?.map((item: any) => (`
- **L311** : `{publications.map((pub: any) => (`
- **L367** : `{methods.map((method: any) => (`
- **L421** : `{researchers.map((researcher: any) => (`
- **L466** : `{institutions.map((inst: any) => (`
- **L246** : `{methodsPerformance.slice(0, 6).map((method: any) => (`
- *... et 6 autres occurrences*

### `client/src/pages/ReseauAxes.tsx`

- **L411** : `const axisReferenceQueries = axes.map((axis: any) =>`
- **L440** : `const refs1Ids = new Set(refs1.map((r: any) => r.id));`
- **L441** : `const sharedRefs = refs2.filter((r: any) => refs1Ids.has(r.id));`
- **L448** : `references: sharedRefs.map((r: any) => r.title),`
- **L575** : `{filteredReferences.slice(0, 20).map((ref: any) => (`
- **L629** : `{axes.map((axis: any) => (`
- **L660** : `{(referencesByAxis[selectedAxis] || []).map((ref: any) => (`
- **L411** : `const axisReferenceQueries = axes.map((axis: any) =>`
- *... et 6 autres occurrences*

### `client/src/pages/SimplifiedContributorForm.tsx`

- **L170** : `const filteredMolecules = allMolecules?.filter((m: any) =>`
- **L174** : `const filteredPlants = allPlants?.filter((p: any) =>`
- **L639** : `{filteredMolecules.map((mol: any) => (`
- **L678** : `{filteredPlants.map((plant: any) => (`
- **L170** : `const filteredMolecules = allMolecules?.filter((m: any) =>`
- **L174** : `const filteredPlants = allPlants?.filter((p: any) =>`
- **L639** : `{filteredMolecules.map((mol: any) => (`
- **L678** : `{filteredPlants.map((plant: any) => (`

### `client/src/pages/SmilesViewer.tsx`

- **L70** : `SmilesDrawer.parse(smiles, (tree: any) => {`
- **L70** : `SmilesDrawer.parse(smiles, (tree: any) => {`

### `client/src/pages/SourcingHub.tsx`

- **L330** : `const set = new Set(suppliers.map((s: any) => s.country).filter(Boolean));`
- **L335** : `const set = new Set(suppliers.map((s: any) => s.supplierType).filter(Boolean));`
- **L343** : `result = result.filter((s: any) => getCategory(s.supplierId) === filterCategory);`
- **L347** : `result = result.filter((s: any) => s.supplierType === filterType);`
- **L351** : `result = result.filter((s: any) => s.country === filterCountry);`
- **L356** : `result = result.filter((s: any) =>`
- **L407** : `const handleMapReady = useCallback((map: any) => {`
- **L411** : `suppliers.forEach((s: any) => {`
- *... et 26 autres occurrences*

### `client/src/pages/SpectraComparison.tsx`

- **L235** : `return allSpectra.filter((s: any) =>`
- **L243** : `const addSpectrum = (spectrum: any) => {`
- **L327** : `{filteredSpectra.map((spectrum: any) => (`
- **L235** : `return allSpectra.filter((s: any) =>`
- **L243** : `const addSpectrum = (spectrum: any) => {`
- **L327** : `{filteredSpectra.map((spectrum: any) => (`

### `client/src/pages/SpectraIdentification.tsx`

- **L280** : `const matches = referenceSpectra.map((ref: any) => {`
- **L280** : `const matches = referenceSpectra.map((ref: any) => {`

### `client/src/pages/SynergiesHeatmap.tsx`

- **L79** : `synergies.forEach((s: any) => {`
- **L89** : `return synergies.filter((s: any) => {`
- **L103** : `potentialisation: synergies.filter((s: any) => s.type === "potentialisation").length,`
- **L104** : `stabilisation: synergies.filter((s: any) => s.type === "stabilisation").length,`
- **L105** : `transformation: synergies.filter((s: any) => s.type === "transformation").length,`
- **L106** : `masquage: synergies.filter((s: any) => s.type === "masquage").length,`
- **L107** : `neutralisation: synergies.filter((s: any) => s.type === "neutralisation").length,`
- **L79** : `synergies.forEach((s: any) => {`
- *... et 6 autres occurrences*

### `client/src/pages/SynergiesPage.tsx`

- **L169** : `moleculeSynergies?.forEach((ms: any) => {`
- **L393** : `const uniqueTypes = new Set(synergies.map((s: any) => s.type).filter(Boolean));`
- **L399** : `return synergies.filter((synergy: any) => {`
- **L413** : `synergies.forEach((s: any) => {`
- **L876** : `{filteredSynergies.map((synergy: any) => (`
- **L169** : `moleculeSynergies?.forEach((ms: any) => {`
- **L393** : `const uniqueTypes = new Set(synergies.map((s: any) => s.type).filter(Boolean));`
- **L399** : `return synergies.filter((synergy: any) => {`
- *... et 2 autres occurrences*

### `client/src/pages/TabacDetail.tsx`

- **L28** : `const tabacSynergies = synergies?.filter((s: any) => s.tabacId === tabacId) || [];`
- **L136** : `{tabacWithMolecules.molecules.map((mol: any) => (`
- **L176** : `{tabacSynergies.map((syn: any) => (`
- **L28** : `const tabacSynergies = synergies?.filter((s: any) => s.tabacId === tabacId) || [];`
- **L136** : `{tabacWithMolecules.molecules.map((mol: any) => (`
- **L176** : `{tabacSynergies.map((syn: any) => (`

### `client/src/pages/TechnicalProtocols.tsx`

- **L87** : `{categories?.map((c: any) => (`
- **L123** : `{data?.protocols.map((protocol: any) => (`
- **L87** : `{categories?.map((c: any) => (`
- **L123** : `{data?.protocols.map((protocol: any) => (`

### `client/src/pages/TerpProfiles.tsx`

- **L230** : `const filteredProfiles = profiles?.filter((profile: any) => {`
- **L399** : `{filteredProfiles.map((profile: any) => (`
- **L415** : `{axisProfiles.map((profile: any) => (`
- **L230** : `const filteredProfiles = profiles?.filter((profile: any) => {`
- **L399** : `{filteredProfiles.map((profile: any) => (`
- **L415** : `{axisProfiles.map((profile: any) => (`

### `client/src/pages/TerpProfilesCompare.tsx`

- **L51** : `const getProfileData = (profile: any) => [`
- **L161** : `concentrate.forEach((item: any) => {`
- **L185** : `const item = concentrate.find((c: any) => c.ingredient === molecule);`
- **L239** : `return profiles.filter((p: any) => selectedProfiles.includes(p.id));`
- **L328** : `{(collectionProfiles as unknown[]).map((profile: any) => (`
- **L409** : `{selectedProfilesData.map((profile: any) => (`
- **L51** : `const getProfileData = (profile: any) => [`
- **L161** : `concentrate.forEach((item: any) => {`
- *... et 3 autres occurrences*

### `client/src/pages/TerpeneDetail.tsx`

- **L402** : `{data.recettes.map((recette: any) => (`
- **L402** : `{data.recettes.map((recette: any) => (`

### `client/src/pages/TerroirDetail.tsx`

- **L50** : `...(plants as unknown[]).map((p: any) => ({`
- **L56** : `...(rawMaterialsByTerroir as unknown[]).map((rm: any) => ({`
- **L226** : `{plants.map((plant: any) => (`
- **L366** : `{similarTerroirs.map((similar: any) => (`
- **L226** : `{plants.map((plant: any) => (`
- **L366** : `{similarTerroirs.map((similar: any) => (`

### `client/src/pages/Terroirs.tsx`

- **L153** : `plantTerroirs.forEach((pt: any) => {`
- **L401** : `.filter((pt: any) => pt.terroirId === terroir.id)`
- **L402** : `.map((pt: any) => pt.plantId);`
- **L508** : `? Array.from(new Set(terroirs.map((t: any) => t.country).filter(Boolean))).sort()`
- **L513** : `? Array.from(new Set(terroirs.map((t: any) => t.climateType).filter(Boolean))).sort()`
- **L517** : `const filteredTerroirs = terroirs?.filter((terroir: any) => {`
- **L754** : `{countryTerroirs.map((terroir: any) => (`
- **L781** : `terroirs={filteredTerroirs.map((t: any) => ({`
- *... et 8 autres occurrences*

### `client/src/pages/TobaccoLandraceDetail.tsx`

- **L172** : `const matchedSpectra = peaks?.map((peak: any) => {`
- **L173** : `const spectrum = msSpectra?.find((s: any) =>`
- **L183** : `const spectraAvailable = matchedSpectra.filter((p: any) => p.hasSpectrum);`
- **L184** : `const spectraMissing = matchedSpectra.filter((p: any) => !p.hasSpectrum);`
- **L345** : `const landrace = landraces?.find((l: any) => l.name === landraceName);`
- **L346** : `const chromatogram = chromatograms?.find((c: any) => c.landrace_name === landraceName);`
- **L172** : `const matchedSpectra = peaks?.map((peak: any) => {`
- **L173** : `const spectrum = msSpectra?.find((s: any) =>`
- *... et 4 autres occurrences*

### `client/src/pages/TobaccoLandraces.tsx`

- **L267** : `{stats.byStatus?.find((s: any) => s.status === "extinct")?.count || 0}`
- **L267** : `{stats.byStatus?.find((s: any) => s.status === "extinct")?.count || 0}`

### `client/src/pages/VarietyDetail.tsx`

- **L169** : `const filteredVarieties = (allVarieties?.items ?? []).filter((v: any) =>`
- **L280** : `label: (context: any) => {`
- **L851** : `{filteredVarieties.slice(0, 50).map((v: any) => (`
- **L934** : `{(genealogyData!.parents as unknown[]).map((rel: any) => (`
- **L974** : `{(genealogyData!.children as unknown[]).map((rel: any) => (`
- **L1176** : `items: (molecules || []).map((mol: any) => ({`
- **L1203** : `...(genealogyData?.parents || []).map((p: any) => ({`
- **L1210** : `...(genealogyData?.children || []).map((c: any) => ({`
- *... et 6 autres occurrences*

### `client/src/pages/VueDetailConnexions.tsx`

- **L74** : `const terroirMap = new Map(networkData.entities.terroirs.map((t: any) => [t.id, t]));`
- **L75** : `const plantMap = new Map(networkData.entities.plants.map((p: any) => [p.id, p]));`
- **L77** : `networkData.relationships.terroirPlants.forEach((rel: any) => {`
- **L94** : `const plantMap = new Map(networkData.entities.plants.map((p: any) => [p.id, p]));`
- **L95** : `const moleculeMap = new Map(networkData.entities.molecules.map((m: any) => [m.id, m]));`
- **L97** : `networkData.relationships.plantMolecules.forEach((rel: any) => {`
- **L74** : `const terroirMap = new Map(networkData.entities.terroirs.map((t: any) => [t.id, t]));`
- **L75** : `const plantMap = new Map(networkData.entities.plants.map((p: any) => [p.id, p]));`
- *... et 4 autres occurrences*

### `client/src/pages/__tests__/Tabacotheque.test.ts`

- **L276** : `const isValidVariety = (v: any) => {`
- **L276** : `const isValidVariety = (v: any) => {`

### `client/src/pages/admin/AdminAccords.tsx`

- **L159** : `const handleEdit = (accord: any) => {`
- **L177** : `const handleDelete = (accord: any) => {`
- **L159** : `const handleEdit = (accord: any) => {`
- **L177** : `const handleDelete = (accord: any) => {`

### `client/src/pages/admin/AdminFamilles.tsx`

- **L136** : `const handleEdit = (family: any) => {`
- **L151** : `const handleDelete = (family: any) => {`
- **L136** : `const handleEdit = (family: any) => {`
- **L151** : `const handleDelete = (family: any) => {`

### `client/src/pages/admin/AdminMatieres.tsx`

- **L213** : `const handleEdit = (matiere: any) => {`
- **L240** : `const handleDelete = (matiere: any) => {`
- **L213** : `const handleEdit = (matiere: any) => {`
- **L240** : `const handleDelete = (matiere: any) => {`

### `client/src/pages/admin/AdminMoleculesIndex.tsx`

- **L93** : `const handleEditRadar = (molecule: any) => {`
- **L93** : `const handleEditRadar = (molecule: any) => {`

### `client/src/pages/admin/AdminPlantMolecules.tsx`

- **L158** : `return plantMolecules.data.filter((item: any) => {`
- **L293** : `{plantResults.data.map((plant: any) => (`
- **L555** : `{moleculeResults.data.map((mol: any) => (`
- **L158** : `return plantMolecules.data.filter((item: any) => {`
- **L293** : `{plantResults.data.map((plant: any) => (`
- **L555** : `{moleculeResults.data.map((mol: any) => (`

### `client/src/pages/admin/AdminSynergies.tsx`

- **L44** : `const filteredMolSynergies = (moleculeSynergies || []).filter((s: any) => {`
- **L55** : `const filteredTabacSynergies = (tabacSynergies || []).filter((s: any) => {`
- **L69** : `[...(moleculeSynergies || []), ...(tabacSynergies || [])].forEach((s: any) => {`
- **L215** : `{filteredMolSynergies.map((s: any) => (`
- **L269** : `{filteredTabacSynergies.map((s: any) => (`
- **L44** : `const filteredMolSynergies = (moleculeSynergies || []).filter((s: any) => {`
- **L55** : `const filteredTabacSynergies = (tabacSynergies || []).filter((s: any) => {`
- **L69** : `[...(moleculeSynergies || []), ...(tabacSynergies || [])].forEach((s: any) => {`
- *... et 2 autres occurrences*

### `client/src/pages/admin/CigarilloMoleculeLinking.tsx`

- **L70** : `return recipesData.recipes.filter((r: any) =>`
- **L90** : `const selectedRecipe = recipesData?.recipes?.find((r: any) => r.id === selectedRecipeId);`
- **L149** : `{filteredRecipes.map((recipe: any) => (`
- **L179** : `{recipesData?.recipes?.map((r: any) => (`
- **L201** : `{filteredMolecules.map((m: any) => (`
- **L70** : `return recipesData.recipes.filter((r: any) =>`
- **L90** : `const selectedRecipe = recipesData?.recipes?.find((r: any) => r.id === selectedRecipeId);`
- **L149** : `{filteredRecipes.map((recipe: any) => (`
- *... et 2 autres occurrences*

### `client/src/pages/admin/DataQuality.tsx`

- **L586** : `{moleculesWithoutRecettes.slice(0, 3).map((m: any) => (`
- **L609** : `{moleculesWithoutPlants.slice(0, 3).map((m: any) => (`
- **L632** : `{plantsWithoutMolecules.slice(0, 3).map((p: any) => (`
- **L586** : `{moleculesWithoutRecettes.slice(0, 3).map((m: any) => (`
- **L609** : `{moleculesWithoutPlants.slice(0, 3).map((m: any) => (`
- **L632** : `{plantsWithoutMolecules.slice(0, 3).map((p: any) => (`

### `client/src/pages/admin/LiaisonRecettesMolecules.tsx`

- **L62** : `const molecule = molecules.find((m: any) => m.id === mf.moleculeId);`
- **L86** : `return recettes.filter((r: any) => {`
- **L97** : `recettes.forEach((r: any) => {`
- **L116** : `const molecule = molecules?.find((m: any) => m.id === moleculeId);`
- **L180** : `liaisonsExistantes.map((l: any) => ({`
- **L273** : `recettesFiltrees.map((r: any) => (`
- **L324** : `moleculesFiltrees.slice(0, 10).map((m: any) => (`
- **L62** : `const molecule = molecules.find((m: any) => m.id === mf.moleculeId);`
- *... et 6 autres occurrences*

### `client/src/pages/admin/MoleculeManager.tsx`

- **L234** : `IDs: {group.molecules.map((m: any) => m.id).join(", ")}`
- **L351** : `const getDisplayPercentage = (rel: any) => {`
- **L358** : `const filtered = data?.relations?.filter((r: any) =>`
- **L487** : `{filtered.map((rel: any) => (`
- **L234** : `IDs: {group.molecules.map((m: any) => m.id).join(", ")}`
- **L351** : `const getDisplayPercentage = (rel: any) => {`
- **L358** : `const filtered = data?.relations?.filter((r: any) =>`
- **L487** : `{filtered.map((rel: any) => (`

### `client/src/pages/admin/MoleculeOriginsAdmin.tsx`

- **L89** : `const associatedIds = new Set(originMolecules?.map((om: any) => om.moleculeId) || []);`
- **L90** : `return molecules.filter((m: any) => !associatedIds.has(m.id));`
- **L96** : `return availableMolecules.filter((m: any) =>`
- **L184** : `{origins?.filter((o: any) => (o.moleculeCount || 0) > 0).length || 0}`
- **L237** : `{originMolecules.map((om: any) => (`
- **L339** : `filteredAvailableMolecules.map((molecule: any) => (`
- **L89** : `const associatedIds = new Set(originMolecules?.map((om: any) => om.moleculeId) || []);`
- **L90** : `return molecules.filter((m: any) => !associatedIds.has(m.id));`
- *... et 4 autres occurrences*

### `client/src/pages/admin/TerroirsGeocode.tsx`

- **L54** : `const filteredOrigins = origins?.filter((origin: any) => {`
- **L64** : `const geocodedOrigins = origins?.filter((o: any) => o.latitude && o.longitude).length || 0;`
- **L67** : `const handleGeocode = (origin: any) => {`
- **L200** : `{batchResults.results.filter((r: any) => !r.success).length > 0 && (`
- **L204** : `{batchResults.results.filter((r: any) => !r.success).map((r: any) => (`
- **L230** : `{filteredOrigins?.map((origin: any) => (`
- **L54** : `const filteredOrigins = origins?.filter((origin: any) => {`
- **L64** : `const geocodedOrigins = origins?.filter((o: any) => o.latitude && o.longitude).length || 0;`
- *... et 4 autres occurrences*

### `client/src/pages/outils/EditeurFormulation.tsx`

- **L55** : `const molecule = molecules.find((m: any) => m.id === mf.moleculeId);`
- **L77** : `return molecules.filter((m: any) => {`
- **L95** : `const molecule = molecules?.find((m: any) => m.id === draggedItem);`
- **L264** : `moleculesFiltrees.slice(0, 50).map((m: any) => (`
- **L55** : `const molecule = molecules.find((m: any) => m.id === mf.moleculeId);`
- **L77** : `return molecules.filter((m: any) => {`
- **L95** : `const molecule = molecules?.find((m: any) => m.id === draggedItem);`
- **L264** : `moleculesFiltrees.slice(0, 50).map((m: any) => (`

### `server/routers/gbif.ts`

- **L40** : `return (data.results || []).map((s: any) => s.scientificName).filter(Boolean).slice(0, 10);`
- **L59** : `const lats = results.map((r: any) => r.decimalLatitude).filter((v: any) => v != null);`
- **L60** : `const lons = results.map((r: any) => r.decimalLongitude).filter((v: any) => v != null);`
- **L61** : `const elevs = results.map((r: any) => r.elevation).filter((v: any) => v != null && v > -500 && v < 9000);`
- **L87** : `const tempMax = (daily.temperature_2m_max || []).filter((v: any) => v != null);`
- **L88** : `const tempMin = (daily.temperature_2m_min || []).filter((v: any) => v != null);`
- **L89** : `const precip = (daily.precipitation_sum || []).filter((v: any) => v != null);`
- **L40** : `return (data.results || []).map((s: any) => s.scientificName).filter(Boolean).slice(0, 10);`
- *... et 6 autres occurrences*

### `server/routers/lotus.ts`

- **L61** : `return bindings.map((b: any) => ({`
- **L68** : `})).filter((m: any) => m.wikidataId && m.name);`
- **L61** : `return bindings.map((b: any) => ({`
- **L68** : `})).filter((m: any) => m.wikidataId && m.name);`

## Callbacks D3 `(d: any)`

**Correction suggérée :** Utiliser les types D3 : `SimulationNodeDatum`, `HierarchyNode`, etc.

### `client/src/components/BiosyntheticPathwayFlow.tsx`

- **L173** : `.id((d: any) => d.id)`
- **L179** : `.force("x", d3.forceX().x((d: any) => {`
- **L274** : `.attr("x1", (d: any) => d.source.x)`
- **L275** : `.attr("y1", (d: any) => d.source.y)`
- **L276** : `.attr("x2", (d: any) => d.target.x)`
- **L277** : `.attr("y2", (d: any) => d.target.y);`
- **L279** : `node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);`
- **L173** : `.id((d: any) => d.id)`
- *... et 6 autres occurrences*

### `client/src/components/BiosyntheticPathwayViz.tsx`

- **L244** : `.filter((d: any) => d.type === "conversion")`
- **L334** : `.attr("transform", (d: any) => d.type === "enzyme" || d.type === "gene" ? "rotate(45) scale(1)" : "scale(1)")`
- **L244** : `.filter((d: any) => d.type === "conversion")`
- **L334** : `.attr("transform", (d: any) => d.type === "enzyme" || d.type === "gene" ? "rotate(45) scale(1)" : "scale(1)")`

### `client/src/components/ChemicalFamilyHierarchyGraph.tsx`

- **L310** : `.id((d: any) => d.id)`
- **L315** : `.strength((d: any) => -150 - d.linkCount * 15)`
- **L318** : `.force("collision", d3.forceCollide().radius((d: any) => {`
- **L358** : `.attr("r", (d: any) => d.type === "family" ? 22 + d.linkCount * 1.5 : 10 + d.linkCount * 0.5)`
- **L359** : `.attr("fill", (d: any) => {`
- **L365** : `.attr("stroke", (d: any) => d.type === "family" ? "#1e293b" : "#475569")`
- **L373** : `.attr("font-size", (d: any) => d.type === "family" ? "12px" : "8px")`
- **L375** : `.text((d: any) => d.type === "family" ? "🧪" : "⚗️");`
- *... et 44 autres occurrences*

### `client/src/components/CitationNetworkView.tsx`

- **L73** : `(node: any) =>`
- **L83** : `(node: any) =>`
- **L93** : `(node: any) => node.authors?.toLowerCase().includes(selectedAuthor.toLowerCase())`
- **L99** : `filteredLinks = filteredLinks.filter((link: any) => {`
- **L112** : `citationGraph.nodes.forEach((node: any) => {`
- **L73** : `(node: any) =>`
- **L83** : `(node: any) =>`
- **L93** : `(node: any) => node.authors?.toLowerCase().includes(selectedAuthor.toLowerCase())`
- *... et 2 autres occurrences*

### `client/src/components/DuplicateManagementModal.tsx`

- **L132** : `.filter((d: any) => d.id !== selectedId)`
- **L133** : `.map((d: any) => d.id);`
- **L288** : `const selectedEntry = data.find((d: any) => d.id === selectedId);`
- **L289** : `const otherEntries = data.filter((d: any) => d.id !== selectedId);`
- **L132** : `.filter((d: any) => d.id !== selectedId)`
- **L133** : `.map((d: any) => d.id);`
- **L288** : `const selectedEntry = data.find((d: any) => d.id === selectedId);`
- **L289** : `const otherEntries = data.filter((d: any) => d.id !== selectedId);`

### `client/src/components/EntityLinker.tsx`

- **L357** : `{existingLinks.map((link: any) => (`
- **L357** : `{existingLinks.map((link: any) => (`

### `client/src/components/ForceGraph.tsx`

- **L185** : `.id((d: any) => d.id)`
- **L190** : `.force("collision", d3.forceCollide().radius((d: any) => (nodeSizes[d.type] || 15) + 5));`
- **L217** : `.attr("stroke-width", (d: any) => Math.sqrt(d.strength || 1));`
- **L245** : `.attr("r", (d: any) => nodeSizes[d.type] || 15)`
- **L246** : `.attr("fill", (d: any) => d.color || nodeColors[d.type] || "#666")`
- **L269** : `.text((d: any) => d.label.length > 15 ? d.label.substring(0, 15) + "..." : d.label)`
- **L271** : `.attr("y", (d: any) => (nodeSizes[d.type] || 15) + 14)`
- **L280** : `.attr("x1", (d: any) => d.source.x)`
- *... et 16 autres occurrences*

### `client/src/components/ForceGraphAxes.tsx`

- **L134** : `.strength((d: any) => d.type === "axis" ? -300 : -50))`
- **L137** : `.radius((d: any) => d.size + 5));`
- **L241** : `.attr("x1", (d: any) => d.source.x)`
- **L242** : `.attr("y1", (d: any) => d.source.y)`
- **L243** : `.attr("x2", (d: any) => d.target.x)`
- **L244** : `.attr("y2", (d: any) => d.target.y);`
- **L134** : `.strength((d: any) => d.type === "axis" ? -300 : -50))`
- **L137** : `.radius((d: any) => d.size + 5));`
- *... et 4 autres occurrences*

### `client/src/components/LinkedReferences.tsx`

- **L91** : `{displayedLinks.map((link: any) => {`
- **L91** : `{displayedLinks.map((link: any) => {`

### `client/src/components/PlantMoleculeGraph.tsx`

- **L221** : `.id((d: any) => d.id)`
- **L222** : `.distance((d: any) => {`
- **L226** : `.strength((d: any) => {`
- **L232** : `.strength((d: any) => {`
- **L238** : `.force("collision", d3.forceCollide().radius((d: any) => {`
- **L248** : `.attr("stroke", (d: any) => d.isSignature ? "#8b5cf6" : "#94a3b8")`
- **L249** : `.attr("stroke-opacity", (d: any) => 0.3 + (d.percentageTypical / 100) * 0.5)`
- **L250** : `.attr("stroke-width", (d: any) => {`
- *... et 38 autres occurrences*

### `client/src/components/SankeyDiagram.tsx`

- **L61** : `.attr("stroke", (d: any) => {`
- **L65** : `.attr("stroke-width", (d: any) => Math.max(1, d.width))`
- **L75** : `.text((d: any) => `${d.source.name} → ${d.target.name}\n${d.value} recettes`);`
- **L83** : `.attr("x", (d: any) => d.x0)`
- **L84** : `.attr("y", (d: any) => d.y0)`
- **L85** : `.attr("height", (d: any) => d.y1 - d.y0)`
- **L86** : `.attr("width", (d: any) => d.x1 - d.x0)`
- **L87** : `.attr("fill", (d: any) => colorScale(d.category))`
- *... et 18 autres occurrences*

### `client/src/components/charts/EnhancedSankeyDiagram.tsx`

- **L219** : `.attr("stroke-width", (d: any) => Math.max(1, d.width))`
- **L274** : `.attr("x", (d: any) => d.x0)`
- **L275** : `.attr("y", (d: any) => d.y0)`
- **L276** : `.attr("height", (d: any) => Math.max(1, d.y1 - d.y0))`
- **L277** : `.attr("width", (d: any) => d.x1 - d.x0)`
- **L278** : `.attr("fill", (d: any) => getNodeColor(d.category))`
- **L353** : `.attr("x", (d: any) => (d.x0 < innerWidth / 2 ? d.x1 + 8 : d.x0 - 8))`
- **L354** : `.attr("y", (d: any) => (d.y1 + d.y0) / 2)`
- *... et 20 autres occurrences*

### `client/src/components/charts/PlantTerroirNetworkGraph.tsx`

- **L114** : `.id((d: any) => d.id)`
- **L115** : `.distance((d: any) => {`
- **L254** : `.attr("r", (d: any) => {`
- **L288** : `.attr("r", (d: any) => {`
- **L301** : `.attr("stroke-width", (d: any) => d.value ? Math.sqrt(d.value) + 1 : 2);`
- **L310** : `.attr("x1", (d: any) => d.source.x)`
- **L311** : `.attr("y1", (d: any) => d.source.y)`
- **L312** : `.attr("x2", (d: any) => d.target.x)`
- *... et 12 autres occurrences*

### `client/src/components/charts/RecipeNetworkGraph.tsx`

- **L70** : `.id((d: any) => d.id)`
- **L168** : `.attr("x1", (d: any) => d.source.x)`
- **L169** : `.attr("y1", (d: any) => d.source.y)`
- **L170** : `.attr("x2", (d: any) => d.target.x)`
- **L171** : `.attr("y2", (d: any) => d.target.y);`
- **L173** : `node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);`
- **L70** : `.id((d: any) => d.id)`
- **L168** : `.attr("x1", (d: any) => d.source.x)`
- *... et 4 autres occurrences*

### `client/src/components/charts/TerrainPlantMoleculeGraph.tsx`

- **L230** : `.id((d: any) => d.id)`
- **L231** : `.distance((d: any) => {`
- **L237** : `.strength((d: any) => {`
- **L242** : `.force("charge", d3.forceManyBody().strength((d: any) => {`
- **L249** : `.force("collision", d3.forceCollide().radius((d: any) => {`
- **L255** : `.force("y", d3.forceY((d: any) => {`
- **L285** : `.attr("stroke", (d: any) => {`
- **L289** : `.attr("stroke-opacity", (d: any) => d.isSignature ? 0.7 : 0.4)`
- *... et 30 autres occurrences*

### `client/src/pages/BiosyntheticPathways.tsx`

- **L199** : `.force("link", d3.forceLink(graphLinks).id((d: any) => d.id).distance(100))`
- **L257** : `.attr("x1", (d: any) => d.source.x)`
- **L258** : `.attr("y1", (d: any) => d.source.y)`
- **L259** : `.attr("x2", (d: any) => d.target.x)`
- **L260** : `.attr("y2", (d: any) => d.target.y);`
- **L262** : `node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);`
- **L199** : `.force("link", d3.forceLink(graphLinks).id((d: any) => d.id).distance(100))`
- **L257** : `.attr("x1", (d: any) => d.source.x)`
- *... et 4 autres occurrences*

### `client/src/pages/CigarilloRecipes.tsx`

- **L76** : `{stats.byDifficulty?.find((d: any) => d.difficulty_level === "expert")?.count || 0}`
- **L76** : `{stats.byDifficulty?.find((d: any) => d.difficulty_level === "expert")?.count || 0}`

### `client/src/pages/ClaimsAndProofsPage.tsx`

- **L208** : `{sources.map((source: any) => (`
- **L208** : `{sources.map((source: any) => (`

### `client/src/pages/GCMSChromatograms.tsx`

- **L37** : `.domain([0, d3.max(peaks, (d: any) => d.retention_time) as number + 2])`
- **L41** : `.domain([0, d3.max(peaks, (d: any) => d.peak_area) as number * 1.1])`
- **L37** : `.domain([0, d3.max(peaks, (d: any) => d.retention_time) as number + 2])`
- **L41** : `.domain([0, d3.max(peaks, (d: any) => d.peak_area) as number * 1.1])`

### `client/src/pages/GenealogyGraph.tsx`

- **L243** : `.id((d: any) => d.id)`
- **L256** : `.attr("stroke", (d: any) => RELATIONSHIP_COLORS[d.type] || "#6b7280")`
- **L259** : `.attr("marker-end", (d: any) => `url(#arrow-${d.type || "parent"})`);`
- **L324** : `.attr("x1", (d: any) => d.source.x)`
- **L325** : `.attr("y1", (d: any) => d.source.y)`
- **L326** : `.attr("x2", (d: any) => d.target.x)`
- **L327** : `.attr("y2", (d: any) => d.target.y);`
- **L328** : `node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);`
- *... et 8 autres occurrences*

### `client/src/pages/GrapheAxesThematiques.tsx`

- **L244** : `const handleNodeClick = (node: any) => {`
- **L244** : `const handleNodeClick = (node: any) => {`

### `client/src/pages/GrapheMoleculesRecettes.tsx`

- **L110** : `.force("link", d3.forceLink(links).id((d: any) => d.id).distance(linkDistance))`
- **L123** : `.attr("stroke-width", (d: any) => Math.sqrt(d.value) * 2);`
- **L141** : `.attr("r", (d: any) => d.type === "recette" ? nodeRadiusRecette : nodeRadiusMolecule)`
- **L142** : `.attr("fill", (d: any) => d.type === "recette" ? "#8b5cf6" : "#10b981")`
- **L185** : `.attr("r", (d: any) => d.type === "recette" ? 25 : 20)`
- **L198** : `.attr("r", (d: any) => d.type === "recette" ? 20 : 15)`
- **L227** : `.text((d: any) => isMobile && d.name.length > 12 ? d.name.substring(0, 10) + "..." : d.name)`
- **L237** : `.attr("x1", (d: any) => d.source.x)`
- *... et 16 autres occurrences*

### `client/src/pages/MoleculeDetail.tsx`

- **L523** : `{plantSources.map((source: any) => (`
- **L523** : `{plantSources.map((source: any) => (`

### `client/src/pages/PublicationMoleculeGraph.tsx`

- **L81** : `data.links?.forEach((link: any) => {`
- **L132** : `.id((d: any) => d.id)`
- **L211** : `.attr("x1", (d: any) => d.source.x)`
- **L212** : `.attr("y1", (d: any) => d.source.y)`
- **L213** : `.attr("x2", (d: any) => d.target.x)`
- **L214** : `.attr("y2", (d: any) => d.target.y);`
- **L216** : `node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);`
- **L81** : `data.links?.forEach((link: any) => {`
- *... et 6 autres occurrences*

### `client/src/pages/ReferenceEntityLinkManager.tsx`

- **L149** : `const filteredLinks = links?.filter((link: any) => {`
- **L287** : `{filteredLinks.map((link: any) => (`
- **L149** : `const filteredLinks = links?.filter((link: any) => {`
- **L287** : `{filteredLinks.map((link: any) => (`

### `client/src/pages/ReferencesGraph.tsx`

- **L243** : `.id((d: any) => d.id)`
- **L248** : `.force("collision", d3.forceCollide().radius((d: any) => d.size + 5));`
- **L271** : `.attr("stroke", (d: any) => d.type === 'primary' ? "#6366f1" : "#94a3b8")`
- **L272** : `.attr("stroke-opacity", (d: any) => d.type === 'primary' ? 0.6 : 0.3)`
- **L273** : `.attr("stroke-width", (d: any) => d.type === 'primary' ? 2 : 1)`
- **L274** : `.attr("stroke-dasharray", (d: any) => d.type === 'secondary' ? "4,4" : "none");`
- **L301** : `.attr("r", (d: any) => d.size)`
- **L302** : `.attr("fill", (d: any) => d.color)`
- *... et 30 autres occurrences*

### `client/src/pages/ReferencesV3.tsx`

- **L160** : `const handleNodeClick = (node: any) => {`
- **L160** : `const handleNodeClick = (node: any) => {`

### `client/src/pages/RelationsGraph.tsx`

- **L70** : `const linkedAxes = axisLinks?.filter((link: any) => link.referenceId === ref.id) || [];`
- **L72** : `linkedAxes.some((link: any) => {`
- **L92** : `linkedAxes.forEach((link: any) => {`
- **L70** : `const linkedAxes = axisLinks?.filter((link: any) => link.referenceId === ref.id) || [];`
- **L72** : `linkedAxes.some((link: any) => {`
- **L92** : `linkedAxes.forEach((link: any) => {`

### `client/src/pages/SimplifiedContributorForm.tsx`

- **L404** : `Doublons potentiels trouvés : {[...moleculeDuplicates.data?.exact || [], ...moleculeDuplicates.data?.similar || []].map(`
- **L521** : `Doublons potentiels trouvés : {[...plantDuplicates.data?.exact || [], ...plantDuplicates.data?.similar || []].map((d: an`
- **L404** : `Doublons potentiels trouvés : {[...moleculeDuplicates.data?.exact || [], ...moleculeDuplicates.data?.similar || []].map(`
- **L521** : `Doublons potentiels trouvés : {[...plantDuplicates.data?.exact || [], ...plantDuplicates.data?.similar || []].map((d: an`

### `client/src/pages/SynergiesGraphVisualization.tsx`

- **L243** : `.id((d: any) => d.id)`
- **L248** : `.force("collision", d3.forceCollide().radius((d: any) => getNodeRadius(d) + 5));`
- **L281** : `d3.select(this).attr("stroke-opacity", 1).attr("stroke-width", function(d: any) {`
- **L286** : `d3.select(this).attr("stroke-opacity", 0.6).attr("stroke-width", function(d: any) {`
- **L346** : `.attr("x1", (d: any) => d.source.x)`
- **L347** : `.attr("y1", (d: any) => d.source.y)`
- **L348** : `.attr("x2", (d: any) => d.target.x)`
- **L349** : `.attr("y2", (d: any) => d.target.y);`
- *... et 10 autres occurrences*

### `client/src/pages/SynergiesMoleculaires.tsx`

- **L99** : `d3.forceLink(graphData.links).id((d: any) => d.id).distance(150)`
- **L111** : `.attr("stroke", (d: any) => effectConfig[d.effectType as EffectType].color)`
- **L112** : `.attr("stroke-width", (d: any) => Math.max(2, d.intensity / 20))`
- **L150** : `.text((d: any) => d.name)`
- **L160** : `.attr("x1", (d: any) => d.source.x)`
- **L161** : `.attr("y1", (d: any) => d.source.y)`
- **L162** : `.attr("x2", (d: any) => d.target.x)`
- **L163** : `.attr("y2", (d: any) => d.target.y);`
- *... et 12 autres occurrences*

### `client/src/pages/SynergiesPage.tsx`

- **L234** : `.id((d: any) => d.id)`
- **L236** : `.strength((d: any) => d.strength))`
- **L247** : `.attr("stroke", (d: any) => linkColorScale(d.type))`
- **L249** : `.attr("stroke-dasharray", (d: any) => d.type === 'masquage' ? "4,4" : "none");`
- **L309** : `.attr("x1", (d: any) => d.source.x)`
- **L310** : `.attr("y1", (d: any) => d.source.y)`
- **L311** : `.attr("x2", (d: any) => d.target.x)`
- **L312** : `.attr("y2", (d: any) => d.target.y);`
- *... et 10 autres occurrences*

### `client/src/pages/TechnicalProtocols.tsx`

- **L63** : `{stats.byDifficulty?.find((d: any) => d.difficulty_level === "expert")?.count || 0}`
- **L63** : `{stats.byDifficulty?.find((d: any) => d.difficulty_level === "expert")?.count || 0}`

### `client/src/pages/TobaccoLandraceDetail.tsx`

- **L42** : `.domain([0, d3.max(peaks, (d: any) => d.retention_time) as number + 2])`
- **L46** : `.domain([0, d3.max(peaks, (d: any) => d.peak_area) as number * 1.1])`
- **L42** : `.domain([0, d3.max(peaks, (d: any) => d.retention_time) as number + 2])`
- **L46** : `.domain([0, d3.max(peaks, (d: any) => d.peak_area) as number * 1.1])`

### `client/src/pages/TpsGenesExplorer.tsx`

- **L618** : `{filteredLinks.map((link: any) => (`
- **L618** : `{filteredLinks.map((link: any) => (`

## Casts complexes `as any`

**Correction suggérée :** Utiliser `as unknown as TargetType` ou `satisfies`

### `client/src/components/AxisForceGraph.tsx`

- **L288** : `d3.zoom<SVGSVGElement, unknown>().scaleBy as any,`
- **L297** : `d3.zoom<SVGSVGElement, unknown>().transform as any,`
- **L288** : `d3.zoom<SVGSVGElement, unknown>().scaleBy as any,`
- **L297** : `d3.zoom<SVGSVGElement, unknown>().transform as any,`

### `client/src/components/BiosyntheticPathwayFlow.tsx`

- **L236** : `}) as any`
- **L236** : `}) as any`

### `client/src/components/BiosyntheticPathwayViz.tsx`

- **L272** : `}) as any`
- **L272** : `}) as any`

### `client/src/components/ChemicalFamilyHierarchyGraph.tsx`

- **L308** : `const simulation = d3.forceSimulation(networkData.nodes as any)`
- **L309** : `.force("link", d3.forceLink(networkData.links as any)`
- **L308** : `const simulation = d3.forceSimulation(networkData.nodes as any)`
- **L309** : `.force("link", d3.forceLink(networkData.links as any)`

### `client/src/components/CitationManager.tsx`

- **L150** : `citationType: citationType as any,`
- **L150** : `citationType: citationType as any,`

### `client/src/components/EnhancedRadarChart.tsx`

- **L142** : `.attr("d", areaGenerator as any)`
- **L142** : `.attr("d", areaGenerator as any)`

### `client/src/components/ForceGraph.tsx`

- **L241** : `}) as any);`
- **L241** : `}) as any);`

### `client/src/components/ForceGraphAxes.tsx`

- **L189** : `}) as any);`
- **L189** : `}) as any);`

### `client/src/components/GenealogyTree.tsx`

- **L143** : `markerEnd: { type: 'arrowclosed' as any, color: link.type === 'hybrid' ? '#f59e0b' : link.type === 'clone' ? '#8b5cf6' :`
- **L143** : `markerEnd: { type: 'arrowclosed' as any, color: link.type === 'hybrid' ? '#f59e0b' : link.type === 'clone' ? '#8b5cf6' :`

### `client/src/components/PlantImageUpload.tsx`

- **L134** : `category: category as any,`
- **L134** : `category: category as any,`

### `client/src/components/PlantMoleculeGraph.tsx`

- **L219** : `const simulation = d3.forceSimulation(graphData.nodes as any)`
- **L220** : `.force("link", d3.forceLink(graphData.links as any)`
- **L219** : `const simulation = d3.forceSimulation(graphData.nodes as any)`
- **L220** : `.force("link", d3.forceLink(graphData.links as any)`

### `client/src/components/RecentActivity.tsx`

- **L48** : `const item = entry.item as any;`
- **L48** : `const item = entry.item as any;`

### `client/src/components/SynergySuggestions.tsx`

- **L177** : `const molecule = allMolecules.find((m: any) => m.id === moleculeId) as any;`
- **L177** : `const molecule = allMolecules.find((m: any) => m.id === moleculeId) as any;`

### `client/src/components/TransformationChainGraph.tsx`

- **L480** : `d3.zoom<SVGSVGElement, unknown>().scaleBy as any,`
- **L490** : `d3.zoom<SVGSVGElement, unknown>().scaleBy as any,`
- **L500** : `d3.zoom<SVGSVGElement, unknown>().transform as any,`
- **L480** : `d3.zoom<SVGSVGElement, unknown>().scaleBy as any,`
- **L490** : `d3.zoom<SVGSVGElement, unknown>().scaleBy as any,`
- **L500** : `d3.zoom<SVGSVGElement, unknown>().transform as any,`

### `client/src/components/charts/OlfactiveRadarChart.tsx`

- **L79** : `const labels = Object.keys(SENSORY_DIMENSIONS).map(dim => getDimensionLabel(dim as any));`
- **L79** : `const labels = Object.keys(SENSORY_DIMENSIONS).map(dim => getDimensionLabel(dim as any));`

### `client/src/components/charts/PlantTerroirNetworkGraph.tsx`

- **L109** : `.forceSimulation(nodes as any)`
- **L145** : `.join("g") as any;`
- **L345** : `svg.transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3);`
- **L350** : `svg.transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.7);`
- **L359** : `d3.zoom<SVGSVGElement, unknown>().transform as any,`
- **L109** : `.forceSimulation(nodes as any)`
- **L145** : `.join("g") as any;`
- **L345** : `svg.transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3);`
- *... et 2 autres occurrences*

### `client/src/components/charts/RecipeNetworkGraph.tsx`

- **L65** : `.forceSimulation(nodes as any)`
- **L94** : `.join("g") as any;`
- **L203** : `svg.transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3);`
- **L208** : `svg.transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.7);`
- **L217** : `d3.zoom<SVGSVGElement, unknown>().transform as any,`
- **L65** : `.forceSimulation(nodes as any)`
- **L94** : `.join("g") as any;`
- **L203** : `svg.transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3);`
- *... et 2 autres occurrences*

### `client/src/components/charts/TerrainPlantMoleculeGraph.tsx`

- **L225** : `.forceSimulation(nodesCopy as any)`
- **L304** : `.attr("cursor", "pointer") as any;`
- **L530** : `.attr("x1", linksCopy.find(l => l.type === 'terroir-plant')?.source as any)`
- **L531** : `.attr("y1", linksCopy.find(l => l.type === 'terroir-plant')?.source as any)`
- **L532** : `.attr("x2", linksCopy.find(l => l.type === 'terroir-plant')?.target as any)`
- **L533** : `.attr("y2", linksCopy.find(l => l.type === 'terroir-plant')?.target as any);`
- **L558** : `(d3.zoom() as any).scaleBy, 1.3`
- **L567** : `(d3.zoom() as any).scaleBy, 0.7`
- *... et 10 autres occurrences*

### `client/src/components/forms/FinalRecipeForm.tsx`

- **L132** : `recipeType: recipeType as any,`
- **L134** : `climaticAxis: climaticAxis as any,`
- **L132** : `recipeType: recipeType as any,`
- **L134** : `climaticAxis: climaticAxis as any,`

### `client/src/components/forms/TerpProfileForm.tsx`

- **L139** : `climaticAxis: climaticAxis as any,`
- **L140** : `secondaryAxis: secondaryAxis as any,`
- **L142** : `usage: usage as any,`
- **L148** : `temporality: temporality as any,`
- **L152** : `intensity: intensity as any,`
- **L153** : `readability: readability as any,`
- **L139** : `climaticAxis: climaticAxis as any,`
- **L140** : `secondaryAxis: secondaryAxis as any,`
- *... et 4 autres occurrences*

### `client/src/pages/AdminContributions.tsx`

- **L257** : `onClick={() => setStatusFilter(opt.value as any)}`
- **L257** : `onClick={() => setStatusFilter(opt.value as any)}`

### `client/src/pages/AdminDuplicates.tsx`

- **L69** : `duplicateType: duplicateType as any,`
- **L69** : `duplicateType: duplicateType as any,`

### `client/src/pages/AlternativesDurables.tsx`

- **L50** : `alternativeType: typeFilter as any,`
- **L51** : `availability: availabilityFilter as any,`
- **L52** : `olfactiveSimilarity: similarityFilter as any,`
- **L50** : `alternativeType: typeFilter as any,`
- **L51** : `availability: availabilityFilter as any,`
- **L52** : `olfactiveSimilarity: similarityFilter as any,`

### `client/src/pages/AnalyticsDashboardAdvanced.tsx`

- **L405** : `{activity.metadata ? (safeJsonParse(activity.metadata, {}) as any).moleculeName || (safeJsonParse(activity.metadata, {})`
- **L405** : `{activity.metadata ? (safeJsonParse(activity.metadata, {}) as any).moleculeName || (safeJsonParse(activity.metadata, {})`

### `client/src/pages/ArchivesOlfactives.tsx`

- **L18** : `type: typeFilter as any,`
- **L18** : `type: typeFilter as any,`

### `client/src/pages/BibliographieGlobale.tsx`

- **L324** : `createMutation.mutate(data as any);`
- **L324** : `createMutation.mutate(data as any);`

### `client/src/pages/CSVValidationImport.tsx`

- **L640** : `setActiveTab(v as any);`
- **L640** : `setActiveTab(v as any);`

### `client/src/pages/CannabisLandraces.tsx`

- **L21** : `type: type === "all" ? undefined : type as any,`
- **L21** : `type: type === "all" ? undefined : type as any,`

### `client/src/pages/CigarilloRecipes.tsx`

- **L20** : `difficultyLevel: difficulty === "all" ? undefined : difficulty as any,`
- **L20** : `difficultyLevel: difficulty === "all" ? undefined : difficulty as any,`

### `client/src/pages/CompareRadar.tsx`

- **L233** : `const value = (t as any)[prop.key] || 50;`
- **L234** : `const maxValue = Math.max(...selectedTerpenes.map(st => (st as any)[prop.key] || 50));`
- **L233** : `const value = (t as any)[prop.key] || 50;`
- **L234** : `const maxValue = Math.max(...selectedTerpenes.map(st => (st as any)[prop.key] || 50));`

### `client/src/pages/ContributorInterface.tsx`

- **L254** : `category: plantForm.category as any,`
- **L254** : `category: plantForm.category as any,`

### `client/src/pages/EnhancedRadarDemo.tsx`

- **L49** : `const values = recettes.map((r) => (r as any)[key] || 0);`
- **L49** : `const values = recettes.map((r) => (r as any)[key] || 0);`

### `client/src/pages/GenealogyGraph.tsx`

- **L282** : `}) as any);`
- **L339** : `.call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity);`
- **L282** : `}) as any);`
- **L339** : `.call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity);`

### `client/src/pages/GhostVarietyForm.tsx`

- **L288** : `varietyType: varietyType as any,`
- **L289** : `conservationStatus: conservationStatus as any,`
- **L288** : `varietyType: varietyType as any,`
- **L289** : `conservationStatus: conservationStatus as any,`

### `client/src/pages/GhostVarietyImageUpload.tsx`

- **L169** : `imageType: formData.imageType as any,`
- **L169** : `imageType: formData.imageType as any,`

### `client/src/pages/GrapheMoleculesRecettes.tsx`

- **L109** : `const simulation = d3.forceSimulation(nodes as any)`
- **L134** : `.on("end", dragended) as any);`
- **L109** : `const simulation = d3.forceSimulation(nodes as any)`
- **L134** : `.on("end", dragended) as any);`

### `client/src/pages/H2LinkingInterface.tsx`

- **L516** : `linkType: config.linkType as any,`
- **L516** : `linkType: config.linkType as any,`

### `client/src/pages/H3LinkingInterface.tsx`

- **L545** : `linkType: config.linkType as any,`
- **L545** : `linkType: config.linkType as any,`

### `client/src/pages/LeafEconomyForm.tsx`

- **L240** : `createMutation.mutate(payload as any);`
- **L242** : `updateMutation.mutate({ id, data: payload as any });`
- **L240** : `createMutation.mutate(payload as any);`
- **L242** : `updateMutation.mutate({ id, data: payload as any });`

### `client/src/pages/Molecules.tsx`

- **L221** : `!selectedGamme || getGammeFromOlfactiveProfile(getOlfactiveText(molecule.olfactiveProfile as any)) === selectedGamme;`
- **L368** : ``"${(getOlfactiveText(m.olfactiveProfile as any) || '').replace(/"/g, '""')}"`,`
- **L991** : `{getGammeFromOlfactiveProfile(getOlfactiveText(molecule.olfactiveProfile as any)) && (`
- **L993** : `gamme={getGammeFromOlfactiveProfile(getOlfactiveText(molecule.olfactiveProfile as any))!}`
- **L1115** : `{getOlfactiveText(molecule.olfactiveProfile as any)}`
- **L221** : `!selectedGamme || getGammeFromOlfactiveProfile(getOlfactiveText(molecule.olfactiveProfile as any)) === selectedGamme;`
- **L368** : ``"${(getOlfactiveText(m.olfactiveProfile as any) || '').replace(/"/g, '""')}"`,`
- **L991** : `{getGammeFromOlfactiveProfile(getOlfactiveText(molecule.olfactiveProfile as any)) && (`
- *... et 2 autres occurrences*

### `client/src/pages/PatrimoineMenace.tsx`

- **L92** : `iucn: iucnFilter as any,`
- **L93** : `cites: citesFilter as any,`
- **L92** : `iucn: iucnFilter as any,`
- **L93** : `cites: citesFilter as any,`

### `client/src/pages/PlantForm.tsx`

- **L189** : `data: formData as any,`
- **L192** : `await createMutation.mutateAsync(formData as any);`
- **L189** : `data: formData as any,`
- **L192** : `await createMutation.mutateAsync(formData as any);`

### `client/src/pages/PlantMoleculeLinking.tsx`

- **L140** : `role: linkRole as any || undefined,`
- **L140** : `role: linkRole as any || undefined,`

### `client/src/pages/PublicationMoleculeGraph.tsx`

- **L130** : `const simulation = d3.forceSimulation(filteredData.nodes as any)`
- **L131** : `.force("link", d3.forceLink(filteredData.links as any)`
- **L179** : `}) as any)`
- **L130** : `const simulation = d3.forceSimulation(filteredData.nodes as any)`
- **L131** : `.force("link", d3.forceLink(filteredData.links as any)`
- **L179** : `}) as any)`

### `client/src/pages/RadarCorrelationHeatmap.tsx`

- **L28** : `const matrix: Record<RadarKey, Record<RadarKey, number>> = {} as any;`
- **L32** : `matrix[axis1] = {} as any;`
- **L49** : `const means: Record<RadarKey, number> = {} as any;`
- **L28** : `const matrix: Record<RadarKey, Record<RadarKey, number>> = {} as any;`
- **L32** : `matrix[axis1] = {} as any;`
- **L49** : `const means: Record<RadarKey, number> = {} as any;`

### `client/src/pages/RawMaterialForm.tsx`

- **L194** : `category: formData.category as any,`
- **L195** : `plantPart: formData.plantPart as any || undefined,`
- **L198** : `olfactiveFamily: formData.olfactiveFamily as any || undefined,`
- **L205** : `quality: formData.quality as any || undefined,`
- **L206** : `priceRange: formData.priceRange as any || undefined,`
- **L207** : `availability: formData.availability as any || undefined,`
- **L194** : `category: formData.category as any,`
- **L195** : `plantPart: formData.plantPart as any || undefined,`
- *... et 4 autres occurrences*

### `client/src/pages/RecetteDetail.tsx`

- **L1106** : `role: rmRole as any,`
- **L1200** : `role: editRmRole as any,`
- **L1106** : `role: rmRole as any,`
- **L1200** : `role: editRmRole as any,`

### `client/src/pages/ReferencesGraph.tsx`

- **L297** : `}) as any);`
- **L361** : `d3.zoom<SVGSVGElement, unknown>().scaleBy as any,`
- **L370** : `d3.zoom<SVGSVGElement, unknown>().scaleBy as any,`
- **L379** : `d3.zoom<SVGSVGElement, unknown>().transform as any,`
- **L297** : `}) as any);`
- **L361** : `d3.zoom<SVGSVGElement, unknown>().scaleBy as any,`
- **L370** : `d3.zoom<SVGSVGElement, unknown>().scaleBy as any,`
- **L379** : `d3.zoom<SVGSVGElement, unknown>().transform as any,`

### `client/src/pages/ReferencesV3.tsx`

- **L346** : `links={graphData.links as any}`
- **L754** : `linkType: selectedLinkType as any,`
- **L346** : `links={graphData.links as any}`
- **L754** : `linkType: selectedLinkType as any,`

### `client/src/pages/RelationsGraph.tsx`

- **L48** : `((axes as any)?.items || axes || []).forEach((axis: any) => {`
- **L68** : `((references as any)?.items || references || []).slice(0, 50).forEach((ref: any) => {`
- **L126** : `const botanicalAxes = ((axes as any)?.items || axes || []).filter((a: any) =>`
- **L160** : `const chemicalAxes = ((axes as any)?.items || axes || []).filter((a: any) =>`
- **L194** : `const terroirAxes = ((axes as any)?.items || axes || []).filter((a: any) =>`
- **L212** : `((recettes as any)?.items || recettes || []).slice(0, 20).forEach((recette: any) => {`
- **L228** : `const formulationAxes = ((axes as any)?.items || axes || []).filter((a: any) =>`
- **L366** : `{((axes as any)?.items || axes || []).map((axis: any) => (`
- *... et 8 autres occurrences*

### `client/src/pages/ResinesCBD.tsx`

- **L14** : `category: 'resine_cbd' as any`
- **L14** : `category: 'resine_cbd' as any`

### `client/src/pages/SimplifiedContributorForm.tsx`

- **L244** : `category: plantForm.category as any,`
- **L244** : `category: plantForm.category as any,`

### `client/src/pages/SynergiesGraphVisualization.tsx`

- **L312** : `}) as any)`
- **L312** : `}) as any)`

### `client/src/pages/SynergiesMoleculaires.tsx`

- **L96** : `.forceSimulation(graphData.nodes as any)`
- **L96** : `.forceSimulation(graphData.nodes as any)`

### `client/src/pages/SynergiesPage.tsx`

- **L271** : `}) as any);`
- **L271** : `}) as any);`

### `client/src/pages/TechnicalProtocols.tsx`

- **L20** : `difficultyLevel: difficulty === "all" ? undefined : difficulty as any,`
- **L20** : `difficultyLevel: difficulty === "all" ? undefined : difficulty as any,`

### `client/src/pages/TerpeneDetail.tsx`

- **L54** : `const { data: recettesData } = trpc.recettes.list.useQuery({ category: "resine_cbd" as any });`
- **L54** : `const { data: recettesData } = trpc.recettes.list.useQuery({ category: "resine_cbd" as any });`

### `client/src/pages/TimelinePerfumum.tsx`

- **L283** : `gamme={gamme as any}`
- **L283** : `gamme={gamme as any}`

### `client/src/pages/VarietyForm.tsx`

- **L210** : `varietyType: varietyType as any,`
- **L221** : `conservationStatus: conservationStatus as any,`
- **L224** : `commercialAvailability: commercialAvailability as any,`
- **L210** : `varietyType: varietyType as any,`
- **L221** : `conservationStatus: conservationStatus as any,`
- **L224** : `commercialAvailability: commercialAvailability as any,`

### `client/src/pages/VisualisationsCorrelation.tsx`

- **L72** : `propertyX: propertyX as any,`
- **L73** : `propertyY: propertyY as any,`
- **L72** : `propertyX: propertyX as any,`
- **L73** : `propertyY: propertyY as any,`

### `client/src/pages/admin/AdminMatieres.tsx`

- **L257** : `type: formData.type as any,`
- **L259** : `note: formData.note ? formData.note as any : undefined,`
- **L261** : `extractionMethod: formData.extractionMethod ? formData.extractionMethod as any : undefined,`
- **L267** : `status: formData.status as any,`
- **L282** : `type: formData.type ? formData.type as any : undefined,`
- **L284** : `note: formData.note ? formData.note as any : undefined,`
- **L286** : `extractionMethod: formData.extractionMethod ? formData.extractionMethod as any : undefined,`
- **L292** : `status: formData.status ? formData.status as any : undefined,`
- *... et 8 autres occurrences*

## Propriétés d'interface `: any`

**Correction suggérée :** Définir le type réel

### `client/src/components/BiosyntheticPathwayFlow.tsx`

- **L54** : `data: any;`
- **L54** : `data: any;`

### `client/src/components/CitationNetworkView.tsx`

- **L379** : `{filteredData.links.slice(0, 50).map((link: any, index: number) => {`
- **L500** : `{citationStats.mostCited.slice(0, 10).map((item: any, index: number) => (`
- **L537** : `{citationStats.mostCiting.slice(0, 10).map((item: any, index: number) => (`
- **L379** : `{filteredData.links.slice(0, 50).map((link: any, index: number) => {`
- **L500** : `{citationStats.mostCited.slice(0, 10).map((item: any, index: number) => (`
- **L537** : `{citationStats.mostCiting.slice(0, 10).map((item: any, index: number) => (`

### `client/src/components/EntityConnectionBar.tsx`

- **L49** : `icon: any;`
- **L49** : `icon: any;`

### `client/src/components/ForceGraphAxes.tsx`

- **L176** : `.on("start", (event: any, d: any) => {`
- **L181** : `.on("drag", (event: any, d: any) => {`
- **L185** : `.on("end", (event: any, d: any) => {`
- **L176** : `.on("start", (event: any, d: any) => {`
- **L181** : `.on("drag", (event: any, d: any) => {`
- **L185** : `.on("end", (event: any, d: any) => {`

### `client/src/components/GenealogyTree.tsx`

- **L91** : `const flowNodes: Node[] = genealogyData.nodes.map((node: any, idx: number) => {`
- **L137** : `const flowEdges: Edge[] = genealogyData.links.map((link: any, idx: number) => ({`
- **L91** : `const flowNodes: Node[] = genealogyData.nodes.map((node: any, idx: number) => {`
- **L137** : `const flowEdges: Edge[] = genealogyData.links.map((link: any, idx: number) => ({`

### `client/src/components/SeasonalVariations.tsx`

- **L252** : `{keyMolecules.map((mol: any, idx: number) => (`
- **L252** : `{keyMolecules.map((mol: any, idx: number) => (`

### `client/src/components/charts/EnhancedSankeyDiagram.tsx`

- **L195** : `graph.links.forEach((link: any, i: number) => {`
- **L218** : `.attr("stroke", (d: any, i: number) => `url(#link-gradient-${i})`)`
- **L262** : `.delay((d: any, i: number) => i * 20)`
- **L340** : `.delay((d: any, i: number) => i * 30)`
- **L370** : `.delay((d: any, i: number) => 600 + i * 20)`
- **L195** : `graph.links.forEach((link: any, i: number) => {`
- **L218** : `.attr("stroke", (d: any, i: number) => `url(#link-gradient-${i})`)`
- **L262** : `.delay((d: any, i: number) => i * 20)`
- *... et 2 autres occurrences*

### `client/src/components/charts/PlantTerroirNetworkGraph.tsx`

- **L225** : `.on("mouseover", function (this: SVGGElement, event: any, d: NetworkNode) {`
- **L282** : `.on("mouseout", function (this: SVGGElement, event: any, d: NetworkNode) {`
- **L303** : `.on("click", function (this: SVGGElement, event: any, d: NetworkNode) {`
- **L225** : `.on("mouseover", function (this: SVGGElement, event: any, d: NetworkNode) {`
- **L282** : `.on("mouseout", function (this: SVGGElement, event: any, d: NetworkNode) {`
- **L303** : `.on("click", function (this: SVGGElement, event: any, d: NetworkNode) {`

### `client/src/components/charts/RecipeNetworkGraph.tsx`

- **L146** : `.on("mouseover", function (this: SVGGElement, event: any, d: RecipeNode) {`
- **L160** : `.on("mouseout", function (this: SVGGElement, event: any, d: RecipeNode) {`
- **L146** : `.on("mouseover", function (this: SVGGElement, event: any, d: RecipeNode) {`
- **L160** : `.on("mouseout", function (this: SVGGElement, event: any, d: RecipeNode) {`

### `client/src/components/charts/TerrainPlantMoleculeGraph.tsx`

- **L395** : `.on("mouseover", function (this: SVGGElement, event: any, d: TerrainNode) {`
- **L469** : `.on("mouseout", function (this: SVGGElement, event: any, d: TerrainNode) {`
- **L496** : `.on("click", function (this: SVGGElement, event: any, d: TerrainNode) {`
- **L395** : `.on("mouseover", function (this: SVGGElement, event: any, d: TerrainNode) {`
- **L469** : `.on("mouseout", function (this: SVGGElement, event: any, d: TerrainNode) {`
- **L496** : `.on("click", function (this: SVGGElement, event: any, d: TerrainNode) {`

### `client/src/components/content/PlantsContent.tsx`

- **L150** : `{botanicalStates.slice(0, 4).map((state: any, index: number) => (`
- **L239** : `return plants.reduce((acc: any, plant: any) => {`
- **L150** : `{botanicalStates.slice(0, 4).map((state: any, index: number) => (`
- **L239** : `return plants.reduce((acc: any, plant: any) => {`

### `client/src/components/content/TerroirsContent.tsx`

- **L194** : `return terroirs.reduce((acc: any, terroir: any) => {`
- **L194** : `return terroirs.reduce((acc: any, terroir: any) => {`

### `client/src/components/content/VarietiesContent.tsx`

- **L230** : `return varieties.reduce((acc: any, variety: any) => {`
- **L230** : `return varieties.reduce((acc: any, variety: any) => {`

### `client/src/pages/AccordsDedies.tsx`

- **L129** : `icon: any;`
- **L184** : `accord: any;`
- **L316** : `{accord.formulaJson.map((item: any, idx: number) => (`
- **L340** : `{accord.terpeneProfile?.map((t: any, idx: number) => (`
- **L372** : `{accord.keyInteractions.map((interaction: any, idx: number) => (`
- **L129** : `icon: any;`
- **L184** : `accord: any;`
- **L316** : `{accord.formulaJson.map((item: any, idx: number) => (`
- *... et 2 autres occurrences*

### `client/src/pages/AlternativesDurables.tsx`

- **L402** : `{alt.keyMolecules.map((mol: any, idx: number) => (`
- **L402** : `{alt.keyMolecules.map((mol: any, idx: number) => (`

### `client/src/pages/AnalyticsDashboardAdvanced.tsx`

- **L685** : `{mostViewedMolecules.map((item: any, index: number) => (`
- **L743** : `{mostViewedRecipes.map((item: any, index: number) => (`
- **L801** : `{popularSearches.map((search: any, index: number) => (`
- **L685** : `{mostViewedMolecules.map((item: any, index: number) => (`
- **L743** : `{mostViewedRecipes.map((item: any, index: number) => (`
- **L801** : `{popularSearches.map((search: any, index: number) => (`

### `client/src/pages/Archives.tsx`

- **L191** : `{category.items.map((item: any, idx: number) => (`
- **L191** : `{category.items.map((item: any, idx: number) => (`

### `client/src/pages/ArchivesOlfactives.tsx`

- **L30** : `const authenticityLabels: Record<string, { label: string; icon: any; color: string }> = {`
- **L182** : `{archive.references.map((ref: any, idx: number) => (`
- **L30** : `const authenticityLabels: Record<string, { label: string; icon: any; color: string }> = {`
- **L182** : `{archive.references.map((ref: any, idx: number) => (`

### `client/src/pages/BatchImport.tsx`

- **L476** : `{validationResult.rows.map((row: any, index: number) => (`
- **L602** : `{importResult.results.map((result: any, index: number) => (`
- **L476** : `{validationResult.rows.map((row: any, index: number) => (`
- **L602** : `{importResult.results.map((result: any, index: number) => (`

### `client/src/pages/BibliographieGlobale.tsx`

- **L1108** : `{citationStats.mostCited.slice(0, 5).map((item: any, index: number) => (`
- **L1108** : `{citationStats.mostCited.slice(0, 5).map((item: any, index: number) => (`

### `client/src/pages/BibliographiePage.tsx`

- **L996** : `.sort((a: any, b: any) => (b.year || 0) - (a.year || 0))`
- **L996** : `.sort((a: any, b: any) => (b.year || 0) - (a.year || 0))`

### `client/src/pages/CompareMoleculesAdvanced.tsx`

- **L181** : `const calculateSimilarity = (mol1: any, mol2: any) => {`
- **L181** : `const calculateSimilarity = (mol1: any, mol2: any) => {`

### `client/src/pages/CompoundSearch.tsx`

- **L68** : `return filtered.sort((a: any, b: any) => {`
- **L79** : `const grouped = allPeaks.reduce((acc: any, peak: any) => {`
- **L105** : `.sort((a: any, b: any) => b.landraceCount - a.landraceCount);`
- **L110** : `const grouped = searchResults.reduce((acc: any, peak: any) => {`
- **L399** : `{searchResults.slice(0, 50).map((peak: any, idx: number) => (`
- **L68** : `return filtered.sort((a: any, b: any) => {`
- **L79** : `const grouped = allPeaks.reduce((acc: any, peak: any) => {`
- **L105** : `.sort((a: any, b: any) => b.landraceCount - a.landraceCount);`
- *... et 2 autres occurrences*

### `client/src/pages/CoverageGoalDashboard.tsx`

- **L337** : `{auditStats?.topPlantsByMolecules?.map((plant: any, index: number) => (`
- **L337** : `{auditStats?.topPlantsByMolecules?.map((plant: any, index: number) => (`

### `client/src/pages/CrossSearch.tsx`

- **L178** : `item: any;`
- **L178** : `item: any;`

### `client/src/pages/FinalRecipes.tsx`

- **L105** : `{items.slice(0, 3).map((item: any, index: number) => (`
- **L237** : `const groupedByType = filteredRecipes.reduce((acc: any, recipe: any) => {`
- **L245** : `const typeCounts = recipes?.reduce((acc: any, recipe: any) => {`
- **L105** : `{items.slice(0, 3).map((item: any, index: number) => (`
- **L237** : `const groupedByType = filteredRecipes.reduce((acc: any, recipe: any) => {`
- **L245** : `const typeCounts = recipes?.reduce((acc: any, recipe: any) => {`

### `client/src/pages/GCMSChromatograms.tsx`

- **L80** : `peaks.forEach((peak: any, idx: number) => {`
- **L380** : `{peaks.sort((a: any, b: any) => b.concentration_ppm - a.concentration_ppm).map((peak: any, idx: number) => (`
- **L80** : `peaks.forEach((peak: any, idx: number) => {`
- **L380** : `{peaks.sort((a: any, b: any) => b.concentration_ppm - a.concentration_ppm).map((peak: any, idx: number) => (`

### `client/src/pages/GenerateurFormules.tsx`

- **L139** : `${suggestions.map((s: any, idx: number) => ``
- **L344** : `{suggestions.map((molecule: any, index: number) => (`
- **L139** : `${suggestions.map((s: any, idx: number) => ``
- **L344** : `{suggestions.map((molecule: any, index: number) => (`

### `client/src/pages/GrapheMoleculesRecettes.tsx`

- **L146** : `.on("mouseover", function(event: any, d: any) {`
- **L201** : `.on("click", function(event: any, d: any) {`
- **L277** : `svg.selectAll(".link").each(function(this: any, d: any) {`
- **L286** : `.style("opacity", function(this: any, d: any) {`
- **L294** : `.style("opacity", function(this: any, d: any) {`
- **L146** : `.on("mouseover", function(event: any, d: any) {`
- **L201** : `.on("click", function(event: any, d: any) {`
- **L277** : `svg.selectAll(".link").each(function(this: any, d: any) {`
- *... et 2 autres occurrences*

### `client/src/pages/Ifra.tsx`

- **L98** : `const getCategoryLimit = (restriction: any, categoryCode: string) => {`
- **L98** : `const getCategoryLimit = (restriction: any, categoryCode: string) => {`

### `client/src/pages/LandraceComparator.tsx`

- **L410** : `.sort((a: any, b: any) => (b.relative_abundance || 0) - (a.relative_abundance || 0))`
- **L410** : `.sort((a: any, b: any) => (b.relative_abundance || 0) - (a.relative_abundance || 0))`

### `client/src/pages/LinkingDashboard.tsx`

- **L390** : `{previewData.suggestions?.slice(0, 50).map((s: any, i: number) => (`
- **L469** : `{plantMoleculePreview.suggestions?.slice(0, 50).map((s: any, i: number) => (`
- **L390** : `{previewData.suggestions?.slice(0, 50).map((s: any, i: number) => (`
- **L469** : `{plantMoleculePreview.suggestions?.slice(0, 50).map((s: any, i: number) => (`

### `client/src/pages/MSSpectraViewer.tsx`

- **L210** : `{spectra?.map((spectrum: any, idx: number) => (`
- **L210** : `{spectra?.map((spectrum: any, idx: number) => (`

### `client/src/pages/MolecularTransformations.tsx`

- **L609** : `{stats.topTransformations.slice(0, 5).map((t: any, i: number) => (`
- **L636** : `{stats.topRecipes.slice(0, 5).map((r: any, i: number) => (`
- **L609** : `{stats.topTransformations.slice(0, 5).map((t: any, i: number) => (`
- **L636** : `{stats.topRecipes.slice(0, 5).map((r: any, i: number) => (`

### `client/src/pages/MoleculeDetail.tsx`

- **L246** : `{transformations.map((t: any, idx: number) => (`
- **L246** : `{transformations.map((t: any, idx: number) => (`

### `client/src/pages/MoleculePlantRelations.tsx`

- **L176** : `{moleculeResults.map((result: any, index: number) => (`
- **L212** : `{rawMaterialResults.map((result: any, index: number) => (`
- **L176** : `{moleculeResults.map((result: any, index: number) => (`
- **L212** : `{rawMaterialResults.map((result: any, index: number) => (`

### `client/src/pages/MoleculeRecetteAudit.tsx`

- **L510** : `{suggestions.slice(0, 30).map((s: any, i: number) => (`
- **L510** : `{suggestions.slice(0, 30).map((s: any, i: number) => (`

### `client/src/pages/OdeurSitueeDetail.tsx`

- **L23** : `const config: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "outline" | "destructive" }>`
- **L23** : `const config: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "outline" | "destructive" }>`

### `client/src/pages/OdeursSituees.tsx`

- **L18** : `const config: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "outline" | "destructive" }>`
- **L18** : `const config: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "outline" | "destructive" }>`

### `client/src/pages/ParcoursDetail.tsx`

- **L234** : `{journeyItems.map((item: any, index: number) => {`
- **L234** : `{journeyItems.map((item: any, index: number) => {`

### `client/src/pages/PlantMoleculeLinking.tsx`

- **L611** : `{allLinks.data?.map((link: any, index: number) => (`
- **L611** : `{allLinks.data?.map((link: any, index: number) => (`

### `client/src/pages/PlantTerroirAudit.tsx`

- **L311** : `{auditStats?.topPlantsByTerroirs?.map((plant: any, index: number) => (`
- **L345** : `{auditStats?.topTerroirsByPlants?.map((terroir: any, index: number) => (`
- **L311** : `{auditStats?.topPlantsByTerroirs?.map((plant: any, index: number) => (`
- **L345** : `{auditStats?.topTerroirsByPlants?.map((terroir: any, index: number) => (`

### `client/src/pages/PlantTerroirLinking.tsx`

- **L802** : `{allRelations.slice(0, 20).map((rel: any, index: number) => (`
- **L802** : `{allRelations.slice(0, 20).map((rel: any, index: number) => (`

### `client/src/pages/PlantVarieties.tsx`

- **L208** : `{dominantMolecules.slice(0, 4).map((mol: any, index: number) => (`
- **L208** : `{dominantMolecules.slice(0, 4).map((mol: any, index: number) => (`

### `client/src/pages/ProtocolDetail.tsx`

- **L144** : `{steps.map((step: any, index: number) => (`
- **L144** : `{steps.map((step: any, index: number) => (`

### `client/src/pages/PrototypeDetail.tsx`

- **L147** : `{composition.ingredients?.map((ingredient: any, idx: number) => (`
- **L147** : `{composition.ingredients?.map((ingredient: any, idx: number) => (`

### `client/src/pages/RawMaterialDetail.tsx`

- **L425** : `{molecules.map((item: any, index: number) => (`
- **L425** : `{molecules.map((item: any, index: number) => (`

### `client/src/pages/RecettesTL.tsx`

- **L370** : `).sort((a: any, b: any) => a.id - b.id);`
- **L370** : `).sort((a: any, b: any) => a.id - b.id);`

### `client/src/pages/RechercheRadicale.tsx`

- **L115** : `{architecture.map((ingredient: any, idx: number) => (`
- **L115** : `{architecture.map((ingredient: any, idx: number) => (`

### `client/src/pages/ResearchData.tsx`

- **L215** : `{topCited.map((pub: any, index: number) => (`
- **L450** : `{safeJsonParse(researcher.awards, []).map((award: any, i: number) => (`
- **L215** : `{topCited.map((pub: any, index: number) => (`
- **L450** : `{safeJsonParse(researcher.awards, []).map((award: any, i: number) => (`

### `client/src/pages/ReseauAxes.tsx`

- **L342** : `axis: any;`
- **L420** : `axes.forEach((axis: any, idx: number) => {`
- **L342** : `axis: any;`
- **L420** : `axes.forEach((axis: any, idx: number) => {`

### `client/src/pages/ReseauLiaisons.tsx`

- **L129** : `networkData.edges.recetteRawMaterials?.forEach((link: any, i: number) => {`
- **L141** : `networkData.edges.recetteMolecules?.forEach((link: any, i: number) => {`
- **L129** : `networkData.edges.recetteRawMaterials?.forEach((link: any, i: number) => {`
- **L141** : `networkData.edges.recetteMolecules?.forEach((link: any, i: number) => {`

### `client/src/pages/SoilAnalysis.tsx`

- **L501** : `{soilData.data.map((soil: any, index: number) => (`
- **L501** : `{soilData.data.map((soil: any, index: number) => (`

### `client/src/pages/SourcingHub.tsx`

- **L364** : `result.sort((a: any, b: any) => {`
- **L364** : `result.sort((a: any, b: any) => {`

### `client/src/pages/SynergiesPage.tsx`

- **L96** : `synergies?.forEach((synergy: any, index: number) => {`
- **L687** : `filteredSynergies.map((synergy: any, index: number) => (`
- **L96** : `synergies?.forEach((synergy: any, index: number) => {`
- **L687** : `filteredSynergies.map((synergy: any, index: number) => (`

### `client/src/pages/TerpProfiles.tsx`

- **L243** : `const groupedByAxis = filteredProfiles.reduce((acc: any, profile: any) => {`
- **L243** : `const groupedByAxis = filteredProfiles.reduce((acc: any, profile: any) => {`

### `client/src/pages/TerpProfilesCompare.tsx`

- **L179** : `const getPercentage = (profile: any, molecule: string) => {`
- **L179** : `const getPercentage = (profile: any, molecule: string) => {`

### `client/src/pages/Terroirs.tsx`

- **L151** : `const plantCounts: Record<number, { terroir: any; count: number }> = {};`
- **L394** : `terroir: any;`
- **L721** : `{filteredTerroirs.map((terroir: any, idx: number) => (`
- **L151** : `const plantCounts: Record<number, { terroir: any; count: number }> = {};`
- **L394** : `terroir: any;`
- **L721** : `{filteredTerroirs.map((terroir: any, idx: number) => (`

### `client/src/pages/TestExtractionDetail.tsx`

- **L23** : `const config: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "outline" | "destructive" }>`
- **L23** : `const config: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "outline" | "destructive" }>`

### `client/src/pages/TestsExtraction.tsx`

- **L18** : `const config: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "outline" | "destructive" }>`
- **L18** : `const config: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "outline" | "destructive" }>`

### `client/src/pages/TobaccoLandraceDetail.tsx`

- **L69** : `peaks.forEach((peak: any, idx: number) => {`
- **L247** : `{matchedSpectra.sort((a: any, b: any) => b.concentration_ppm - a.concentration_ppm).map((compound: any, idx: number) => `
- **L557** : `{terpeneProfiles.map((profile: any, idx: number) => (`
- **L660** : `{peaks.sort((a: any, b: any) => b.concentration_ppm - a.concentration_ppm).map((peak: any, idx: number) => (`
- **L69** : `peaks.forEach((peak: any, idx: number) => {`
- **L247** : `{matchedSpectra.sort((a: any, b: any) => b.concentration_ppm - a.concentration_ppm).map((compound: any, idx: number) => `
- **L557** : `{terpeneProfiles.map((profile: any, idx: number) => (`
- **L660** : `{peaks.sort((a: any, b: any) => b.concentration_ppm - a.concentration_ppm).map((peak: any, idx: number) => (`

### `client/src/pages/VarietyDetail.tsx`

- **L510** : `{molecules.map((mol: any, idx: number) => (`
- **L510** : `{molecules.map((mol: any, idx: number) => (`

### `client/src/pages/admin/AdminPlantMolecules.tsx`

- **L375** : `{filteredMolecules.map((item: any, idx: number) => {`
- **L375** : `{filteredMolecules.map((item: any, idx: number) => {`

### `client/src/pages/admin/DataQuality.tsx`

- **L409** : `{duplicates.duplicates.slice(0, 20).map((dup: any, i: number) => (`
- **L409** : `{duplicates.duplicates.slice(0, 20).map((dup: any, i: number) => (`

### `client/src/pages/admin/MoleculeManager.tsx`

- **L203** : `{mergeResult.results.slice(0, 5).map((r: any, i: number) => (`
- **L248** : `{group.molecules.map((mol: any, idx: number) => (`
- **L203** : `{mergeResult.results.slice(0, 5).map((r: any, i: number) => (`
- **L248** : `{group.molecules.map((mol: any, idx: number) => (`

### `client/src/pages/admin/MoleculeOriginsAdmin.tsx`

- **L209** : `{origins?.sort((a: any, b: any) => a.country.localeCompare(b.country)).map((origin: any) => (`
- **L494** : `{origins?.sort((a: any, b: any) => (b.moleculeCount || 0) - (a.moleculeCount || 0)).map((origin: any) => (`
- **L209** : `{origins?.sort((a: any, b: any) => a.country.localeCompare(b.country)).map((origin: any) => (`
- **L494** : `{origins?.sort((a: any, b: any) => (b.moleculeCount || 0) - (a.moleculeCount || 0)).map((origin: any) => (`

### `server/routers/lotus.ts`

- **L74** : `db: any,`
- **L74** : `db: any,`

## Autres cas

**Correction suggérée :** Analyse manuelle requise

### `client/src/components/BiosyntheticPathwayFlow.tsx`

- **L223** : `.on("start", (event, d: any) => {`
- **L228** : `.on("drag", (event, d: any) => {`
- **L232** : `.on("end", (event, d: any) => {`
- **L223** : `.on("start", (event, d: any) => {`
- **L228** : `.on("drag", (event, d: any) => {`
- **L232** : `.on("end", (event, d: any) => {`

### `client/src/components/ChemicalFamilyHierarchyGraph.tsx`

- **L50** : `data?: any;`
- **L340** : `.on("start", (event, d: any) => {`
- **L345** : `.on("drag", (event, d: any) => {`
- **L349** : `.on("end", (event, d: any) => {`
- **L388** : `node.on("mouseenter", (event, d: any) => {`
- **L407** : `.on("click", (event, d: any) => {`
- **L530** : `node.on("mouseenter", (event, d: any) => {`
- **L536** : `.on("click", (event, d: any) => {`
- *... et 8 autres occurrences*

### `client/src/components/ForceGraph.tsx`

- **L249** : `.on("mouseover", function(event, d: any) {`
- **L255** : `.on("mouseout", function(event, d: any) {`
- **L261** : `.on("click", (event, d: any) => {`
- **L249** : `.on("mouseover", function(event, d: any) {`
- **L255** : `.on("mouseout", function(event, d: any) {`
- **L261** : `.on("click", (event, d: any) => {`

### `client/src/components/GenealogyTree.tsx`

- **L29** : `const VarietyNode = ({ data }: any) => {`
- **L49** : `const GenealogyEdge = ({ data }: any) => {`
- **L29** : `const VarietyNode = ({ data }: any) => {`
- **L49** : `const GenealogyEdge = ({ data }: any) => {`

### `client/src/components/PlantMoleculeGraph.tsx`

- **L264** : `.on("start", (event, d: any) => {`
- **L269** : `.on("drag", (event, d: any) => {`
- **L273** : `.on("end", (event, d: any) => {`
- **L312** : `node.on("mouseenter", (event, d: any) => {`
- **L335** : `.on("click", (event, d: any) => {`
- **L264** : `.on("start", (event, d: any) => {`
- **L269** : `.on("drag", (event, d: any) => {`
- **L273** : `.on("end", (event, d: any) => {`
- *... et 2 autres occurrences*

### `client/src/components/SeeAlso.tsx`

- **L147** : `[key: string]: any;`
- **L187** : `[key: string]: any;`
- **L296** : `export function SimilarContent<T extends { id: number; name: string; [key: string]: any }>({`
- **L147** : `[key: string]: any;`
- **L187** : `[key: string]: any;`
- **L296** : `export function SimilarContent<T extends { id: number; name: string; [key: string]: any }>({`

### `client/src/components/TimelineAromatic.tsx`

- **L139** : `label: function(context: any) {`
- **L139** : `label: function(context: any) {`

### `client/src/components/charts/EnhancedSankeyDiagram.tsx`

- **L223** : `.on("mouseover", function (event: MouseEvent, d: any) {`
- **L248** : `.on("click", function (event: MouseEvent, d: any) {`
- **L285** : `.on("mouseover", function (event: MouseEvent, d: any) {`
- **L326** : `.on("click", function (event: MouseEvent, d: any) {`
- **L223** : `.on("mouseover", function (event: MouseEvent, d: any) {`
- **L248** : `.on("click", function (event: MouseEvent, d: any) {`
- **L285** : `.on("mouseover", function (event: MouseEvent, d: any) {`
- **L326** : `.on("click", function (event: MouseEvent, d: any) {`

### `client/src/components/charts/PlantTerroirNetworkGraph.tsx`

- **L277** : `.on("mousemove", function (this: SVGGElement, event: any) {`
- **L277** : `.on("mousemove", function (this: SVGGElement, event: any) {`

### `client/src/components/charts/RecipeNetworkGraph.tsx`

- **L155** : `.on("mousemove", function (this: SVGGElement, event: any) {`
- **L155** : `.on("mousemove", function (this: SVGGElement, event: any) {`

### `client/src/components/charts/TerrainPlantMoleculeGraph.tsx`

- **L464** : `.on("mousemove", function (this: SVGGElement, event: any) {`
- **L464** : `.on("mousemove", function (this: SVGGElement, event: any) {`

### `client/src/components/content/TerroirsContent.tsx`

- **L171** : `return plantTerroirs.reduce((acc: Record<number, number>, pt: any) => {`
- **L171** : `return plantTerroirs.reduce((acc: Record<number, number>, pt: any) => {`

### `client/src/pages/AdminImportExport.tsx`

- **L175** : `const escapeField = (value: any): string => {`
- **L175** : `const escapeField = (value: any): string => {`

### `client/src/pages/AdminRecettes.tsx`

- **L119** : `const handleOpenDialog = (recette?: any) => {`
- **L119** : `const handleOpenDialog = (recette?: any) => {`

### `client/src/pages/FamilyDetail.tsx`

- **L108** : `const uniqueMolecules = plants?.reduce((acc: Set<string>, plant: any) => {`
- **L119** : `const uniqueOrigins = plants?.reduce((acc: Set<string>, plant: any) => {`
- **L125** : `const categoryCount = plants?.reduce((acc: Record<string, number>, plant: any) => {`
- **L108** : `const uniqueMolecules = plants?.reduce((acc: Set<string>, plant: any) => {`
- **L119** : `const uniqueOrigins = plants?.reduce((acc: Set<string>, plant: any) => {`
- **L125** : `const categoryCount = plants?.reduce((acc: Record<string, number>, plant: any) => {`

### `client/src/pages/GenomicsExplorer.tsx`

- **L56** : `[key: string]: any;`
- **L56** : `[key: string]: any;`

### `client/src/pages/GrapheMoleculesRecettes.tsx`

- **L219** : `.on("dblclick", function(event: any) {`
- **L219** : `.on("dblclick", function(event: any) {`

### `client/src/pages/H2LinkingInterface.tsx`

- **L53** : `[key: string]: any;`
- **L66** : `[key: string]: any;`
- **L53** : `[key: string]: any;`
- **L66** : `[key: string]: any;`

### `client/src/pages/H3LinkingInterface.tsx`

- **L55** : `[key: string]: any;`
- **L66** : `[key: string]: any;`
- **L55** : `[key: string]: any;`
- **L66** : `[key: string]: any;`

### `client/src/pages/HeritageConservation.tsx`

- **L59** : `[key: string]: any;`
- **L59** : `[key: string]: any;`

### `client/src/pages/InventoryDashboard.tsx`

- **L121** : `const stockByMaterial: Record<number, { total: number; material: any }> = {};`
- **L121** : `const stockByMaterial: Record<number, { total: number; material: any }> = {};`

### `client/src/pages/MoleculeRecetteLinking.tsx`

- **L126** : `(sum: number, r: any) => sum + (r.molecules?.length || 0),`
- **L126** : `(sum: number, r: any) => sum + (r.molecules?.length || 0),`

### `client/src/pages/Molecules.tsx`

- **L463** : `{chemicalFamiliesData.reduce((acc: number, f: any) => acc + (f.count || 0), 0)} molécules classées dans {chemicalFamilie`
- **L463** : `{chemicalFamiliesData.reduce((acc: number, f: any) => acc + (f.count || 0), 0)} molécules classées dans {chemicalFamilie`

### `client/src/pages/MonDashboard.tsx`

- **L68** : `intensity: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarIntensity || 50), 0) / moleculesDet`
- **L69** : `freshness: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarFreshness || 50), 0) / moleculesDet`
- **L70** : `warmth: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarWarmth || 50), 0) / moleculesDetails.l`
- **L71** : `sweetness: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarSweetness || 50), 0) / moleculesDet`
- **L72** : `spiciness: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarSpiciness || 50), 0) / moleculesDet`
- **L73** : `earthiness: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarEarthiness || 50), 0) / moleculesD`
- **L68** : `intensity: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarIntensity || 50), 0) / moleculesDet`
- **L69** : `freshness: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarFreshness || 50), 0) / moleculesDet`
- *... et 4 autres occurrences*

### `client/src/pages/OriginesGeographiques.tsx`

- **L37** : `const originsByCountry = filteredOrigins?.reduce((acc: Record<string, any[]>, origin: any) => {`
- **L37** : `const originsByCountry = filteredOrigins?.reduce((acc: Record<string, any[]>, origin: any) => {`

### `client/src/pages/PlantTerroirDragDrop.tsx`

- **L179** : `const handleDragStart = (e: React.DragEvent, plant: any) => {`
- **L194** : `const handleDrop = (e: React.DragEvent, terroir: any) => {`
- **L179** : `const handleDragStart = (e: React.DragEvent, plant: any) => {`
- **L194** : `const handleDrop = (e: React.DragEvent, terroir: any) => {`

### `client/src/pages/PlantTerroirLinking.tsx`

- **L201** : `const openLinkDialog = (plant?: any, terroir?: any) => {`
- **L201** : `const openLinkDialog = (plant?: any, terroir?: any) => {`

### `client/src/pages/PublicationMoleculeGraph.tsx`

- **L166** : `.on("start", (event, d: any) => {`
- **L171** : `.on("drag", (event, d: any) => {`
- **L175** : `.on("end", (event, d: any) => {`
- **L166** : `.on("start", (event, d: any) => {`
- **L171** : `.on("drag", (event, d: any) => {`
- **L175** : `.on("end", (event, d: any) => {`

### `client/src/pages/RawMaterialForm.tsx`

- **L216** : `const updateField = (field: string, value: any) => {`
- **L216** : `const updateField = (field: string, value: any) => {`

### `client/src/pages/RawMaterials.tsx`

- **L266** : `const materialsByCategory = filteredMaterials.reduce((acc: Record<string, any[]>, material: any) => {`
- **L266** : `const materialsByCategory = filteredMaterials.reduce((acc: Record<string, any[]>, material: any) => {`

### `client/src/pages/RecetteCBDDetail.tsx`

- **L349** : `{molecules.reduce((sum: number, item: any) => sum + (parseFloat(item.proportion) || 0), 0).toFixed(1)}%`
- **L352** : `{molecules.reduce((sum: number, item: any) => sum + (parseFloat(item.proportion) || 0), 0).toFixed(2)}g`
- **L349** : `{molecules.reduce((sum: number, item: any) => sum + (parseFloat(item.proportion) || 0), 0).toFixed(1)}%`
- **L352** : `{molecules.reduce((sum: number, item: any) => sum + (parseFloat(item.proportion) || 0), 0).toFixed(2)}g`

### `client/src/pages/ReferencesGraph.tsx`

- **L327** : `node.on("click", (event, d: any) => {`
- **L327** : `node.on("click", (event, d: any) => {`

### `client/src/pages/ReferencesV3.tsx`

- **L53** : `[key: string]: any;`
- **L63** : `[key: string]: any;`
- **L53** : `[key: string]: any;`
- **L63** : `[key: string]: any;`

### `client/src/pages/SmilesViewer.tsx`

- **L75** : `} catch (e: any) {`
- **L75** : `} catch (e: any) {`

### `client/src/pages/SynergiesMoleculaires.tsx`

- **L128** : `.on("start", (event, d: any) => {`
- **L133** : `.on("drag", (event, d: any) => {`
- **L137** : `.on("end", (event, d: any) => {`
- **L128** : `.on("start", (event, d: any) => {`
- **L133** : `.on("drag", (event, d: any) => {`
- **L137** : `.on("end", (event, d: any) => {`

### `client/src/pages/TerpProfilesCompare.tsx`

- **L271** : `return profiles.reduce((acc: Record<string, any[]>, profile: any) => {`
- **L271** : `return profiles.reduce((acc: Record<string, any[]>, profile: any) => {`

### `client/src/pages/Terroirs.tsx`

- **L528** : `const terroirsByCountry = filteredTerroirs.reduce((acc: Record<string, any[]>, terroir: any) => {`
- **L528** : `const terroirsByCountry = filteredTerroirs.reduce((acc: Record<string, any[]>, terroir: any) => {`

### `client/src/pages/admin/AIBatchEnrichMolecules.tsx`

- **L85** : `} catch (e: any) {`
- **L85** : `} catch (e: any) {`

### `client/src/pages/admin/MoleculeOriginsAdmin.tsx`

- **L176** : `{origins?.reduce((sum: number, o: any) => sum + (o.moleculeCount || 0), 0) || 0}`
- **L176** : `{origins?.reduce((sum: number, o: any) => sum + (o.moleculeCount || 0), 0) || 0}`

## Propriétés typées `any[]`

**Correction suggérée :** Remplacer par le type réel ou `unknown[]`

### `client/src/components/AnalyticsDashboard.tsx`

- **L12** : `recipes: any[];`
- **L13** : `molecules: any[];`
- **L12** : `recipes: any[];`
- **L13** : `molecules: any[];`

### `client/src/hooks/usePersistFn.ts`

- **L4** : `type noop = (...args: any[]) => any;`
- **L4** : `type noop = (...args: any[]) => any;`

### `client/src/pages/AdminImportExport.tsx`

- **L171** : `const objectsToCSV = (data: any[]): string => {`
- **L210** : `let data: any[];`
- **L268** : `let data: any[];`
- **L171** : `const objectsToCSV = (data: any[]): string => {`
- **L210** : `let data: any[];`
- **L268** : `let data: any[];`

### `client/src/pages/AnalyticsDashboardAdvanced.tsx`

- **L140** : `function AverageRadarChart({ molecules }: { molecules: any[] }) {`
- **L216** : `function FamilyDistributionChart({ molecules }: { molecules: any[] }) {`
- **L314** : `function RecetteCategoryChart({ recettes }: { recettes: any[] }) {`
- **L359** : `function RecentActivityList({ activities }: { activities: any[] }) {`
- **L140** : `function AverageRadarChart({ molecules }: { molecules: any[] }) {`
- **L216** : `function FamilyDistributionChart({ molecules }: { molecules: any[] }) {`
- **L314** : `function RecetteCategoryChart({ recettes }: { recettes: any[] }) {`
- **L359** : `function RecentActivityList({ activities }: { activities: any[] }) {`

### `client/src/pages/BiosyntheticPathways.tsx`

- **L154** : `tpsGenes: any[];`
- **L155** : `molecules: any[];`
- **L156** : `links: any[];`
- **L172** : `const nodes: any[] = [`
- **L154** : `tpsGenes: any[];`
- **L155** : `molecules: any[];`
- **L156** : `links: any[];`
- **L172** : `const nodes: any[] = [`

### `client/src/pages/CarteInteractiveTerroirs.tsx`

- **L64** : `mainCrops: any[] | null;`
- **L67** : `certifications: any[] | null;`
- **L64** : `mainCrops: any[] | null;`
- **L67** : `certifications: any[] | null;`

### `client/src/pages/CarteTerroirsPlantes.tsx`

- **L57** : `mainCrops: any[] | null;`
- **L60** : `certifications: any[] | null;`
- **L57** : `mainCrops: any[] | null;`
- **L60** : `certifications: any[] | null;`

### `client/src/pages/CompareMoleculesAdvanced.tsx`

- **L11** : `function RadarChart({ data }: { data: { labels: string[]; datasets: any[] } }) {`
- **L11** : `function RadarChart({ data }: { data: { labels: string[]; datasets: any[] } }) {`

### `client/src/pages/ContributorInterface.tsx`

- **L270** : `exact: any[];`
- **L271** : `similar: any[];`
- **L270** : `exact: any[];`
- **L271** : `similar: any[];`

### `client/src/pages/GCMSChromatograms.tsx`

- **L14** : `function ChromatogramChart({ peaks, landraceName }: { peaks: any[]; landraceName: string }) {`
- **L14** : `function ChromatogramChart({ peaks, landraceName }: { peaks: any[]; landraceName: string }) {`

### `client/src/pages/Gammes.tsx`

- **L114** : `recettes: any[];`
- **L115** : `molecules: any[];`
- **L116** : `plants: any[];`
- **L173** : `recettes: any[];`
- **L174** : `molecules: any[];`
- **L175** : `plants: any[];`
- **L114** : `recettes: any[];`
- **L115** : `molecules: any[];`
- *... et 4 autres occurrences*

### `client/src/pages/GrapheAxesThematiques.tsx`

- **L54** : `const nodes: any[] = [];`
- **L55** : `const links: any[] = [];`
- **L54** : `const nodes: any[] = [];`
- **L55** : `const links: any[] = [];`

### `client/src/pages/GrapheMoleculesRecettes.tsx`

- **L63** : `const links: any[] = [];`
- **L63** : `const links: any[] = [];`

### `client/src/pages/LandraceComparator.tsx`

- **L16** : `landraces: any[];`
- **L16** : `landraces: any[];`

### `client/src/pages/RecettesTL.tsx`

- **L293** : `function ComparisonTable({ recipes }: { recipes: any[] }) {`
- **L293** : `function ComparisonTable({ recipes }: { recipes: any[] }) {`

### `client/src/pages/RechercheAvancee.tsx`

- **L101** : `molecules: any[];`
- **L102** : `plants: any[];`
- **L103** : `civilisations: any[];`
- **L101** : `molecules: any[];`
- **L102** : `plants: any[];`
- **L103** : `civilisations: any[];`

### `client/src/pages/RecipeNetworkPage.tsx`

- **L23** : `const linkArray: any[] = [];`
- **L23** : `const linkArray: any[] = [];`

### `client/src/pages/RelationsGraph.tsx`

- **L37** : `const axisLinks: any[] = [];`
- **L37** : `const axisLinks: any[] = [];`

### `client/src/pages/ReseauAxes.tsx`

- **L130** : `axes: any[];`
- **L130** : `axes: any[];`

### `client/src/pages/ReseauLiaisons.tsx`

- **L69** : `recettes: any[],`
- **L70** : `rawMaterials: any[],`
- **L71** : `molecules: any[]`
- **L69** : `recettes: any[],`
- **L70** : `rawMaterials: any[],`
- **L71** : `molecules: any[]`

### `client/src/pages/SynergiesPage.tsx`

- **L75** : `synergies: any[];`
- **L76** : `moleculeSynergies: any[];`
- **L75** : `synergies: any[];`
- **L76** : `moleculeSynergies: any[];`

### `client/src/pages/TerpProfilesCompare.tsx`

- **L26** : `function ComparisonRadarChart({ profiles }: { profiles: any[] }) {`
- **L152** : `function MoleculeBarChart({ profiles }: { profiles: any[] }) {`
- **L26** : `function ComparisonRadarChart({ profiles }: { profiles: any[] }) {`
- **L152** : `function MoleculeBarChart({ profiles }: { profiles: any[] }) {`

### `client/src/pages/TerroirDetail.tsx`

- **L46** : `const similarTerroirs: any[] = [];`
- **L46** : `const similarTerroirs: any[] = [];`

### `client/src/pages/Terroirs.tsx`

- **L96** : `terroirs: any[];`
- **L97** : `plants: any[];`
- **L98** : `plantTerroirs: any[];`
- **L395** : `plantTerroirs: any[];`
- **L396** : `plants: any[];`
- **L96** : `terroirs: any[];`
- **L97** : `plants: any[];`
- **L98** : `plantTerroirs: any[];`
- *... et 2 autres occurrences*

### `client/src/pages/TobaccoLandraceDetail.tsx`

- **L20** : `function ChromatogramChart({ peaks, landraceName }: { peaks: any[]; landraceName: string }) {`
- **L165** : `function MSSpectraTab({ peaks, landraceName }: { peaks: any[]; landraceName: string }) {`
- **L20** : `function ChromatogramChart({ peaks, landraceName }: { peaks: any[]; landraceName: string }) {`
- **L165** : `function MSSpectraTab({ peaks, landraceName }: { peaks: any[]; landraceName: string }) {`

### `client/src/pages/__tests__/ClaimsAndProofs.test.ts`

- **L264** : `const claims: any[] = [];`
- **L264** : `const claims: any[] = [];`

### `client/src/pages/__tests__/Tabacotheque.test.ts`

- **L125** : `const empty: any[] = [];`
- **L125** : `const empty: any[] = [];`

## Paramètres de fonction `(x: any)`

**Correction suggérée :** Inférer depuis le contexte ou utiliser `unknown`

### `client/src/components/VerifiedSuppliersPanel.tsx`

- **L92** : `function SupplierMiniCard({ supplier }: { supplier: any }) {`
- **L92** : `function SupplierMiniCard({ supplier }: { supplier: any }) {`

### `client/src/components/charts/PlantTerroirNetworkGraph.tsx`

- **L319** : `function dragstarted(event: MouseEvent, d: any) {`
- **L325** : `function dragged(event: MouseEvent, d: any) {`
- **L330** : `function dragended(event: MouseEvent, d: any) {`

### `client/src/components/charts/RecipeNetworkGraph.tsx`

- **L177** : `function dragstarted(event: MouseEvent, d: any) {`
- **L183** : `function dragged(event: MouseEvent, d: any) {`
- **L188** : `function dragended(event: MouseEvent, d: any) {`

### `client/src/components/charts/TerrainPlantMoleculeGraph.tsx`

- **L501** : `function dragstarted(event: MouseEvent, d: any) {`
- **L507** : `function dragged(event: MouseEvent, d: any) {`
- **L512** : `function dragended(event: MouseEvent, d: any) {`

### `client/src/components/content/PlantsContent.tsx`

- **L93** : `function PlantCard({ plant }: { plant: any }) {`
- **L93** : `function PlantCard({ plant }: { plant: any }) {`

### `client/src/components/content/TerroirsContent.tsx`

- **L55** : `function TerroirCard({ terroir, plantCount }: { terroir: any; plantCount: number }) {`
- **L55** : `function TerroirCard({ terroir, plantCount }: { terroir: any; plantCount: number }) {`

### `client/src/components/content/VarietiesContent.tsx`

- **L101** : `function VarietyCard({ variety }: { variety: any }) {`
- **L101** : `function VarietyCard({ variety }: { variety: any }) {`

### `client/src/pages/AnalysisHub.tsx`

- **L16** : `function StatCard({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: number | string; trend?`
- **L38** : `function QuickAccessCard({ href, icon: Icon, title, description, color, badge }: { href: string; icon: any; title: strin`
- **L16** : `function StatCard({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: number | string; trend?`
- **L38** : `function QuickAccessCard({ href, icon: Icon, title, description, color, badge }: { href: string; icon: any; title: strin`

### `client/src/pages/BibliographiePage.tsx`

- **L304** : `function StatsOverview({ stats }: { stats: any }) {`
- **L374** : `function ReferenceCard({ entry, onCopyAPA }: { entry: any; onCopyAPA: (entry: any) => void }) {`
- **L304** : `function StatsOverview({ stats }: { stats: any }) {`
- **L374** : `function ReferenceCard({ entry, onCopyAPA }: { entry: any; onCopyAPA: (entry: any) => void }) {`

### `client/src/pages/Chemotypes.tsx`

- **L69** : `function ChemotypeCard({ chemotype }: { chemotype: any }) {`
- **L69** : `function ChemotypeCard({ chemotype }: { chemotype: any }) {`

### `client/src/pages/CrossSearch.tsx`

- **L252** : `function StatsBar({ stats }: { stats: any }) {`
- **L252** : `function StatsBar({ stats }: { stats: any }) {`

### `client/src/pages/FinalRecipes.tsx`

- **L97** : `function ConcentrateDisplay({ concentrate }: { concentrate: any }) {`
- **L121** : `function FinalRecipeCard({ recipe }: { recipe: any }) {`
- **L97** : `function ConcentrateDisplay({ concentrate }: { concentrate: any }) {`
- **L121** : `function FinalRecipeCard({ recipe }: { recipe: any }) {`

### `client/src/pages/MoleculePlantRelations.tsx`

- **L43** : `function RelationCard({ relation, type }: { relation: any; type: 'molecule' | 'plant' }) {`
- **L43** : `function RelationCard({ relation, type }: { relation: any; type: 'molecule' | 'plant' }) {`

### `client/src/pages/PlantVarieties.tsx`

- **L146** : `function VarietyCard({ variety, plant }: { variety: any; plant: any }) {`
- **L146** : `function VarietyCard({ variety, plant }: { variety: any; plant: any }) {`

### `client/src/pages/RawMaterials.tsx`

- **L149** : `function RawMaterialCard({ material }: { material: any }) {`
- **L149** : `function RawMaterialCard({ material }: { material: any }) {`

### `client/src/pages/RecetteDetail.tsx`

- **L1571** : `function TransformationCard({ transformation }: { transformation: any }) {`
- **L1571** : `function TransformationCard({ transformation }: { transformation: any }) {`

### `client/src/pages/RecettesTL.tsx`

- **L45** : `function TLRadarChart({ formulation, size = 180 }: { formulation: any; size?: number }) {`
- **L210** : `function TLRecipeCard({ recipe, expanded, onToggle }: { recipe: any; expanded: boolean; onToggle: () => void }) {`
- **L45** : `function TLRadarChart({ formulation, size = 180 }: { formulation: any; size?: number }) {`
- **L210** : `function TLRecipeCard({ recipe, expanded, onToggle }: { recipe: any; expanded: boolean; onToggle: () => void }) {`

### `client/src/pages/ReseauLiaisons.tsx`

- **L36** : `function CustomNode({ data }: { data: any }) {`
- **L125** : `function buildEdges(networkData: any): Edge[] {`
- **L36** : `function CustomNode({ data }: { data: any }) {`
- **L125** : `function buildEdges(networkData: any): Edge[] {`

### `client/src/pages/SourcingHub.tsx`

- **L109** : `function SupplierCard({ supplier }: { supplier: any }) {`
- **L109** : `function SupplierCard({ supplier }: { supplier: any }) {`

### `client/src/pages/TerpProfiles.tsx`

- **L32** : `function TerpRadarChart({ profile }: { profile: any }) {`
- **L160** : `function TerpProfileCard({ profile }: { profile: any }) {`
- **L32** : `function TerpRadarChart({ profile }: { profile: any }) {`
- **L160** : `function TerpProfileCard({ profile }: { profile: any }) {`

### `client/src/pages/admin/AdminPlantMolecules.tsx`

- **L166** : `function startEdit(item: any) {`
- **L166** : `function startEdit(item: any) {`

### `client/src/pages/admin/DataQuality.tsx`

- **L36** : `function pct(val: any, total: any): number {`
- **L54** : `function calcGlobalScore(m: any): number {`
- **L36** : `function pct(val: any, total: any): number {`
- **L54** : `function calcGlobalScore(m: any): number {`

### `client/src/pages/admin/PubChemIupacBatch.tsx`

- **L26** : `function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: any; sub?: string }) {`
- **L26** : `function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: any; sub?: string }) {`

## Variables locales `const x: any`

**Correction suggérée :** Inférer le type depuis l'initialisation

### `client/src/pages/AbsorbeScale.tsx`

- **L49** : `const dataPoint: any = { axis: axis.label };`
- **L49** : `const dataPoint: any = { axis: axis.label };`

### `client/src/pages/ComparaisonAvancee.tsx`

- **L253** : `const dataPoint: any = { axis: axis.label, fullLabel: axis.fullLabel };`
- **L301** : `const dataPoint: any = { axis: axis.label };`
- **L253** : `const dataPoint: any = { axis: axis.label, fullLabel: axis.fullLabel };`
- **L301** : `const dataPoint: any = { axis: axis.label };`

### `client/src/pages/ComparaisonMolecules.tsx`

- **L65** : `const dataPoint: any = { characteristic: char };`
- **L65** : `const dataPoint: any = { characteristic: char };`

### `client/src/pages/__tests__/Tabacotheque.test.ts`

- **L267** : `const variety: any = {`
- **L267** : `const variety: any = {`

## Props de composant destructurées `({ prop }: any)`

**Correction suggérée :** Créer une interface Props

### `client/src/components/AIEnrichButton.tsx`

- **L120** : `function Section({ label, expanded, onToggle, children }: any) {`
- **L132** : `function PreviewPanel({ data, entityType, expandedSections, onToggle }: any) {`
- **L120** : `function Section({ label, expanded, onToggle, children }: any) {`
- **L132** : `function PreviewPanel({ data, entityType, expandedSections, onToggle }: any) {`

---

## Guide de correction rapide

### Callbacks D3
```typescript
// Avant
.attr("cx", (d: any) => d.x)

// Après — avec type D3
import type { SimulationNodeDatum } from "d3";
interface GraphNode extends SimulationNodeDatum { id: string; x?: number; }
.attr("cx", (d: GraphNode) => d.x ?? 0)
```

### Props de composant
```typescript
// Avant
function Card({ title, value }: any) {

// Après
interface CardProps { title: string; value: number; }
function Card({ title, value }: CardProps) {
```

### Variables locales
```typescript
// Avant
const dataPoint: any = { axis: axis.label };

// Après
const dataPoint: Record<string, string | number> = { axis: axis.label };
// ou laisser TypeScript inférer :
const dataPoint = { axis: axis.label };
```

### Casts complexes `as any`
```typescript
// Avant
(someObj as any).specialProp

// Après — double cast sûr
(someObj as unknown as { specialProp: string }).specialProp
// ou avec Record si la structure est inconnue
(someObj as Record<string, unknown>).specialProp as string
```

*Rapport généré par wave2_fix_any.py — Projet PERFUMUM*