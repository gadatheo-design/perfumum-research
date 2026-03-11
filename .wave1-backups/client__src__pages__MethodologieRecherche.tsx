// @ts-nocheck
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Microscope, FlaskConical, FileText, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";

export function MethodologieRecherche() {
  return (
    <div className="min-h-screen bg-background">
      <Breadcrumbs />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Méthodologie de Recherche</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Protocoles scientifiques, validation des profils radar et documentation terrain pour garantir la rigueur et la reproductibilité des données PERFUMUM
          </p>
        </div>

        {/* Section 1: Protocoles GC-MS */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <FlaskConical className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Protocoles GC-MS</h2>
          </div>
          
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> Préparation des échantillons
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Extraction :</strong> Hydrodistillation (2h, 100°C) ou CO₂ supercritique (300 bar, 40°C) selon la matière première</p>
                <p><strong>Dilution :</strong> 1:100 dans éthanol absolu (HPLC grade) pour éviter la saturation du détecteur</p>
                <p><strong>Filtration :</strong> Seringue 0.45 μm PTFE pour éliminer les particules</p>
                <p><strong>Volume d'injection :</strong> 1 μL en mode splitless (60s) puis split 1:50</p>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> Paramètres instrumentaux
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">Colonne</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• DB-5MS (30m × 0.25mm × 0.25μm)</li>
                    <li>• Phase apolaire (5% phényl-polysiloxane)</li>
                    <li>• Gaz vecteur : Hélium (1 mL/min constant)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Programme de température</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 60°C (2 min) → 10°C/min → 280°C (5 min)</li>
                    <li>• Durée totale : 29 minutes</li>
                    <li>• Température injecteur : 250°C</li>
                    <li>• Température détecteur MS : 280°C</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Détection MS</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ionisation : Impact électronique (70 eV)</li>
                    <li>• Mode scan : m/z 35-550</li>
                    <li>• Vitesse : 3 scans/seconde</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Standards internes</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• n-Alcanes C8-C20 (Kovats Index)</li>
                    <li>• Concentration : 50 ppm chacun</li>
                    <li>• Identification : NIST, Adams 2007</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> Interprétation des chromatogrammes
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Identification des pics</p>
                    <p className="text-sm text-muted-foreground">Comparaison des spectres de masse avec bibliothèques NIST/Wiley (match &gt;85%) et indices de Kovats (±10 unités)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Quantification relative</p>
                    <p className="text-sm text-muted-foreground">Intégration des aires de pics (% aire normalisée) avec correction des facteurs de réponse FID</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Validation</p>
                    <p className="text-sm text-muted-foreground">Triplicata pour chaque échantillon (CV &lt;5%), injection de blancs entre échantillons</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Validation Profils Radar */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Microscope className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Validation des Profils Radar</h2>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Critères de validation</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold mb-1">Cohérence chimique</p>
                  <p className="text-sm text-muted-foreground">Les valeurs radar doivent correspondre aux propriétés moléculaires (volatilité, groupes fonctionnels, poids moléculaire)</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold mb-1">Reproductibilité sensorielle</p>
                  <p className="text-sm text-muted-foreground">Panel de 3 évaluateurs minimum, accord inter-juges &gt;75% (coefficient de corrélation intraclasse ICC &gt;0.75)</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold mb-1">Cohérence avec la littérature</p>
                  <p className="text-sm text-muted-foreground">Comparaison avec profils publiés (Arctander, Steffen Arctander's Perfume and Flavor Materials, 1969)</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Processus de validation</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <p className="font-semibold mb-2">Évaluation sensorielle</p>
                  <p className="text-sm text-muted-foreground">3 évaluateurs notent chaque axe (0-100) à l'aveugle</p>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <p className="font-semibold mb-2">Analyse statistique</p>
                  <p className="text-sm text-muted-foreground">Calcul moyenne, écart-type, ICC pour chaque axe</p>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <p className="font-semibold mb-2">Validation finale</p>
                  <p className="text-sm text-muted-foreground">Profil accepté si ICC &gt;0.75 et cohérence chimique</p>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-amber-500/5 border-amber-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-2">Exemple de validation : Géosmine</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• <strong>Intensité :</strong> 95 ± 3 (ICC=0.92) - Molécule très puissante (seuil 0.1 ppb)</p>
                    <p>• <strong>Terreux :</strong> 98 ± 2 (ICC=0.95) - Cohérent avec structure bicyclique</p>
                    <p>• <strong>Fraîcheur :</strong> 45 ± 8 (ICC=0.78) - Accord inter-juges acceptable</p>
                    <p className="mt-2 font-semibold text-green-600">✓ Profil validé (3/3 critères remplis)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Documentation Terrain */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Documentation Terrain</h2>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Équipement de captation</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold mb-3">Matériel de prélèvement</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Tubes Tenax TA (150 mg, 60-80 mesh) pour piégeage des volatils</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Pompe de prélèvement portable (100-200 mL/min, 2h)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Flacons en verre ambré (20 mL) avec bouchons PTFE</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Thermomètre/hygromètre (±0.1°C, ±1% HR)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-3">Documentation photographique</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Appareil photo (RAW, 24 Mpx minimum)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>GPS pour géolocalisation précise (±5m)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Carnet de terrain étanche (notes manuscrites)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Enregistreur vocal pour observations immédiates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Conditions de prélèvement</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="font-semibold mb-2">Paramètres météorologiques</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Température</p>
                      <p className="font-mono">15-25°C optimal</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Humidité</p>
                      <p className="font-mono">40-70% HR</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vent</p>
                      <p className="font-mono">&lt;5 km/h</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Précipitations</p>
                      <p className="font-mono">Éviter pluie</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="font-semibold mb-2">Timing optimal</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• <strong>Pétrichor :</strong> 15-30 min après première pluie (pic d'émission)</p>
                    <p>• <strong>Floraux :</strong> Tôt le matin (6-9h) ou fin d'après-midi (17-19h)</p>
                    <p>• <strong>Résines :</strong> Après-midi chaud (14-16h, température élevée)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Observations sensorielles</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground">Chaque captation terrain doit être accompagnée d'une description sensorielle structurée :</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-border rounded-lg p-4">
                    <p className="font-semibold mb-2">Descripteurs primaires</p>
                    <p className="text-sm text-muted-foreground">3-5 mots-clés décrivant l'odeur dominante (ex: terre humide, ozone, végétal)</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <p className="font-semibold mb-2">Intensité perçue</p>
                    <p className="text-sm text-muted-foreground">Échelle 0-10 (0=imperceptible, 10=très puissant)</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <p className="font-semibold mb-2">Évolution temporelle</p>
                    <p className="text-sm text-muted-foreground">Notes de tête (0-5 min), cœur (5-30 min), fond (&gt;30 min)</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <p className="font-semibold mb-2">Contexte émotionnel</p>
                    <p className="text-sm text-muted-foreground">Résonance subjective (apaisante, stimulante, nostalgique...)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Références */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Références Méthodologiques</h2>
          </div>

          <div className="card p-6">
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <strong>ISO 16000-6:2021</strong> - Air intérieur — Partie 6 : Dosage des composés organiques volatils dans l'air intérieur et dans l'air des enceintes d'essai par échantillonnage actif sur le sorbant Tenax TA
              </p>
              <p className="text-muted-foreground">
                <strong>ASTM E679-19</strong> - Standard Practice for Determination of Odor and Taste Thresholds By a Forced-Choice Ascending Concentration Series Method of Limits
              </p>
              <p className="text-muted-foreground">
                <strong>Adams, R.P. (2007)</strong> - Identification of Essential Oil Components by Gas Chromatography/Mass Spectrometry, 4th Edition. Allured Publishing Corporation
              </p>
              <p className="text-muted-foreground">
                <strong>Arctander, S. (1969)</strong> - Perfume and Flavor Materials of Natural Origin. Allured Publishing Corporation
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="card p-8 text-center bg-primary/5 border-primary/20">
          <h3 className="text-2xl font-bold mb-4">Contribuer à la méthodologie</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Ces protocoles sont en constante évolution. Si vous avez des suggestions d'amélioration ou des retours d'expérience, n'hésitez pas à nous contacter.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/contribuer" className="btn btn-primary">
              Comment contribuer
            </a>
            <a href="/methodologie/absorbe" className="btn btn-outline">
              Méthode ABSORBE
            </a>
            <a href="/methodologie/gc-ms" className="btn btn-outline">
              Protocoles GC-MS détaillés
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
