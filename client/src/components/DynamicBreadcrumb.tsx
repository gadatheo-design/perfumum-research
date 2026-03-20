import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BreadcrumbSegment {
  label: string;
  path: string;
  dropdown?: Array<{ label: string; path: string }>;
}

interface DynamicBreadcrumbProps {
  segments?: BreadcrumbSegment[];
  className?: string;
}

// Configuration complète des routes avec leurs labels et parents
const routeConfig: Record<string, { label: string; parent?: string }> = {
  // Pages principales
  "/": { label: "Accueil" },
  "/systeme": { label: "Système PERFUMUM" },
  "/le-projet": { label: "Le Projet" },
  "/a-propos": { label: "À Propos" },
  "/contact": { label: "Contact" },
  "/nouveautes": { label: "Nouveautés" },
  "/manifeste": { label: "Manifeste" },
  
  // Recherche
  "/recherche-avancee": { label: "Recherche Avancée" },
  "/recherche-globale": { label: "Recherche Globale" },
  
  // Prototypes
  "/prototypes": { label: "Prototypes" },
  "/prototypes/c1": { label: "C1 — Fermentum", parent: "/prototypes" },
  "/prototypes/c2": { label: "C2 — Clarus Verde", parent: "/prototypes" },
  "/prototypes/c3": { label: "C3 — Lacta Solis", parent: "/prototypes" },
  "/prototypes/c4": { label: "C4 — Terra Ambra", parent: "/prototypes" },
  
  // Gammes
  "/gammes": { label: "Gammes" },
  "/colombie": { label: "Ligne Colombie", parent: "/gammes" },
  "/corpus-burkina": { label: "Corpus Burkina Faso", parent: "/axes-recherche" },
  "/sourcing": { label: "Sourcing" },
  "/sourcing/colombie": { label: "Colombie", parent: "/sourcing" },
  "/sourcing/france": { label: "France", parent: "/sourcing" },
  "/sourcing/inde": { label: "Inde", parent: "/sourcing" },
  "/sourcing/madagascar": { label: "Madagascar", parent: "/sourcing" },
  "/sourcing/north-america": { label: "Amérique du Nord", parent: "/sourcing" },
  "/gammes/petrichor": { label: "Petrichor", parent: "/gammes" },
  "/gammes/volcanique": { label: "Volcanique", parent: "/gammes" },
  "/gammes/glaciaire": { label: "Glaciaire", parent: "/gammes" },
  "/gammes/biolab": { label: "BioLab", parent: "/gammes" },
  "/gammes/mossi": { label: "Mossi", parent: "/gammes" },
  "/gammes/signatures": { label: "Signatures", parent: "/gammes" },
  "/gammes/pheromones": { label: "Phéromones", parent: "/gammes" },
  "/gammes/raretes": { label: "Raretés", parent: "/gammes" },
  
  // Laboratoire
  "/laboratoire": { label: "Laboratoire" },
  "/laboratoire/recettes": { label: "Recettes", parent: "/laboratoire" },
  "/laboratoire/matrice-interactive": { label: "Matrice Interactive", parent: "/laboratoire" },
  "/laboratoire/statistiques": { label: "Statistiques", parent: "/laboratoire" },
  "/inventaire": { label: "Inventaire", parent: "/laboratoire" },
  
  // Molécules
  "/molecules": { label: "Molécules" },
  "/terpenes": { label: "Terpènes", parent: "/molecules" },
  "/familles": { label: "Familles Olfactives" },
  "/familles-chimiques": { label: "Familles Chimiques" },
  
  // Recettes
  "/recettes": { label: "Recettes" },
  "/accords": { label: "Accords" },
  "/accords-dedies": { label: "Accords Dédiés" },
  "/accords-experimentaux": { label: "Accords Expérimentaux" },
  "/recherche-radicale": { label: "Recherche Radicale" },
  "/fondements-philosophiques": { label: "Fondements Philosophiques" },
  
  // Résines CBD
  "/resines-cbd": { label: "Résines CBD" },
  "/protocoles-maturation": { label: "Protocoles de Maturation" },
  
  // Comparaison & Visualisation
  "/compare": { label: "Comparer" },
  "/heatmap-correlations": { label: "Heatmap Radar", parent: "/analyses" },
  "/analyses": { label: "Analyses de Corrélation" },
  "/correlations": { label: "Corrélations Parfum-Tabac-Cannabis" },
  "/recipe-network": { label: "Réseau de Recettes", parent: "/recettes" },
  "/timeline-recettes": { label: "Timeline Recettes", parent: "/recettes" },
  "/recettes-leaf-economies": { label: "Recettes Leaf Economies", parent: "/leaf-economies" },
  "/compare-molecules-advanced": { label: "Comparaison Avancée", parent: "/molecules" },
  "/synergies-graph-visualization": { label: "Graphe Synergies", parent: "/synergies" },
  "/enhanced-radar": { label: "Radar Avancé", parent: "/analyses" },
  "/compare-terpenes": { label: "Comparaison Terpènes", parent: "/molecules" },
  "/compare-radar": { label: "Comparaison Radar", parent: "/molecules" },
  "/compare-recettes": { label: "Comparaison Recettes", parent: "/recettes" },
  "/compare-molecules": { label: "Comparaison Molécules", parent: "/molecules" },
  "/compare-plants": { label: "Comparaison Plantes", parent: "/plants" },
  "/comparateur-avance": { label: "Comparateur Avancé" },
  "/matrice-synergies": { label: "Matrice Synergies" },
  "/graphe-molecules-recettes": { label: "Graphe Molécules-Recettes" },
  "/synergies": { label: "Synergies" },
  "/suggestions-synergies": { label: "Suggestions Synergies" },
  "/synergies-heatmap": { label: "Heatmap Synergies" },
  "/reseau-recettes": { label: "Réseau Recettes" },
  "/sankey-flow": { label: "Sankey Flow" },
  
  // Outils
  "/outils": { label: "Outils" },
  "/outils/formulation": { label: "Formulation", parent: "/outils" },
  "/outils/proportions": { label: "Proportions", parent: "/outils" },
  "/outils/dilution": { label: "Dilution", parent: "/outils" },
  "/outils/correlation": { label: "Corrélation", parent: "/outils" },
  "/outils/editeur-formulation": { label: "Éditeur Formulation", parent: "/outils" },
  "/carte-origines": { label: "Carte des Origines" },
  "/export-bibliographique": { label: "Export Bibliographique" },
  "/enrichissement-pubchem": { label: "Enrichissement PubChem" },
  
  // Recherche scientifique
  "/recherche-scientifique": { label: "Recherche Scientifique" },
  "/synergies-moleculaires": { label: "Synergies Moléculaires" },
  "/pyrolyse-combustion": { label: "Pyrolyse & Combustion" },
  "/courbes-volatilite": { label: "Courbes de Volatilité" },
  "/degradation-terpenes": { label: "Dégradation Terpènes" },
  "/modeles-analytiques-gcms": { label: "Modèles GCMS" },
  "/synergies-terpenes-niches": { label: "Synergies Terpènes Niches" },
  "/chimie-tabac": { label: "Chimie du Tabac" },
  "/interactions-tabac-cannabis": { label: "Interactions Tabac-Cannabis" },
  "/comparaison-terpenes": { label: "Comparaison Terpènes" },
  
  // Programmes de recherche
  "/programmes-recherche": { label: "Programmes de Recherche" },
  "/tabacs-niche": { label: "Tabacs de Niche" },
  
  // Journal & Méthodologie
  "/journal": { label: "Journal" },
  "/methode-absorbe": { label: "Méthode ABSORBE" },
  "/methodologie/absorbe": { label: "Méthodologie ABSORBE" },
  "/methodologie-recherche": { label: "Méthodologie de Recherche" },
  "/generateur-formules": { label: "Générateur de Formules" },
  "/historique-formules": { label: "Historique Formules" },
  "/methodologie/echelle-absorbe": { label: "Échelle ABSORBE" },
  "/methodologie/pyrolyse": { label: "Pyrolyse" },
  "/methodologie/gcms": { label: "GC-MS" },
  
  // Études
  "/etudes": { label: "Études" },
  "/etudes-climatiques": { label: "Études Climatiques" },
  "/archives-terrain": { label: "Archives Terrain" },
  "/protocoles-moleculaires": { label: "Protocoles Moléculaires" },
  "/tests-extraction": { label: "Tests d'Extraction" },
  "/odeurs-situees": { label: "Odeurs Situées" },
  "/projets": { label: "Projets" },
  "/terrains": { label: "Terrains" },
  "/bibliographie": { label: "Bibliographie" },
  "/gestion": { label: "Gestion" },
  
  // Leaf Economies
  "/leaf-economies": { label: "Leaf Economies" },
  "/timeline-botanique": { label: "Timeline Botanique" },
  "/botanique-critique": { label: "Botanique Critique" },
  "/varietes-fantomes": { label: "Variétés Fantômes" },
  // TerpProfiles & Plants
  "/terp-profiles": { label: "TerpProfiles" },
  "/terp-profiles/compare": { label: "Comparer", parent: "/terp-profiles" },
  "/plants": { label: "Plantes" },
  "/plant-varieties": { label: "Variétés de Plantes" },
  "/chemotypes": { label: "Chémotypes" },
  "/final-recipes": { label: "Recettes Finales" },
  "/carte-varietes": { label: "Carte des Variétés" },
  "/terroirs": { label: "Terroirs" },
  "/origines-geographiques": { label: "Origines Géographiques" },
  "/extraction-methods": { label: "Méthodes d'Extraction" },
  
  // Autres
  "/collaborations": { label: "Collaborations" },
  "/archives": { label: "Archives" },
  "/glossaire": { label: "Glossaire" },
  "/glossaire-visuel-radar": { label: "Glossaire Visuel Radar" },
  "/contribuer": { label: "Contribuer" },
  "/timeline": { label: "Timeline" },
  "/projet/timeline": { label: "Timeline du Projet" },
  "/galerie-botaniques": { label: "Galerie Botaniques" },
  "/galerie-olfactive": { label: "Galerie Olfactive" },
  "/atlas": { label: "Atlas Olfactif" },
  "/storylines": { label: "Fils Narratifs" },
  "/gallery": { label: "Galerie" },
  "/batch-import": { label: "Import par Lots" },
  "/ifra": { label: "Réglementation IFRA" },
  
  // Civilisations
  "/civilisations": { label: "Civilisations" },
  "/traditions-olfactives": { label: "Traditions Olfactives" },
  "/installations": { label: "Installations" },
  
  // Tabacs
  "/tabacs-resines": { label: "Tabacs & Résines" },
  "/associations": { label: "Associations" },
  "/fournisseurs": { label: "Fournisseurs" },
  "/calculateur-cout": { label: "Calculateur de Coût" },
  
  // Dashboards
  "/dashboard": { label: "Dashboard" },
  "/dashboard-recherche": { label: "Dashboard Recherche" },
  "/analytics": { label: "Analytics" },
  "/mon-dashboard": { label: "Mon Dashboard" },
  "/statistics": { label: "Statistiques" },
  "/recherche": { label: "Recherche" },
  
  // Utilisateur
  "/favoris": { label: "Favoris" },
  "/reseau": { label: "Réseau" },
  "/reseau-molecule-plante": { label: "Réseau Molécule-Plante" },
  "/bio-mineralis": { label: "Bio Mineralis" },
  
  // Matières premières
  "/raw-materials": { label: "Matières Premières" },

  // Admin
  "/admin": { label: "Administration" },
  "/admin/molecules": { label: "Molécules", parent: "/admin" },
  "/admin/recettes": { label: "Recettes", parent: "/admin" },
  "/admin/import-export": { label: "Import/Export", parent: "/admin" },
  "/admin/import-export-plants": { label: "Import/Export Plantes", parent: "/admin" },
  "/admin/historique": { label: "Historique", parent: "/admin" },
  "/admin/references": { label: "Références", parent: "/admin" },
  "/admin/liaison-recettes-molecules": { label: "Liaison Recettes-Molécules", parent: "/admin" },
  "/admin/molecule-origins": { label: "Origines Molécules", parent: "/admin" },
  "/admin/terroirs-geocode": { label: "Géocodage Terroirs", parent: "/admin" },
  "/admin/data-quality": { label: "Qualité des données", parent: "/admin" },
  "/admin/accords": { label: "Accords", parent: "/admin" },
  "/admin/familles": { label: "Familles", parent: "/admin" },
  "/admin/matieres": { label: "Matières Premières", parent: "/admin" },
  "/admin/validation": { label: "Validation", parent: "/admin" },
  "/admin/orphan-molecules": { label: "Molécules Orphelines", parent: "/admin" },
  "/admin/ai-classification": { label: "Classification IA", parent: "/admin" },
  "/admin/ai-classification-batch": { label: "Classification IA (Batch)", parent: "/admin" },
  "/admin/niche-plant-linking": { label: "Liaison Plantes Niche", parent: "/admin" },
  "/admin/classification-review": { label: "Revue Classification", parent: "/admin" },
  "/admin/notifications": { label: "Notifications", parent: "/admin" },
  "/admin/progress-report": { label: "Rapport de Progrès", parent: "/admin" },
  "/admin/chemical-family-linking": { label: "Liaison Familles Chimiques", parent: "/admin" },
  "/admin/import-csv": { label: "Import CSV", parent: "/admin" },
  "/admin/import-csv-preview": { label: "Prévisualisation CSV", parent: "/admin" },
  "/admin/thermal-matrix": { label: "Matrice Thermique ABSORBE", parent: "/admin" },
  "/admin/extraction-methods": { label: "Méthodes d'Extraction", parent: "/admin" },

  // ── ADMIN — Enrichissement par lots (Batch) ────────────────────────────────
  "/admin/ai-batch-enrich": { label: "Enrichissement IA (Batch)", parent: "/admin" },
  "/admin/ai-batch-enrich-molecules": { label: "Enrichissement IA Molécules", parent: "/admin" },
  "/admin/chebi-batch": { label: "Batch ChEBI", parent: "/admin" },
  "/admin/coconut-batch": { label: "Batch COCONUT", parent: "/admin" },
  "/admin/gbif-batch": { label: "Batch GBIF", parent: "/admin" },
  "/admin/knapsack-batch": { label: "Batch KNApSAcK", parent: "/admin" },
  "/admin/lotus-batch": { label: "Batch LOTUS", parent: "/admin" },
  "/admin/pubchem-batch": { label: "Batch PubChem", parent: "/admin" },
  "/admin/pubchem-iupac-batch": { label: "Batch PubChem IUPAC", parent: "/admin" },
  "/admin/smiles-batch": { label: "Batch SMILES", parent: "/admin" },
  "/admin/wikidata-batch": { label: "Batch Wikidata", parent: "/admin" },
  "/admin/wikimedia-batch": { label: "Batch Wikimedia", parent: "/admin" },
  "/admin/europeana-qid-batch": { label: "Batch Europeana QID", parent: "/admin" },

  // ── ADMIN — Gestion des données ────────────────────────────────────────────
  "/admin/bundle-visualizer": { label: "Visualiseur de Bundles", parent: "/admin" },
  "/admin/completude": { label: "Complétude des Données", parent: "/admin" },
  "/admin/contributions": { label: "Contributions", parent: "/admin" },
  "/admin/duplicates": { label: "Doublons", parent: "/admin" },
  "/admin/europeana": { label: "Europeana", parent: "/admin" },
  "/admin/europeana-map": { label: "Carte Europeana", parent: "/admin" },
  "/admin/gcms-import": { label: "Import GC-MS", parent: "/admin" },
  "/admin/liaison-cigarillos-molecules": { label: "Liaison Cigarillos-Molécules", parent: "/admin" },
  "/admin/molecule-manager": { label: "Gestionnaire Molécules", parent: "/admin" },
  "/admin/molecules/new": { label: "Nouvelle Molécule", parent: "/admin/molecules" },
  "/admin/nose": { label: "Nez (Nose)", parent: "/admin" },
  "/admin/plant-molecules": { label: "Plantes-Molécules", parent: "/admin" },
  "/admin/reclassify-molecules": { label: "Reclassification Molécules", parent: "/admin" },
  "/admin/sparql-explorer": { label: "Explorateur SPARQL", parent: "/admin" },
  "/admin/storylines": { label: "Storylines", parent: "/admin" },
  "/admin/synergies": { label: "Synergies (Admin)", parent: "/admin" },

  // ── LIAISON TECHNIQUES (hors /admin) ──────────────────────────────────────────
  "/molecule-recette-audit": { label: "Audit Molécule-Recette", parent: "/admin" },
  "/molecule-recette-dragdrop": { label: "Liaison Molécule-Recette (Drag & Drop)", parent: "/admin" },
  "/molecule-recette-import-csv": { label: "Import CSV Molécule-Recette", parent: "/admin" },
  "/molecule-recette-linking": { label: "Liaison Molécule-Recette", parent: "/admin" },
  "/plant-molecule-audit": { label: "Audit Plante-Molécule", parent: "/admin" },
  "/plant-molecule-linking": { label: "Liaison Plante-Molécule", parent: "/admin" },
  "/plant-terroir-audit": { label: "Audit Plante-Terroir", parent: "/admin" },
  "/plant-terroir-dragdrop": { label: "Liaison Plante-Terroir (Drag & Drop)", parent: "/admin" },
  "/plant-terroir-import-csv": { label: "Import CSV Plante-Terroir", parent: "/admin" },
  "/plant-terroir-linking": { label: "Liaison Plante-Terroir", parent: "/admin" },
  "/galerie/import": { label: "Import Galerie", parent: "/galerie" },

  // ── ABSORBE-X ────────────────────────────────────────────────────────────
  "/absorbe-x": { label: "ABSORBE-X" },
  "/absorbe-scale": { label: "Échelle ABSORBE", parent: "/absorbe-x" },
  "/absorbe-x/guide-laboratoire": { label: "Guide Laboratoire", parent: "/absorbe-x" },
  "/absorbe-x/manifeste": { label: "Manifeste", parent: "/absorbe-x" },
  "/absorbe-x/neuro-olfaction": { label: "Neuro-Olfaction", parent: "/absorbe-x" },
  "/absorbe-x/notes-recherche": { label: "Notes de Recherche", parent: "/absorbe-x" },
  "/absorbe-x/odeurs-perdues": { label: "Odeurs Perdues", parent: "/absorbe-x" },
  "/absorbe-x/patrimoine": { label: "Patrimoine", parent: "/absorbe-x" },
  "/absorbe-x/quantique": { label: "Quantique", parent: "/absorbe-x" },

  // ── RECHERCHE SCIENTIFIQUE (sous-pages) ──────────────────────────────────
  "/recherche-scientifique/courbes-volatilite": { label: "Courbes de Volatilité", parent: "/recherche-scientifique" },
  "/recherche-scientifique/degradation-terpenes": { label: "Dégradation Terpènes", parent: "/recherche-scientifique" },
  "/recherche-scientifique/donnees": { label: "Données Scientifiques", parent: "/recherche-scientifique" },
  "/recherche-scientifique/modeles-analytiques-gcms": { label: "Modèles GC-MS", parent: "/recherche-scientifique" },
  "/recherche-scientifique/pyrolyse-combustion": { label: "Pyrolyse & Combustion", parent: "/recherche-scientifique" },
  "/recherche-scientifique/synergies-moleculaires": { label: "Synergies Moléculaires", parent: "/recherche-scientifique" },
  "/recherche/fondements-theoriques": { label: "Fondements Théoriques", parent: "/recherche-scientifique" },

  // ── MÉTHODOLOGIE (sous-pages) ────────────────────────────────────────────
  "/methode": { label: "Méthode", parent: "/methode-absorbe" },
  "/methodes-analytiques": { label: "Méthodes Analytiques", parent: "/recherche-scientifique" },
  "/methodes-extraction": { label: "Méthodes d'Extraction", parent: "/recherche-scientifique" },
  "/methodologie/gc-ms": { label: "GC-MS", parent: "/methode-absorbe" },
  "/methodologie/recherche": { label: "Méthodologie de Recherche", parent: "/methode-absorbe" },

  // ── PROGRAMMES DE RECHERCHE (sous-pages) ─────────────────────────────────
  "/programmes-recherche/resines-cbd": { label: "Résines CBD", parent: "/programmes-recherche" },
  "/programmes-recherche/tabacs-niche": { label: "Tabacs de Niche", parent: "/programmes-recherche" },
  "/axes-recherche": { label: "Axes de Recherche", parent: "/programmes-recherche" },
  "/axes-thematiques": { label: "Axes Thématiques", parent: "/programmes-recherche" },
  "/research-data": { label: "Données de Recherche", parent: "/recherche-scientifique" },
  "/research-graph": { label: "Graphe de Recherche", parent: "/recherche-scientifique" },
  "/claims-and-proofs": { label: "Claims & Preuves", parent: "/recherche-scientifique" },
  "/coverage-goal": { label: "Objectifs de Couverture", parent: "/recherche-scientifique" },

  // ── VISUALISATIONS & GRAPHES ──────────────────────────────────────────────
  "/visualisations": { label: "Visualisations" },
  "/graphe-synergies": { label: "Graphe Synergies", parent: "/synergies" },
  "/graphe-molecules-familles-chimiques": { label: "Graphe Molécules-Familles", parent: "/familles-chimiques" },
  "/graphe-familles-chimiques": { label: "Graphe Familles Chimiques", parent: "/familles-chimiques" },
  "/graphe-plante-molecule": { label: "Graphe Plante-Molécule", parent: "/plants" },
  "/graphe-publications-molecules": { label: "Graphe Publications-Molécules", parent: "/bibliographie" },
  "/graphe-references-axes": { label: "Graphe Références-Axes", parent: "/bibliographie" },
  "/graphe-relations": { label: "Graphe Relations", parent: "/visualisations" },
  "/graphe-terroir-plante-molecule": { label: "Graphe Terroir-Plante-Molécule", parent: "/terroirs" },
  "/graphe-axes-thematiques": { label: "Graphe Axes Thématiques", parent: "/axes-thematiques" },
  "/hub-analyse": { label: "Hub d'Analyse", parent: "/visualisations" },
  "/analysis-hub": { label: "Hub d'Analyse", parent: "/visualisations" },
  "/vue-connexions": { label: "Vue Connexions", parent: "/visualisations" },
  "/reseau-axes": { label: "Réseau Axes", parent: "/axes-recherche" },
  "/reseau-liaisons": { label: "Réseau Liaisons", parent: "/visualisations" },
  "/reseau-liaisons-references": { label: "Réseau Liaisons-Références", parent: "/bibliographie" },
  "/reseau-molecules-plantes": { label: "Réseau Molécules-Plantes", parent: "/molecules" },
  "/reseau-plantes-molecules": { label: "Réseau Plantes-Molécules", parent: "/plants" },
  "/reseau-plantes-terroirs": { label: "Réseau Plantes-Terroirs", parent: "/terroirs" },

  // ── SPECTRES & CHROMATOGRAPHIE ────────────────────────────────────────────
  "/gcms-hub": { label: "Hub GC-MS", parent: "/recherche-scientifique" },
  "/gcms-chromatograms": { label: "Chromatogrammes GC-MS", parent: "/gcms-hub" },
  "/chromatogrammes-gcms": { label: "Chromatogrammes GC-MS", parent: "/gcms-hub" },
  "/chromatograms": { label: "Chromatogrammes", parent: "/gcms-hub" },
  "/ms-spectra": { label: "Spectres MS", parent: "/gcms-hub" },
  "/spectres-masse": { label: "Spectres de Masse", parent: "/gcms-hub" },
  "/mass-spectrometry": { label: "Spectrométrie de Masse", parent: "/gcms-hub" },
  "/spectra-comparison": { label: "Comparaison Spectres", parent: "/gcms-hub" },
  "/spectra-identification": { label: "Identification Spectres", parent: "/gcms-hub" },
  "/comparaison-spectres": { label: "Comparaison Spectres", parent: "/gcms-hub" },
  "/identification-spectre": { label: "Identification Spectre", parent: "/gcms-hub" },
  "/identify-spectrum": { label: "Identifier Spectre", parent: "/gcms-hub" },
  "/smiles": { label: "Structures SMILES", parent: "/molecules" },
  "/structures": { label: "Structures Moléculaires", parent: "/molecules" },
  "/search-compound": { label: "Recherche Composé", parent: "/molecules" },
  "/compound-search": { label: "Recherche Composé", parent: "/molecules" },
  "/analytical-methods": { label: "Méthodes Analytiques", parent: "/recherche-scientifique" },

  // ── TABAC & CANNABIS ──────────────────────────────────────────────────────
  "/tabacotheque": { label: "Tabacothèque" },
  "/tabacs-naturels": { label: "Tabacs Naturels", parent: "/tabacotheque" },
  "/tabacs-originaux": { label: "Tabacs Originaux", parent: "/tabacotheque" },
  "/tobacco-landraces": { label: "Landraces Tabac", parent: "/tabacotheque" },
  "/cannabis-landraces": { label: "Landraces Cannabis", parent: "/leaf-economies" },
  "/landraces": { label: "Landraces", parent: "/leaf-economies" },
  "/comparateur-landraces": { label: "Comparateur Landraces", parent: "/landraces" },
  "/compare-landraces": { label: "Comparer Landraces", parent: "/landraces" },
  "/landrace-comparator": { label: "Comparateur Landraces", parent: "/landraces" },
  "/perique": { label: "Périque", parent: "/tabacotheque" },
  "/perique-compounds": { label: "Composés Périque", parent: "/perique" },
  "/perique-fermentation": { label: "Fermentation Périque", parent: "/perique" },
  "/fermentation-perique": { label: "Fermentation Périque", parent: "/perique" },
  "/historic-cigarettes": { label: "Cigarettes Historiques", parent: "/tabacotheque" },
  "/cigarillo-recipes": { label: "Recettes Cigarillos", parent: "/recettes" },
  "/recettes-cigarillos": { label: "Recettes Cigarillos", parent: "/recettes" },
  "/sourcing/cannabis": { label: "Sourcing Cannabis", parent: "/sourcing" },
  "/sourcing/tabac": { label: "Sourcing Tabac", parent: "/sourcing" },
  "/sourcing-hub": { label: "Hub Sourcing", parent: "/sourcing" },

  // ── SAN ANDRES ────────────────────────────────────────────────────────────
  "/san-andres": { label: "San Andrés", parent: "/leaf-economies" },
  "/san-andres/leaf-economies": { label: "Leaf Economies", parent: "/san-andres" },

  // ── PLANTES & VARIÉTÉS ──────────────────────────────────────────────────
  "/plantes": { label: "Plantes", parent: "/plants" },
  "/plantes-varietes": { label: "Variétés de Plantes", parent: "/plant-varieties" },
  "/plants/by-molecule": { label: "Plantes par Molécule", parent: "/plants" },
  "/varietes": { label: "Variétés", parent: "/plant-varieties" },
  "/genealogy": { label: "Généalogie", parent: "/plant-varieties" },
  "/arbre-genealogique": { label: "Arbre Généalogique", parent: "/genealogy" },
  "/ghost-varieties-explorer": { label: "Variétés Fantômes", parent: "/varietes-fantomes" },
  "/genomics-explorer": { label: "Explorateur Génomique", parent: "/plant-varieties" },
  "/phylogenetic": { label: "Phylogénétique", parent: "/plant-varieties" },
  "/phylogenetique": { label: "Phylogénétique", parent: "/plant-varieties" },
  "/tps-genes": { label: "Gènes TPS", parent: "/recherche-scientifique" },
  "/tps-pathways": { label: "Voies TPS", parent: "/recherche-scientifique" },
  "/biosynthetic-pathways": { label: "Voies Biosynthetiques", parent: "/recherche-scientifique" },
  "/voies-biosynthetiques": { label: "Voies Biosynthetiques", parent: "/recherche-scientifique" },
  "/profils-terpeniques": { label: "Profils Terpéniques", parent: "/terpenes" },
  "/terpene-profiles": { label: "Profils Terpéniques", parent: "/terpenes" },
  "/chemical-families": { label: "Familles Chimiques", parent: "/familles-chimiques" },
  "/molecules-hub": { label: "Hub Molécules", parent: "/molecules" },
  "/molecules-disparues": { label: "Molécules Disparues", parent: "/molecules" },
  "/muscs": { label: "Muscs", parent: "/molecules" },
  "/molecular-transformations": { label: "Transformations Moléculaires", parent: "/recherche-scientifique" },
  "/transformations-pyrolytiques": { label: "Transformations Pyrolytiques", parent: "/pyrolyse-combustion" },
  "/pyrolyse": { label: "Pyrolyse", parent: "/recherche-scientifique" },
  "/pyrolysis": { label: "Pyrolyse", parent: "/recherche-scientifique" },

  // ── TERROIRS & CARTOGRAPHIE ───────────────────────────────────────────────
  "/carte-terroirs": { label: "Carte Terroirs", parent: "/terroirs" },
  "/carte-terroirs-plantes": { label: "Carte Terroirs-Plantes", parent: "/terroirs" },
  "/carte-terroirs-recherche": { label: "Carte Terroirs Recherche", parent: "/terroirs" },
  "/carte-interactive-terroirs": { label: "Carte Interactive", parent: "/terroirs" },
  "/carte-plantes-gps": { label: "Carte GPS Plantes", parent: "/plants" },
  "/europeana-map": { label: "Carte Europeana", parent: "/terroirs" },
  "/soil-analysis": { label: "Analyse des Sols", parent: "/terroirs" },
  "/analyses-pedologiques": { label: "Analyses Pédologiques", parent: "/terroirs" },

  // ── COMPARAISON & OUTILS ──────────────────────────────────────────────────
  "/comparaison": { label: "Comparaison", parent: "/compare" },
  "/comparaison-extractions": { label: "Comparaison Extractions", parent: "/compare" },
  "/comparaison-molecules": { label: "Comparaison Molécules", parent: "/compare" },
  "/comparaison-plantes": { label: "Comparaison Plantes", parent: "/compare" },
  "/compare-spectra": { label: "Comparaison Spectres", parent: "/gcms-hub" },
  "/outil-formulation": { label: "Outil Formulation", parent: "/outils" },
  "/outils-hub": { label: "Hub Outils", parent: "/outils" },
  "/outils/carte-origines": { label: "Carte des Origines", parent: "/outils" },
  "/outils/enrichissement-pubchem": { label: "Enrichissement PubChem", parent: "/outils" },
  "/outils/export-bibliographique": { label: "Export Bibliographique", parent: "/outils" },
  "/outils/generateur-formules": { label: "Générateur de Formules", parent: "/outils" },
  "/outils/visualisations-correlation": { label: "Visualisations Corrélation", parent: "/outils" },
  "/formules-reference": { label: "Formules de Référence", parent: "/outils" },
  "/recherche-compose": { label: "Recherche Composé", parent: "/recherche-avancee" },
  "/recherche-croisee": { label: "Recherche Croisée", parent: "/recherche-avancee" },
  "/recherche-molecule": { label: "Recherche Molécule", parent: "/molecules" },
  "/recherche-percepts": { label: "Recherche Percepts", parent: "/recherche-avancee" },
  "/recherche-profil-moleculaire": { label: "Profil Moléculaire", parent: "/recherche-avancee" },

  // ── BIBLIOGRAPHIE & RÉFÉRENCES ────────────────────────────────────────────
  "/bibliographie-globale": { label: "Bibliographie Globale", parent: "/bibliographie" },
  "/bibliographie-hub": { label: "Hub Bibliographie", parent: "/bibliographie" },
  "/bulk-import-references": { label: "Import Références", parent: "/bibliographie" },
  "/csv-validation-import": { label: "Import CSV", parent: "/bibliographie" },

  // ── INVENTAIRE & STOCKS ───────────────────────────────────────────────────
  "/inventory": { label: "Inventaire", parent: "/inventaire" },
  "/inventory-dashboard": { label: "Dashboard Inventaire", parent: "/inventaire" },
  "/tableau-inventaire": { label: "Tableau Inventaire", parent: "/inventaire" },
  "/stock-dashboard": { label: "Dashboard Stocks", parent: "/inventaire" },
  "/matieres-premieres": { label: "Matières Premières", parent: "/raw-materials" },
  "/matieres-premieres-rares": { label: "Matières Rares", parent: "/raw-materials" },
  "/aromatic-rarities": { label: "Rarités Aromatiques", parent: "/gammes/raretes" },
  "/he-absolue-co2": { label: "HE, Absolues & CO2", parent: "/raw-materials" },

  // ── RECETTES & FORMULATION ────────────────────────────────────────────────
  "/recettes-finales": { label: "Recettes Finales", parent: "/recettes" },
  "/recettes-tl": { label: "Recettes TL", parent: "/recettes" },
  "/experimental-accords": { label: "Accords Expérimentaux", parent: "/accords" },
  "/accords-legacy": { label: "Accords (Archive)", parent: "/accords" },
  "/parcours-olfactif": { label: "Parcours Olfactif", parent: "/recettes" },
  "/parfums": { label: "Parfums", parent: "/recettes" },
  "/explorer-par-odeur": { label: "Explorer par Odeur", parent: "/recettes" },
  "/percepts": { label: "Percepts", parent: "/recherche-scientifique" },

  // ── PATRIMOINE & CONSERVATION ─────────────────────────────────────────────
  "/heritage-conservation": { label: "Conservation du Patrimoine", parent: "/civilisations" },
  "/conservation": { label: "Conservation", parent: "/civilisations" },
  "/patrimoine-menace": { label: "Patrimoine Menacé", parent: "/civilisations" },
  "/archives-olfactives": { label: "Archives Olfactives", parent: "/archives" },
  "/osmotheque": { label: "Osmothèque", parent: "/archives" },
  "/alternatives-durables": { label: "Alternatives Durables", parent: "/recherche-scientifique" },

  // ── STATISTIQUES & ANALYTICS ──────────────────────────────────────────────
  "/statistiques": { label: "Statistiques", parent: "/dashboard" },
  "/stats-olfactives": { label: "Stats Olfactives", parent: "/dashboard" },
  "/analytics/advanced": { label: "Analytics Avancé", parent: "/analytics" },
  "/dashboard/recherche": { label: "Dashboard Recherche", parent: "/dashboard" },
  "/mes-favoris": { label: "Mes Favoris", parent: "/favoris" },
  "/linking-dashboard": { label: "Dashboard Liaisons", parent: "/admin" },
  "/h2-linking": { label: "Liaison H2", parent: "/admin" },
  "/h3-linking": { label: "Liaison H3", parent: "/admin" },
  "/enrichissement": { label: "Enrichissement", parent: "/admin" },
  "/enrichment": { label: "Enrichissement", parent: "/admin" },

  // ── TIMELINES ────────────────────────────────────────────────────────────
  "/timeline/interactive": { label: "Timeline Interactive", parent: "/timeline" },

  // ── AUTRES ───────────────────────────────────────────────────────────────
  "/galerie": { label: "Galerie", parent: "/galerie-botaniques" },
  "/gammes-hub": { label: "Hub Gammes", parent: "/gammes" },
  "/reglementation-ifra": { label: "Réglementation IFRA", parent: "/ifra" },
  "/conformite-ifra": { label: "Conformité IFRA", parent: "/ifra" },
  "/contributor": { label: "Contribuer", parent: "/contribuer" },
  "/molecule-plant-relations": { label: "Relations Molécule-Plante", parent: "/plants" },
  "/relations-molecule-plante": { label: "Relations Molécule-Plante", parent: "/plants" },
  "/familles/list": { label: "Liste des Familles", parent: "/familles" },
};

