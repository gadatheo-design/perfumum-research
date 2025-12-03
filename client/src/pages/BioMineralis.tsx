import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function BioMineralis() {
  const { data: accords, isLoading } = trpc.accords.list.useQuery();

  // Filter BIO-MINERALIS accords (the 6 revolutionary ones)
  const bioMineralisAccords = accords?.filter(accord => 
    accord.name.includes("Os + Pluie") ||
    accord.name.includes("Cuir Fossilisé") ||
    accord.name.includes("Os Carbonisé") ||
    accord.name.includes("Pétrichor Anthropique") ||
    accord.name.includes("Sève/Chair/Roche") ||
    accord.name.includes("Nécro-Géo Sacré")
  ) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-24 px-4">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`
          }} />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 mb-6">
              <span className="text-sm uppercase tracking-widest font-bold">FAMILLE RÉVOLUTIONNAIRE</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 uppercase tracking-tight">
              BIO-MINERALIS
            </h1>
            
            <p className="text-2xl mb-8 leading-relaxed opacity-90">
              Fusion archéologique entre le vivant et le minéral. Six accords expérimentaux explorant la frontière entre matière organique et inorganique, vie et fossilisation.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
              <div className="border-2 border-white/30 p-4 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-1">6</div>
                <div className="text-sm uppercase tracking-wide opacity-80">Accords</div>
              </div>
              <div className="border-2 border-white/30 p-4 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-1">12</div>
                <div className="text-sm uppercase tracking-wide opacity-80">Molécules-Piliers</div>
              </div>
              <div className="border-2 border-white/30 p-4 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-1">4</div>
                <div className="text-sm uppercase tracking-wide opacity-80">Textures</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manifesto Section */}
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="border-l-4 border-black pl-8 mb-16">
            <p className="text-xl leading-relaxed mb-4">
              <strong>BIO-MINERALIS</strong> n'est pas une simple collection de molécules. C'est une <em>pensée olfactive</em> qui interroge la transformation de la matière vivante en matière minérale, la mémoire chimique du vivant dans la pierre, l'odeur de la fossilisation.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Chaque accord est une <strong>hypothèse olfactive</strong> : que sent un os mouillé par la pluie ? Comment formuler l'odeur d'un cuir pétrifié ? Quelle est la signature moléculaire de la décomposition sacrée ?
            </p>
          </div>

          <div className="bg-gray-50 border-3 border-black p-8 mb-16">
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Méthodologie</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Pyrolyse contrôlée</strong> : 180°C - 220°C pour transformer le collagène en molécules volatiles</p>
              <p><strong>Macération longue</strong> : 72h - 6 mois pour extraire les composés minéraux</p>
              <p><strong>Fusion à froid</strong> : 80°C pour préserver les molécules fragiles</p>
              <p><strong>Oxydation dirigée</strong> : 120°C pour simuler le vieillissement géologique</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accords Grid */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold uppercase tracking-tight mb-12 text-center">
            Les 6 Accords Révolutionnaires
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
            </div>
          ) : bioMineralisAccords.length === 0 ? (
            <div className="text-center py-12 border-3 border-black bg-white">
              <p className="text-xl font-bold uppercase tracking-tight mb-2">Données en cours d'import</p>
              <p className="text-gray-600">Les accords BIO-MINERALIS seront bientôt disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {bioMineralisAccords.map((accord, index) => {
                // Determine texture color
                const textureColors: Record<string, string> = {
                  "Humide": "bg-blue-600",
                  "Sec": "bg-orange-600",
                  "Résine": "bg-amber-700",
                  "Pierre": "bg-gray-700"
                };
                const bgColor = textureColors[accord.texture || ""] || "bg-gray-600";

                return (
                  <div 
                    key={accord.id}
                    className="border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden"
                  >
                    {/* Header with Roman numeral */}
                    <div className={`${bgColor} text-white p-6`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-5xl font-bold opacity-50">
                          {["I", "II", "III", "IV", "V", "VI"][index]}
                        </div>
                        {accord.texture && (
                          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs uppercase tracking-wide">
                            {accord.texture}
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold uppercase tracking-tight">
                        {accord.name}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {accord.olfactiveProfile && (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
                            Profil Olfactif
                          </h4>
                          <p className="text-base leading-relaxed italic">
                            {accord.olfactiveProfile}
                          </p>
                        </div>
                      )}

                      {accord.emotionalResonance && (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
                            Résonance Émotionnelle
                          </h4>
                          <p className="text-sm leading-relaxed text-gray-700">
                            {accord.emotionalResonance}
                          </p>
                        </div>
                      )}

                      {accord.notes && (
                        <div className="border-t-2 border-gray-200 pt-4">
                          <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
                            Protocole
                          </h4>
                          <p className="text-sm leading-relaxed text-gray-700 font-mono">
                            {accord.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 12 Molecular Pillars Section */}
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold uppercase tracking-tight mb-8">
            Les 12 Molécules-Piliers
          </h2>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            La famille BIO-MINERALIS repose sur 12 molécules fondamentales qui incarnent la fusion du vivant et du minéral :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Géosmine", formula: "C12H22O", role: "Terre humide, mémoire de la pluie" },
              { name: "Hydroxyproline pyrolysée", formula: "C5H9NO3", role: "Collagène brûlé, os blanchis" },
              { name: "Glycine pyrolysée", formula: "C2H5NO2", role: "Os carbonisé, bouillon sec" },
              { name: "Skatole", formula: "C9H9N", role: "Animalité profonde, terre sacrée" },
              { name: "Indole", formula: "C8H7N", role: "Fleur pourrie, jasmin noir" },
              { name: "IBQ (Isobutyl quinoléine)", formula: "C13H15N", role: "Cuir sombre, cuir Mossi" },
              { name: "Calcite", formula: "CaCO3", role: "Pierre froide, calcaire" },
              { name: "Ozone", formula: "O3", role: "Pluie électrique, orage" },
              { name: "Olibanum", formula: "C20H32O2", role: "Encens clair, frankincense" },
              { name: "Myrrhe noire", formula: "C15H20O", role: "Résine sombre, amère" },
              { name: "Bitume light", formula: "Complex", role: "Matière antique mésopotamienne" },
              { name: "Fossile absolute", formula: "Complex", role: "Fossile blanc, os ancien" }
            ].map((molecule, i) => (
              <div key={i} className="border-2 border-gray-300 p-4 hover:border-black transition-colors">
                <div className="font-bold text-lg mb-1">{molecule.name}</div>
                <div className="font-mono text-sm text-purple-600 mb-2">{molecule.formula}</div>
                <div className="text-sm text-gray-600">{molecule.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold uppercase tracking-tight mb-8">
              Applications & Recherches Futures
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-2 border-white/30 p-6">
                <h3 className="text-xl font-bold mb-3 uppercase">Installations</h3>
                <p className="text-sm opacity-80">
                  Diffusion spatiale dans les installations C1-C4 pour créer des atmosphères archéologiques
                </p>
              </div>
              
              <div className="border-2 border-white/30 p-6">
                <h3 className="text-xl font-bold mb-3 uppercase">Recherche</h3>
                <p className="text-sm opacity-80">
                  Étude des transformations thermiques du collagène et des protéines animales
                </p>
              </div>
              
              <div className="border-2 border-white/30 p-6">
                <h3 className="text-xl font-bold mb-3 uppercase">Rituel</h3>
                <p className="text-sm opacity-80">
                  Création de parfums cérémoniels pour rituels funéraires contemporains
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-3 border-black py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-600">
            <p>© 2025 PERFUMUM — Recherche Olfactive</p>
            <p className="mt-2">Famille BIO-MINERALIS • 6 Accords Révolutionnaires • 12 Molécules-Piliers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
