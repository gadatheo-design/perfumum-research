// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Microscope, FlaskConical, TestTube, FileText } from "lucide-react";

export default function MethodologieAbsorbe() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Méthodologie", href: "/laboratoire" },
          { label: "ABSORBE" },
        ]}
      />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Microscope className="h-10 w-10 text-purple-600" />
          <h1 className="text-4xl font-bold uppercase tracking-tight">
            Méthodologie ABSORBE
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          Protocoles scientifiques pour la captation, l'analyse et la formulation d'atmosphères olfactives
        </p>
      </div>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cadre Méthodologique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>ABSORBE</strong> (Analyse Bio-Sensorielle et Observation des Résonances Biochimiques Environnementales) 
            est une méthodologie de recherche développée par PERFUMUM pour documenter, analyser et recréer les atmosphères 
            olfactives de terrains spécifiques (forêts, villes, musées, sites archéologiques).
          </p>
          <p>
            Cette approche hybride combine <strong>analyse chimique quantitative</strong> (GC-MS, pyrolyse contrôlée) 
            et <strong>évaluation sensorielle qualitative</strong> (échelles ABSORBE, profils olfactifs) pour créer 
            des accords olfactifs fidèles aux environnements étudiés.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Objectif Principal</h4>
              <p className="text-sm text-blue-800">
                Créer une archive olfactive documentée de lieux et d'époques pour installations artistiques et recherche anthropologique
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Durée Projet</h4>
              <p className="text-sm text-green-800">
                2025-2035 (10 ans) avec collecte progressive de données terrain et formulations
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Reproductibilité</h4>
              <p className="text-sm text-purple-800">
                Protocoles standardisés permettant réplication par équipes multidisciplinaires (chimistes, artistes, anthropologues)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase 1: Captation Terrain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-green-600" />
            Phase 1 : Captation Terrain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">1.1 Sélection du Site</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Critères de sélection</strong> : Diversité olfactive, accessibilité, stabilité temporelle, pertinence culturelle/historique</li>
              <li><strong>Documentation préalable</strong> : Photographies, cartes, notes ethnographiques, conditions météorologiques</li>
              <li><strong>Autorisation</strong> : Permissions nécessaires pour prélèvements (musées, sites protégés)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">1.2 Prélèvement d'Échantillons</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold mb-2">Matériaux Solides</h5>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Terre, écorce, mousses, lichens</li>
                  <li>• Prélèvement stérile (gants, sachets hermétiques)</li>
                  <li>• Minimum 50g par échantillon</li>
                  <li>• Conservation : 4°C, analyse sous 48h</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold mb-2">Air Ambiant</h5>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Tubes Tenax TA (adsorbant polymère)</li>
                  <li>• Débit : 100 mL/min pendant 30 min</li>
                  <li>• Tripli cats par site (matin/midi/soir)</li>
                  <li>• Stockage : -20°C avant désorption thermique</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">1.3 Évaluation Sensorielle In Situ</h4>
            <p className="text-gray-700 mb-3">
              Notation immédiate sur échelle ABSORBE (8 axes, 0-10) par 2-3 évaluateurs formés :
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="outline">Animalité</Badge>
              <Badge variant="outline">Boisé</Badge>
              <Badge variant="outline">Soufré</Badge>
              <Badge variant="outline">Oxydé</Badge>
              <Badge variant="outline">Résineux</Badge>
              <Badge variant="outline">Balsamique</Badge>
              <Badge variant="outline">Épicé</Badge>
              <Badge variant="outline">Terreux</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Notes qualitatives</strong> : Descripteurs libres, comparaisons, variations temporelles, contexte émotionnel
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Phase 2: Analyse Chimique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-blue-600" />
            Phase 2 : Analyse Chimique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">2.1 GC-MS (Chromatographie en Phase Gazeuse couplée à Spectrométrie de Masse)</h4>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold mb-2">Protocole Standard</h5>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li><strong>Colonne</strong> : DB-5MS (30m × 0.25mm × 0.25μm)</li>
                  <li><strong>Programme température</strong> : 40°C (3 min) → 10°C/min → 280°C (10 min)</li>
                  <li><strong>Gaz vecteur</strong> : Hélium, 1 mL/min</li>
                  <li><strong>Détection</strong> : MS scan mode 35-400 m/z</li>
                  <li><strong>Identification</strong> : Comparaison avec bibliothèques NIST, Wiley, standards purs</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Résultat</strong> : Liste de 50-200 composés volatils avec pourcentages relatifs (aire sous courbe)
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">2.2 Pyrolyse Contrôlée (Matériaux Solides)</h4>
            <p className="text-gray-700 mb-3">
              Pour écorces, résines, bois : pyrolyse à 3 températures (120°C, 160°C, 200°C) pour simuler combustion naturelle/rituelle
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-red-50 rounded border border-red-200">
                <h5 className="font-semibold text-red-900 text-sm">120°C</h5>
                <p className="text-xs text-red-800">Terpènes légers, aldéhydes</p>
              </div>
              <div className="p-3 bg-orange-50 rounded border border-orange-200">
                <h5 className="font-semibold text-orange-900 text-sm">160°C</h5>
                <p className="text-xs text-orange-800">Phénols, lactones, pyrazines</p>
              </div>
              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                <h5 className="font-semibold text-amber-900 text-sm">200°C</h5>
                <p className="text-xs text-amber-800">Composés fumés, guaiacol, créosol</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">2.3 Quantification Molécules-Clés</h4>
            <p className="text-gray-700">
              Dosage précis (standards internes) des 10-15 molécules les plus abondantes ou olfactivement actives 
              (seuil de perception bas). Concentrations exprimées en ng/g ou ppm.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Phase 3: Formulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-purple-600" />
            Phase 3 : Formulation d'Accords
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">3.1 Sélection des Molécules</h4>
            <p className="text-gray-700 mb-3">
              À partir de l'analyse GC-MS, sélection de 8-20 molécules représentatives selon :
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Abondance relative (&gt;1% de l'échantillon)</li>
              <li>Seuil de perception olfactive bas (molécules "odorantes")</li>
              <li>Disponibilité commerciale (fournisseurs : Sigma-Aldrich, Givaudan, Firmenich)</li>
              <li>Stabilité chimique (pas de dégradation rapide)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">3.2 Dosage Initial</h4>
            <p className="text-gray-700 mb-3">
              Formulation de base (100g total) avec concentrations proportionnelles aux résultats GC-MS :
            </p>
            <div className="p-4 bg-purple-50 rounded-lg font-mono text-sm">
              <p><strong>Exemple Pétrichor Urbain :</strong></p>
              <ul className="mt-2 space-y-1">
                <li>• Géosmine : 0.0001% (1 ppm)</li>
                <li>• 2-Méthylisobornéol : 0.0002% (2 ppm)</li>
                <li>• Acide isovalérique : 0.05%</li>
                <li>• Skatole : 0.001%</li>
                <li>• Limonène : 2%</li>
                <li>• α-Pinène : 3%</li>
                <li>• Acétate de benzyle : 1%</li>
                <li>• Alcool benzylique : support jusqu'à 100g</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">3.3 Ajustement Sensoriel</h4>
            <p className="text-gray-700 mb-3">
              Itérations successives (versions v1.0, v1.1, v2.0...) avec panel de 3-5 évaluateurs :
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Test mouillette (papier buvard) : notes de tête, cœur, fond</li>
              <li>Comparaison avec notes terrain (échelle ABSORBE)</li>
              <li>Ajustement concentrations (+/- 10-50% par molécule)</li>
              <li>Ajout/retrait molécules secondaires si nécessaire</li>
              <li>Validation finale : accord stable et fidèle au terrain (&gt;80% similarité perçue)</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">3.4 Documentation</h4>
            <p className="text-gray-700">
              Chaque accord finalisé est documenté avec :
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
              <li>Formule complète (molécules + concentrations)</li>
              <li>Profil ABSORBE (8 axes)</li>
              <li>Notes de dégustation (3 évaluateurs minimum)</li>
              <li>Contexte terrain (lieu, date, conditions)</li>
              <li>Photos, enregistrements audio, vidéos</li>
              <li>Références bibliographiques (études chimiques similaires)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Validation & Reproductibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Validation et Reproductibilité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Critères de Validation</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Fidélité sensorielle</strong> : &gt;80% de similarité perçue avec terrain (panel de 5 personnes)</li>
              <li><strong>Stabilité chimique</strong> : Pas de dégradation &gt;10% après 6 mois (stockage 4°C, obscurité)</li>
              <li><strong>Reproductibilité</strong> : 3 lots indépendants donnent profils ABSORBE identiques (±1 point/axe)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Archivage</h4>
            <p className="text-gray-700">
              Toutes les données sont archivées dans la base de données PERFUMUM avec :
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
              <li>Chromatogrammes GC-MS (fichiers .CDF)</li>
              <li>Spectres de masse des molécules identifiées</li>
              <li>Fiches de dégustation (PDF scannés)</li>
              <li>Photos terrain haute résolution</li>
              <li>Métadonnées (GPS, date, température, humidité)</li>
            </ul>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Limites Méthodologiques</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Variabilité saisonnière : certains sites nécessitent prélèvements multiples (4 saisons)</li>
              <li>• Molécules non-disponibles : certains composés rares ne sont pas commercialisables (synthèse custom nécessaire)</li>
              <li>• Subjectivité sensorielle : évaluations ABSORBE dépendent de la formation et sensibilité individuelle</li>
              <li>• Coût : analyse GC-MS ~200-500 CHF/échantillon, molécules pures 50-500 CHF/g</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Références */}
      <Card>
        <CardHeader>
          <CardTitle>Références Méthodologiques</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <strong>ISO 16000-6:2011</strong> - Air intérieur : Détermination des composés organiques volatils (COV) par échantillonnage actif sur Tenax TA
            </li>
            <li>
              <strong>ASTM E679-19</strong> - Standard Practice for Determination of Odor and Taste Thresholds
            </li>
            <li>
              <strong>Adams, R.P. (2007)</strong> - Identification of Essential Oil Components by Gas Chromatography/Mass Spectrometry, 4th ed.
            </li>
            <li>
              <strong>Joulain, D. & König, W.A. (1998)</strong> - The Atlas of Spectral Data of Sesquiterpene Hydrocarbons
            </li>
            <li>
              <strong>Arctander, S. (1969)</strong> - Perfume and Flavor Materials of Natural Origin (référence historique pour profils olfactifs)
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