// Patterns dynamiques pour les pages de détail
const dynamicRoutePatterns: Array<{
  pattern: RegExp;
  getLabel: (match: RegExpMatchArray) => string;
  parent: string;
}> = [
  { pattern: /^\/molecule\/(\d+)$/, getLabel: () => "Détail Molécule", parent: "/molecules" },
  { pattern: /^\/terpene\/(\d+)$/, getLabel: (m) => getTerpeneNameFromId(m[1]), parent: "/terpenes" },
  { pattern: /^\/recette\/(\d+)$/, getLabel: () => "Détail Recette", parent: "/recettes" },
  { pattern: /^\/recette\/colombie\/(\d+)$/, getLabel: () => "Recette Colombie", parent: "/colombie" },
  { pattern: /^\/recette-cbd\/(\d+)$/, getLabel: () => "Recette CBD", parent: "/resines-cbd" },
  { pattern: /^\/plant\/(\d+)$/, getLabel: () => "Détail Plante", parent: "/plants" },
  { pattern: /^\/plants\/(\d+)$/, getLabel: () => "Détail Plante", parent: "/plants" },
  { pattern: /^\/variety\/(\d+)$/, getLabel: () => "Détail Variété", parent: "/plant-varieties" },
  { pattern: /^\/civilisation\/(\d+)$/, getLabel: () => "Détail Civilisation", parent: "/civilisations" },
  { pattern: /^\/prototypes\/([a-z0-9-]+)$/, getLabel: (m) => `Prototype ${m[1].toUpperCase()}`, parent: "/prototypes" },
  { pattern: /^\/terp-profiles\/(\d+)$/, getLabel: () => "Détail TerpProfile", parent: "/terp-profiles" },
  { pattern: /^\/final-recipes\/(\d+)$/, getLabel: () => "Détail Recette Finale", parent: "/final-recipes" },
  { pattern: /^\/leaf-economy\/(\d+)$/, getLabel: () => "Détail Leaf Economy", parent: "/leaf-economies" },
  { pattern: /^\/etude-climatique\/(\d+)$/, getLabel: () => "Étude Climatique", parent: "/etudes-climatiques" },
  { pattern: /^\/archive-terrain\/(\d+)$/, getLabel: () => "Archive Terrain", parent: "/archives-terrain" },
  { pattern: /^\/protocole-moleculaire\/(\d+)$/, getLabel: () => "Protocole Moléculaire", parent: "/protocoles-moleculaires" },
  { pattern: /^\/test-extraction\/(\d+)$/, getLabel: () => "Test d'Extraction", parent: "/tests-extraction" },
  { pattern: /^\/odeur-situee\/(\d+)$/, getLabel: () => "Odeur Située", parent: "/odeurs-situees" },
  { pattern: /^\/raw-material\/(\d+)$/, getLabel: () => "Matière Première", parent: "/raw-materials" },
];

