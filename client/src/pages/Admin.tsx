import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Beaker, 
  Layers, 
  FlaskConical, 
  BookOpen, 
  Palette,
  Database,
  BarChart3,
  Sparkles,
  Lightbulb,
  Loader2,
  Flame,
  Snowflake,
  Leaf,
  Droplets,
  Upload,
  Globe,
  Link2,
  PackageOpen,
  ArrowRightLeft,
  Image,
  Brain,
  FileSearch,
  CheckSquare,
  AlertTriangle,
  Map,
  Shield,
  Network,
  FileInput,
  FileStack,
  TrendingUp,
  Film,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Admin() {
  // Charger les statistiques
  const { data: stats } = trpc.admin.getStats.useQuery();
  const [isEnriching, setIsEnriching] = useState(false);
  
  const [enrichingGamme, setEnrichingGamme] = useState<string | null>(null);
  
  const enrichGammeMutation = trpc.recettes.enrichGamme.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.recettesProcessed} recettes enrichies avec ${data.associationsCreated} associations !`);
      setEnrichingGamme(null);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setEnrichingGamme(null);
    },
  });
  
  const handleEnrichGamme = (gamme: 'volcanique' | 'glaciaire' | 'biolab' | 'petrichor') => {
    setEnrichingGamme(gamme);
    enrichGammeMutation.mutate({ gamme });
  };
  
  const enrichMutation = trpc.admin.enrichMoleculeData.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.updated} molécules enrichies avec succès !`);
      setIsEnriching(false);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setIsEnriching(false);
    },
  });
  
  const handleEnrichData = () => {
    setIsEnriching(true);
    enrichMutation.mutate();
  };

  const adminSections = [
    {
      title: "Molécules",
      description: "Gérer le catalogue des molécules olfactives",
      icon: Beaker,
      href: "/admin/molecules",
      count: stats?.molecules || 0,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Plantes (Admin)",
      description: "Édition manuelle, enrichissement GBIF/Wikidata, suppression sécurisée",
      icon: Leaf,
      href: "/admin/plants-manage",
      count: stats?.plants || 0,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Accords",
      description: "Créer et modifier les accords olfactifs",
      icon: Layers,
      href: "/admin/accords",
      count: stats?.accords || 0,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Familles",
      description: "Organiser les familles olfactives",
      icon: Palette,
      href: "/admin/familles",
      count: stats?.families || 0,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Matières Premières",
      description: "Gérer l'inventaire du laboratoire",
      icon: FlaskConical,
      href: "/admin/matieres",
      count: stats?.matieres || 0,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Recettes",
      description: "Documenter les formulations complètes",
      icon: BookOpen,
      href: "/admin/recettes",
      count: stats?.recettes || 0,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      title: "Références",
      description: "Gérer les références bibliographiques",
      icon: Database,
      href: "/admin/references",
      count: 0,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const adminTools = [
    {
      title: "Import/Export",
      description: "Importer et exporter les données",
      icon: Database,
      href: "/admin/import-export",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Import Plantes",
      description: "Importer les données botaniques",
      icon: Leaf,
      href: "/admin/import-export-plants",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Import CSV",
      description: "Importer des fichiers CSV (molécules, plantes, variétés)",
      icon: Upload,
      href: "/admin/import-csv",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Liaisons Recettes",
      description: "Gérer les liaisons molécules-recettes",
      icon: Layers,
      href: "/admin/liaison-recettes-molecules",
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Molécule ↔ Recette (P0)",
      description: "Interface améliorée avec statistiques de couverture",
      icon: BarChart3,
      href: "/molecule-recette-linking",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Plante ↔ Terroir (P0)",
      description: "Associer plantes et terroirs d'origine",
      icon: Leaf,
      href: "/plant-terroir-linking",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Origines Molécules",
      description: "Gérer les origines des molécules",
      icon: Beaker,
      href: "/admin/molecule-origins",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Géocodage Terroirs",
      description: "Géolocaliser les terroirs",
      icon: Database,
      href: "/admin/terroirs-geocode",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Historique",
      description: "Consulter l'historique des modifications",
      icon: BookOpen,
      href: "/admin/historique",
      color: "text-slate-600",
      bgColor: "bg-slate-50",
    },
    {
      title: "Qualité des données",
      description: "Nettoyer les doublons, enrichir les formules, analyser les liaisons",
      icon: Sparkles,
      href: "/admin/data-quality",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "Molecule Manager",
      description: "Fusionner les doublons de molécules, gérer les relations plantes-molécules",
      icon: FlaskConical,
      href: "/admin/molecule-manager",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Liaisons Plantes — Molécules",
      description: "Gérer les liaisons bidirectionnelles plante/molécule : pourcentages GC-MS, rôles, signatures. Distingue molécules pures, extraits et mélanges.",
      icon: Leaf,
      href: "/admin/plant-molecules",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Cigarillos ↔ Molécules",
      description: "Associer les molécules aromatiques aux 32 recettes cigarillos (rôle, pourcentage, notes).",
      icon: Layers,
      href: "/admin/liaison-cigarillos-molecules",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Enrichissement PubChem — Batch",
      description: "Enrichir en masse les molécules sans CID PubChem (IUPAC, CAS, formule, poids, SMILES, synonymes).",
      icon: Database,
      href: "/admin/pubchem-batch",
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Enrichissement ChEBI — Batch",
      description: "Enrichir en masse les molécules naturelles sans PubChem CID via ChEBI (terpènes, alcaloïdes, phénols, acides gras).",
      icon: Database,
      href: "/admin/chebi-batch",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "Enrichissement IA — Lot Plantes & Matières",
      description: "Enrichir en masse les plantes et matières premières sans description, profil olfactif ou propriétés thérapeutiques via l'IA.",
      icon: Sparkles,
      href: "/admin/ai-batch-enrich",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Enrichissement IA — Lot Molécules",
      description: "Enrichir en masse les molécules sans profil olfactif, propriétés thérapeutiques ou IUPAC via l'IA.",
      icon: Sparkles,
      href: "/admin/ai-batch-enrich-molecules",
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Enrichissement GBIF — Batch Plantes",
      description: "Enrichir en masse les plantes via GBIF (taxonomie, UICN), Open-Meteo (climat, Köppen) et CITES — sans crédits IA.",
      icon: Globe,
      href: "/admin/gbif-batch",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "LOTUS — Liaisons Plante-Molécule",
      description: "Enrichir automatiquement les liaisons plante-molécule via LOTUS/Wikidata (220 000+ paires espèce-molécule) — sans crédits IA.",
      icon: Link2,
      href: "/admin/lotus-batch",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "Wikidata QIDs — NOSE Phase 4",
      description: "Intégrer les identifiants Wikidata (QIDs) pour molécules et plantes — interopérabilité Odeuropa/Europeana, export JSON-LD NOSE.",
      icon: Globe,
      href: "/admin/wikidata-batch",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Enrichissement QID Wikidata — Molécules (Rapport 15)",
      description: "Associer des identifiants Wikidata aux molécules sans QID via l'API wbsearchentities. Recherche par nom, CAS et IUPAC avec score de confiance. Batch automatique + validation manuelle.",
      icon: Globe,
      href: "/admin/molecule-qid-enrichment",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Validation QID via CAS — Correction Automatique",
      description: "Vérifier et corriger automatiquement les QIDs Wikidata erronés en les croisant avec les numéros CAS (propriété P231). Détecte les QIDs incorrects, propose les corrections et applique en batch.",
      icon: ShieldCheck,
      href: "/admin/qid-cas-validator",
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Knowledge Graph Moléculaire — Phase A+B",
      description: "Phase A : enrichissement PubChem étendu (InChI, InChIKey, XLogP, TPSA, identifiants croisés ChEBI/KEGG/HMDB). Phase B : Knowledge Graph Wikidata SPARQL (classes chimiques, biosynthèse, organismes producteurs, huiles essentielles, résines, odèurs, usages). 7 494 molécules à enrichir.",
      icon: Network,
      href: "/admin/molecule-kg-enrichment",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Revue humaine Zenodo — 50 termes",
      description: "Revoir les termes olfactifs multilingues du pilote Zenodo : contexte source, proposition LLM, décision linguistique et décision scientifique séparées avant toute intégration.",
      icon: CheckSquare,
      href: "/admin/zenodo-term-review",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Enrichissement Taxonomique — Plantes (Rapport 16)",
      description: "Compléter la famille botanique des 126 plantes sans family via Wikidata (QID direct ou recherche) et GBIF. Batch automatique avec score de confiance + validation manuelle individuelle.",
      icon: Leaf,
      href: "/admin/taxonomy-enrichment",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "COCONUT — Enrichissement Produits Naturels",
      description: "Enrichir les molécules avec l'identifiant COCONUT, score NP-likeness, organismes sources et citations (716 000+ molécules, 70 000+ organismes).",
      icon: Globe,
      href: "/admin/coconut-batch",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "KNApSAcK — Liaisons Plante-Molécule",
      description: "Enrichir les liaisons plante-molécule via KNApSAcK (101 500+ paires espèce-molécule) — matching CAS/nom, sans crédits IA.",
      icon: Database,
      href: "/admin/knapsack-batch",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Complétion IUPAC via PubChem",
      description: "Compléter automatiquement les noms IUPAC manquants des molécules via l'API publique PubChem (CAS → IUPAC). 135 molécules récupérables.",
      icon: Database,
      href: "/admin/pubchem-iupac-batch",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Tableau de Bord de Complétude",
      description: "Suivre l'enrichissement des données — matières premières, plantes et terroirs classés par score de complétude.",
      icon: BarChart3,
      href: "/admin/completude",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Visualisation du Bundle",
      description: "Analyser les chunks JavaScript du build de production — tailles, répartition, chunks critiques.",
      icon: PackageOpen,
      href: "/admin/bundle-visualizer",
      color: "text-slate-600",
      bgColor: "bg-slate-50",
    },
    {
      title: "Reclassifier les Matières Premières",
      description: "Déplacer les extraits, résines, huiles et accords mal classés dans molecules vers raw_materials.",
      icon: ArrowRightLeft,
      href: "/admin/reclassify-molecules",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Images Botaniques — Wikimedia",
      description: "Enrichir automatiquement les images de plantes via Wikipedia et Wikimedia Commons (483 plantes recuperables par nom latin).",
      icon: Image,
      href: "/admin/wikimedia-batch",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "SMILES — PubChem Batch",
      description: "Recuperer les SMILES manquants via PubChem CID (491 molecules) ou CAS (49 molecules). Couverture actuelle : 19% → potentiel 80%+.",
      icon: FlaskConical,
      href: "/admin/smiles-batch",
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Méthodes d'Extraction",
      description: "Gérer les méthodes d'extraction (distillation, CO₂ supercritique, enfleurage…) : créer, modifier, supprimer. Interface de délégation pour collaborateurs.",
      icon: FlaskConical,
      href: "/admin/extraction-methods",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Matrice Thermique ABSORBE",
      description: "Visualiser les propriétés thermiques des matières premières : TRI, SAI, HPI, constellations, comportement eau/graisse.",
      icon: FlaskConical,
      href: "/admin/thermal-matrix",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "NOSE — Ontologie Olfactive",
      description: "Dashboard NOSE/Odeuropa : 1967 émissions GC-MS (od:L12), expériences subjectives (od:L13), import CSV/TSV avec dry-run.",
      icon: Database,
      href: "/admin/nose",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Atlas Mnémosyne — Fils Narratifs",
      description: "NOSE Phase 3 (od:L14) : gérer les storylines transversaux — La Route de l'Encens, Tabac & Rituel, Plantes Menacées...",
      icon: BookOpen,
      href: "/admin/storylines",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "SPARQL Explorer — NOSE Phase 5",
      description: "Requêtes croisées PERFUMUM ↔ Wikidata ↔ Europeana : œuvres d'art, publications scientifiques, collections muséales liées aux molécules et plantes.",
      icon: Globe,
      href: "/admin/sparql-explorer",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Smellscapes Cinématographiques",
      description: "Identifiez et documentez les occurrences olfactives dans les films du patrimoine mondial. Croisez Wikidata (films, réalisateurs, lieux) avec la base moléculaire PERFUMUM.",
      icon: Film,
      href: "/admin/cinema-smellscapes",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Graphe de Connaissances — Axe 2.3",
      description: "Visualisation D3.js force-directed du graphe de connaissances PERFUMUM : molécules, plantes, recettes, familles olfactives et bibliographie interconnectés.",
      icon: Network,
      href: "/admin/knowledge-graph",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Migration v3 & Cache SPARQL — Rapport 7",
      description: "Fusion bibliographique v3_references → bibliography_entries (Axe 1.4), gestion du cache SPARQL DB 24h (Axe 2.5), enrichissement CrossRef et réseau de citations (Axe 3.3).",
      icon: Database,
      href: "/admin/v3-migration",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "Tropicos — Missouri Botanical Garden",
      description: "Enrichir les données taxonomiques depuis Tropicos : 1.33M noms botaniques, synonymes, 685K images, distribution géographique. Idéal pour Nicotiana, Cannabis, Rosa.",
      icon: Leaf,
      href: "/admin/tropicos-enrichment",
      color: "text-green-700",
      bgColor: "bg-green-50",
    },
    {
      title: "Images Morphologiques — Variétés",
      description: "Uploader et gérer les images morphologiques (feuille, fleur, fruit) pour chaque variété avec stockage S3. Vérification et annotation des images.",
      icon: Image,
      href: "/admin/variety-images",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Import CSV — Généalogies de Variétés",
      description: "Importer en masse les variétés et leurs relations généalogiques depuis CSV avec mode dry-run (prévisualisation) avant import réel.",
      icon: Database,
      href: "/admin/variety-genealogy-import",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
    },
    {
      title: "Wikidata Sync — Généalogies Phylogénétiques",
      description: "Synchroniser les données généalogiques avec Wikidata via SPARQL : taxonomie, hybrides, distribution, statuts IUCN pour Nicotiana, Cannabis, Rosa.",
      icon: Globe,
      href: "/admin/wikidata-sync",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      title: "GBIF — Enrichissement Géographique",
      description: "Rechercher une espèce dans GBIF (2 milliards d'occurrences) : taxonomie complète, distribution par pays, noms vernaculaires multilingues. Import direct dans la fiche plante.",
      icon: Globe,
      href: "/admin/gbif-enrichment",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      title: "LOTUS — Profil Moléculaire",
      description: "Interroger LOTUS/Wikidata (220 000+ paires plante-molécule) pour voir les molécules documentées d'une plante ou les plantes sources d'une molécule. Via SPARQL P703.",
      icon: Database,
      href: "/admin/lotus-enrichment",
      color: "text-violet-700",
      bgColor: "bg-violet-50",
    },
    {
      title: "LOTUS → Liaison Plantes",
      description: "Importer directement les molécules LOTUS dans les fiches de plantes PERFUMUM. Crée la molécule si elle n'existe pas, puis établit le lien plant_molecules.",
      icon: Link2,
      href: "/admin/lotus-plant-linker",
      color: "text-violet-700",
      bgColor: "bg-violet-50",
    },
    {
      title: "LOTUS → Import Genre Entier",
      description: "Importer en masse toutes les molécules LOTUS pour toutes les espèces d'un genre botanique (ex: Lavandula, Rosa, Nicotiana). Aperçu dry-run avant import, déduplication automatique.",
      icon: FlaskConical,
      href: "/admin/lotus-batch-genus",
      color: "text-violet-700",
      bgColor: "bg-violet-50",
    },
    {
      title: "Couverture APIs — Dashboard",
      description: "Visualiser pour chaque plante quelles APIs ont retourné des données (GBIF, POWO, NCBI, Wikidata, ITIS) avec score de complétude, filtres par genre et export.",
      icon: Database,
      href: "/admin/api-coverage",
      color: "text-indigo-700",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Hub Comparateur",
      description: "Tous les outils de comparaison PERFUMUM réunis : molécules, terpènes, plantes, recettes, extractions et spectres.",
      icon: ArrowRightLeft,
      href: "/comparateur",
      color: "text-sky-600",
      bgColor: "bg-sky-50",
    },
  ];

  const adminAdvancedTools = [
    // Classification & Revue
    { category: "Classification & Revue", title: "Classification IA — Manuelle", description: "Classer manuellement les molécules via l'IA : famille chimique, profil olfactif, propriétés thérapeutiques.", icon: Brain, href: "/admin/ai-classification", color: "text-purple-600", bgColor: "bg-purple-50" },
    { category: "Classification & Revue", title: "Classification IA — Par lot", description: "Classer automatiquement en masse les molécules non classifiées via l'IA.", icon: Brain, href: "/admin/ai-classification-batch", color: "text-purple-700", bgColor: "bg-purple-50" },
    { category: "Classification & Revue", title: "Revue des Classifications", description: "Valider, corriger ou rejeter les classifications IA en attente de revue humaine.", icon: CheckSquare, href: "/admin/classification-review", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { category: "Classification & Revue", title: "Familles Chimiques — Liaison", description: "Lier manuellement les molécules à leurs familles chimiques (terpènes, phénols, esters…).", icon: Network, href: "/admin/chemical-family-linking", color: "text-blue-600", bgColor: "bg-blue-50" },
    // Qualité & Doublons
    { category: "Qualité & Doublons", title: "Molécules Orphelines", description: "Identifier et traiter les molécules sans liaison plante, recette ou famille chimique.", icon: AlertTriangle, href: "/admin/orphan-molecules", color: "text-amber-600", bgColor: "bg-amber-50" },
    { category: "Qualité & Doublons", title: "Gestion des Doublons", description: "Détecter et fusionner les entrées dupliquées dans la base de données.", icon: CheckSquare, href: "/admin/duplicates", color: "text-orange-600", bgColor: "bg-orange-50" },
    { category: "Qualité & Doublons", title: "Rapport de Progression", description: "Tableau de bord global de l'avancement de l'enrichissement et de la qualité des données.", icon: TrendingUp, href: "/admin/progress-report", color: "text-teal-600", bgColor: "bg-teal-50" },
    { category: "Qualité & Doublons", title: "Synergies — Admin", description: "Gérer et valider les synergies moléculaires détectées automatiquement.", icon: Network, href: "/admin/synergies", color: "text-violet-600", bgColor: "bg-violet-50" },
    // Bibliographie & Liaisons
    { category: "Bibliographie & Liaisons", title: "Enrichissement Bibliographique", description: "Lier les références bibliographiques aux molécules, plantes, recettes et terroirs.", icon: FileSearch, href: "/admin/bibliographic-enrichment", color: "text-rose-600", bgColor: "bg-rose-50" },
    { category: "Bibliographie & Liaisons", title: "Liaison Plantes de Niche", description: "Associer les plantes de niche (rares, endémiques) à leurs molécules et terroirs.", icon: Leaf, href: "/admin/niche-plant-linking", color: "text-green-600", bgColor: "bg-green-50" },
    // Imports
    { category: "Imports", title: "Import par Lot", description: "Importer des données en masse depuis des fichiers structurés (JSON, CSV).", icon: FileInput, href: "/batch-import", color: "text-cyan-600", bgColor: "bg-cyan-50" },
    { category: "Imports", title: "Import Références en Masse", description: "Importer des références bibliographiques en masse depuis BibTeX, RIS ou CSV.", icon: FileStack, href: "/bulk-import-references", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { category: "Imports", title: "Validation & Import CSV", description: "Valider la structure d'un fichier CSV avant import avec rapport d'erreurs détaillé.", icon: CheckSquare, href: "/csv-validation-import", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    // Europeana & IUCN
    { category: "Europeana & IUCN", title: "Carte Europeana", description: "Visualiser les œuvres Europeana liées aux plantes et molécules sur une carte interactive.", icon: Map, href: "/admin/europeana-map", color: "text-blue-600", bgColor: "bg-blue-50" },
    { category: "Europeana & IUCN", title: "Europeana QID — Batch", description: "Enrichir en masse les entités PERFUMUM avec les identifiants Europeana QID.", icon: Globe, href: "/admin/europeana-qid-batch", color: "text-blue-700", bgColor: "bg-blue-50" },
    { category: "Europeana & IUCN", title: "IUCN — Enrichissement", description: "Récupérer les statuts de conservation IUCN (EN, VU, CR, EX) pour les plantes PERFUMUM.", icon: Shield, href: "/admin/iucn-enrichment", color: "text-red-600", bgColor: "bg-red-50" },
    // Enrichissement COCONUT
    { category: "Enrichissement COCONUT & Phylogénie", title: "COCONUT — Enrichissement", description: "Enrichir les molécules avec les données COCONUT (NP-likeness, organismes sources).", icon: Database, href: "/admin/coconut-enrichment", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { category: "Enrichissement COCONUT & Phylogénie", title: "Phylogénie — Enrichissement", description: "Enrichir les données phylogénétiques des plantes (Tropicos, NCBI, GBIF).", icon: Leaf, href: "/admin/phylo-enrichment", color: "text-green-700", bgColor: "bg-green-50" },
  ];

  const advancedCategories = adminAdvancedTools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof adminAdvancedTools>);

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <Database className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Administration
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Interface de gestion des données PERFUMUM
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Overview */}
        {stats && (
          <section className="py-12 bg-muted/30">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Vue d'ensemble</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-3xl font-bold text-primary">
                        {stats?.prototypes}
                      </CardTitle>
                      <CardDescription>Prototypes</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-3xl font-bold text-purple-600">
                        {stats?.molecules}
                      </CardTitle>
                      <CardDescription>Molécules</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-3xl font-bold text-green-600">
                        {stats?.accords}
                      </CardTitle>
                      <CardDescription>Accords</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-3xl font-bold text-blue-600">
                        {stats?.families}
                      </CardTitle>
                      <CardDescription>Familles</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-3xl font-bold text-rose-600">
                        {stats?.recettes}
                      </CardTitle>
                      <CardDescription>Recettes</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Admin Sections */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Gestion des données</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminSections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className={`p-3 rounded-lg ${section.bgColor}`}>
                            <Icon className={`w-6 h-6 ${section.color}`} />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {section.count}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              entrées
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-xl mt-4">{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link href={section.href}>
                          <Button className="w-full btn-enhanced" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Gérer
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Outils Admin */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Outils d'administration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminTools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${tool.bgColor}`}>
                            <Icon className={`w-6 h-6 ${tool.color}`} />
                          </div>
                        </div>
                        <CardTitle className="text-xl mt-4">{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link href={tool.href}>
                          <Button className="w-full btn-enhanced" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Accéder
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Outils Avancés & Enrichissement */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-7 h-7 text-purple-600" />
                <h2 className="text-3xl font-bold">Outils avancés &amp; Enrichissement</h2>
              </div>
              <p className="text-muted-foreground mb-10">
                Classification IA, qualité des données, imports, enrichissement bibliographique et patrimonial.
              </p>
              {Object.entries(advancedCategories).map(([category, tools]) => (
                <div key={category} className="mb-10">
                  <h3 className="text-lg font-semibold mb-4 text-muted-foreground border-b pb-2">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => {
                      const Icon = tool.icon;
                      return (
                        <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                          <CardHeader>
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-lg ${tool.bgColor}`}>
                                <Icon className={`w-6 h-6 ${tool.color}`} />
                              </div>
                            </div>
                            <CardTitle className="text-xl mt-4">{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Link href={tool.href}>
                              <Button className="w-full btn-enhanced" variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Accéder
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outils IA */}
        <section className="py-16 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold">Outils Intelligence Artificielle</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-600" />
                      Enrichir les données
                    </CardTitle>
                    <CardDescription>
                      Génère automatiquement les propriétés manquantes (masse moléculaire, point d'ébullition, famille chimique) basées sur les profils olfactifs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleEnrichData}
                      disabled={isEnriching}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isEnriching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enrichissement en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Enrichir les molécules
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-indigo-200 dark:border-indigo-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-indigo-600" />
                      Suggestions de synergies
                    </CardTitle>
                    <CardDescription>
                      Découvrez des paires de molécules prometteuses basées sur la similarité de leurs profils radar olfactifs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/suggestions-synergies">
                      <Button variant="outline" className="w-full border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Voir les suggestions
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
              
              {/* Section Enrichissement des Gammes */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-600" />
                  Enrichir les associations molécules-recettes par gamme
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Génère automatiquement des associations entre les recettes et les molécules correspondantes pour chaque gamme olfactive.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    onClick={() => handleEnrichGamme('volcanique')}
                    disabled={enrichingGamme !== null}
                    variant="outline"
                    className="border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950"
                  >
                    {enrichingGamme === 'volcanique' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Flame className="w-4 h-4 mr-2 text-orange-600" />
                    )}
                    Volcanique
                  </Button>
                  <Button
                    onClick={() => handleEnrichGamme('glaciaire')}
                    disabled={enrichingGamme !== null}
                    variant="outline"
                    className="border-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950"
                  >
                    {enrichingGamme === 'glaciaire' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Snowflake className="w-4 h-4 mr-2 text-cyan-600" />
                    )}
                    Glaciaire
                  </Button>
                  <Button
                    onClick={() => handleEnrichGamme('biolab')}
                    disabled={enrichingGamme !== null}
                    variant="outline"
                    className="border-green-300 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    {enrichingGamme === 'biolab' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Leaf className="w-4 h-4 mr-2 text-green-600" />
                    )}
                    Bio-Lab
                  </Button>
                  <Button
                    onClick={() => handleEnrichGamme('petrichor')}
                    disabled={enrichingGamme !== null}
                    variant="outline"
                    className="border-stone-400 hover:bg-stone-50 dark:hover:bg-stone-950"
                  >
                    {enrichingGamme === 'petrichor' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Droplets className="w-4 h-4 mr-2 text-stone-600" />
                    )}
                    Pétrichor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Quick Actions */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Actions rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/admin/molecules/new">
                  <Button className="w-full btn-enhanced" size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvelle Molécule
                  </Button>
                </Link>
                <Link href="/accords">
                  <Button className="w-full btn-enhanced" size="lg" variant="outline">
                    <Plus className="w-5 h-5 mr-2" />
                    Gérer les Accords
                  </Button>
                </Link>
                <Link href="/matieres-premieres">
                  <Button className="w-full btn-enhanced" size="lg" variant="outline">
                    <Plus className="w-5 h-5 mr-2" />
                    Gérer les Matières
                  </Button>
                </Link>
                <Link href="/admin/recettes">
                  <Button className="w-full btn-enhanced" size="lg" variant="outline">
                    <Plus className="w-5 h-5 mr-2" />
                    Gérer les Recettes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 PERFUMUM — Recherche Olfactive</p>
            <Link href="/">
              <Button variant="ghost" size="sm" className="btn-enhanced">
                Retour au site
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    <Footer />

    </div>
  );
}