// Helper pour obtenir le nom du terpène depuis l'ID
function getTerpeneNameFromId(id: string): string {
  const terpenes: Record<string, string> = {
    "1": "Myrcène",
    "2": "Limonène",
    "3": "β-Pinène",
    "4": "β-Caryophyllène",
    "5": "Linalool",
    "6": "α-Pinène",
    "7": "Humulène",
    "8": "Terpinolène",
    "9": "Ocimène",
    "10": "Géraniol",
  };
  return terpenes[id] || `Terpène #${id}`;
}

// Construire la chaîne de breadcrumb depuis un path
function buildBreadcrumbChain(path: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [];
  
  if (path === "/") return segments;
  
  // Vérifier d'abord les routes statiques
  const staticConfig = routeConfig[path];
  if (staticConfig) {
    // Construire la chaîne des parents
    const chain: BreadcrumbSegment[] = [];
    let currentPath = path;
    
    while (currentPath && currentPath !== "/") {
      const config = routeConfig[currentPath];
      if (config) {
        chain.unshift({ label: config.label, path: currentPath });
        currentPath = config.parent || "";
      } else {
        break;
      }
    }
    
    return chain;
  }
  
  // Vérifier les routes dynamiques
  for (const { pattern, getLabel, parent } of dynamicRoutePatterns) {
    const match = path.match(pattern);
    if (match) {
      // Ajouter la chaîne des parents
      const parentConfig = routeConfig[parent];
      if (parentConfig) {
        let currentPath = parent;
        const parentChain: BreadcrumbSegment[] = [];
        
        while (currentPath && currentPath !== "/") {
          const config = routeConfig[currentPath];
          if (config) {
            parentChain.unshift({ label: config.label, path: currentPath });
            currentPath = config.parent || "";
          } else {
            break;
          }
        }
        
        segments.push(...parentChain);
      }
      
      // Ajouter la page actuelle
      segments.push({ label: getLabel(match), path });
      return segments;
    }
  }
  
  // Fallback: construire depuis les segments du path
  const parts = path.split("/").filter(Boolean);
  let currentPath = "";
  
  for (const part of parts) {
    currentPath += `/${part}`;
    const config = routeConfig[currentPath];
    if (config) {
      segments.push({ label: config.label, path: currentPath });
    } else {
      const label = part
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      segments.push({ label, path: currentPath });
    }
  }
  
  return segments;
}

// ─── Scroll Progress Indicator ──────────────────────────────────────────────
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (progress <= 1) return null;
  return (
    <motion.div
      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-violet-500 via-emerald-400 to-amber-400 origin-left pointer-events-none"
      style={{ width: `${progress}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    />
  );
}

export function DynamicBreadcrumb({ segments, className = "" }: DynamicBreadcrumbProps) {
  const [location] = useLocation();

  // Si segments n'est pas fourni, générer automatiquement depuis l'URL
  const breadcrumbSegments = segments || buildBreadcrumbChain(location);

  // Ne pas afficher sur la page d'accueil
  if (location === "/" && !segments) {
    return null;
  }

  // Ne pas afficher si vide
  if (breadcrumbSegments.length === 0) {
    return null;
  }

  return (
    <nav className={`relative flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto scrollbar-hide ${className}`}>
      {/* Barre de progression de lecture */}
      <ScrollProgressBar />

      {/* Home */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-shrink-0"
      >
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Accueil</span>
        </Link>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {breadcrumbSegments.map((segment, index) => {
          const isLast = index === breadcrumbSegments.length - 1;

          return (
            <motion.div
              key={`${location}-${segment.path}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.25, delay: index * 0.05, ease: "easeOut" }}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-muted-foreground/50" />
              
              {segment.dropdown && segment.dropdown.length > 0 ? (
                // Segment avec dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:text-foreground transition-colors font-medium">
                    {segment.label}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {segment.dropdown.map((item) => (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link href={item.path} className="w-full cursor-pointer">
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : isLast ? (
                // Dernier segment (actuel, non cliquable) — accent visuel
                <span className="font-semibold text-foreground">{segment.label}</span>
              ) : (
                // Segment intermédiaire cliquable
                <Link
                  href={segment.path}
                  className="hover:text-foreground transition-colors font-medium hover:underline underline-offset-2"
                >
                  {segment.label}
                </Link>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </nav>
  );
}

export default DynamicBreadcrumb;
