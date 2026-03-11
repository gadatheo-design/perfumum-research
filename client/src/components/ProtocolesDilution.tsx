import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, AlertTriangle, Calculator, Droplets } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DilutionProtocol {
  molecule: string;
  targetConcentration: string;
  stockSolution: string;
  dilutionSteps: string[];
  finalVolume: string;
  notes: string[];
  safety: string[];
}

const protocols: DilutionProtocol[] = [
  {
    molecule: "Androstadienone",
    targetConcentration: "0.001%",
    stockSolution: "Solution mère à 1% dans éthanol absolu",
    dilutionSteps: [
      "1. Peser 100 mg d'Androstadienone pure (CAS 4075-07-4)",
      "2. Dissoudre dans 10 mL d'éthanol absolu → Solution 1% (10 mg/mL)",
      "3. Prélever 1 mL de solution 1%",
      "4. Diluer dans 99 mL d'éthanol → Solution 0.01% (100 µg/mL)",
      "5. Prélever 10 mL de solution 0.01%",
      "6. Diluer dans 90 mL de base parfum → Solution finale 0.001%"
    ],
    finalVolume: "100 mL à 0.001% (10 µg/mL)",
    notes: [
      "Facteur de dilution total: 1000x",
      "Conservation: 6 mois à 4°C, à l'abri de la lumière",
      "Effet documenté: réduction de la nervosité chez les femmes hétérosexuelles"
    ],
    safety: [
      "Manipuler sous hotte aspirante",
      "Porter gants nitrile et lunettes de protection",
      "Éviter tout contact cutané avec la solution concentrée"
    ]
  },
  {
    molecule: "Androsténone",
    targetConcentration: "0.0008%",
    stockSolution: "Solution mère à 1% dans éthanol absolu",
    dilutionSteps: [
      "1. Peser 100 mg d'Androsténone pure (CAS 18339-16-7)",
      "2. Dissoudre dans 10 mL d'éthanol absolu → Solution 1% (10 mg/mL)",
      "3. Prélever 0.8 mL de solution 1%",
      "4. Diluer dans 99.2 mL d'éthanol → Solution 0.008% (80 µg/mL)",
      "5. Prélever 10 mL de solution 0.008%",
      "6. Diluer dans 90 mL de base parfum → Solution finale 0.0008%"
    ],
    finalVolume: "100 mL à 0.0008% (8 µg/mL)",
    notes: [
      "Facteur de dilution total: 1250x",
      "Perception variable selon génotype OR7D4 (RT/RT, RT/WM, WM/WM)",
      "Seuil de détection: 0.2 ppb à 0.2 ppm selon individu"
    ],
    safety: [
      "Odeur potentiellement désagréable (urineux) pour certains génotypes",
      "Travailler dans un espace bien ventilé",
      "Tester sur un panel avant utilisation finale"
    ]
  },
  {
    molecule: "Androsténol",
    targetConcentration: "0.0003-0.0005%",
    stockSolution: "Solution mère à 0.1% dans éthanol absolu",
    dilutionSteps: [
      "1. Peser 10 mg d'Androsténol pur (CAS 1153-51-1)",
      "2. Dissoudre dans 10 mL d'éthanol absolu → Solution 0.1% (1 mg/mL)",
      "3. Pour 0.0005%: Prélever 5 mL de solution 0.1%",
      "4. Diluer dans 995 mL de base parfum → Solution finale 0.0005%",
      "5. Pour 0.0003%: Prélever 3 mL de solution 0.1%",
      "6. Diluer dans 997 mL de base parfum → Solution finale 0.0003%"
    ],
    finalVolume: "1000 mL à 0.0003-0.0005% (3-5 µg/mL)",
    notes: [
      "Facteur de dilution total: 2000-3333x",
      "Note olfactive: truffe, musc terreux, attraction",
      "Présent naturellement dans la truffe noire (Tuber melanosporum)"
    ],
    safety: [
      "Doses très faibles, manipulation standard",
      "Conserver à l'abri de l'oxydation",
      "Vérifier la pureté du lot avant utilisation"
    ]
  }
];

export function ProtocolesDilution() {
  return (
    <Card className="border-rose-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Beaker className="h-5 w-5 text-rose-600" />
          Protocoles de Dilution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Procédures standardisées pour atteindre les concentrations infinitésimales requises
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="androstadienone" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="androstadienone" className="text-xs md:text-sm">
              Androstadienone
            </TabsTrigger>
            <TabsTrigger value="androstenone" className="text-xs md:text-sm">
              Androsténone
            </TabsTrigger>
            <TabsTrigger value="androstenol" className="text-xs md:text-sm">
              Androsténol
            </TabsTrigger>
          </TabsList>

          {protocols.map((protocol, index) => (
            <TabsContent 
              key={index} 
              value={protocol.molecule.toLowerCase().replace('é', 'e').replace('ô', 'o')}
              className="space-y-6"
            >
              {/* En-tête */}
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-rose-100">
                  {protocol.molecule}
                </Badge>
                <Badge variant="outline">
                  Cible: {protocol.targetConcentration}
                </Badge>
                <Badge variant="outline">
                  {protocol.finalVolume}
                </Badge>
              </div>

              {/* Solution mère */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-4 w-4 text-rose-600" />
                  <span className="font-medium text-sm">Solution mère</span>
                </div>
                <p className="text-sm">{protocol.stockSolution}</p>
              </div>

              {/* Étapes de dilution */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-rose-600" />
                  <span className="font-medium text-sm">Étapes de dilution</span>
                </div>
                <ol className="space-y-2">
                  {protocol.dilutionSteps.map((step, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-4 border-l-2 border-rose-200">
                      {step.replace(/^\d+\.\s*/, '')}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Notes */}
              <div>
                <span className="font-medium text-sm block mb-2">Notes techniques</span>
                <ul className="space-y-1">
                  {protocol.notes.map((note, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-rose-400">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sécurité */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-sm text-amber-800">Précautions</span>
                </div>
                <ul className="space-y-1">
                  {protocol.safety.map((item, i) => (
                    <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                      <span>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Tableau récapitulatif */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-medium mb-4 text-sm">Tableau récapitulatif des dilutions</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">Molécule</th>
                  <th className="text-left py-2 px-3 font-medium">Concentration</th>
                  <th className="text-left py-2 px-3 font-medium">Facteur</th>
                  <th className="text-left py-2 px-3 font-medium">Usage</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3">Androstadienone</td>
                  <td className="py-2 px-3 font-mono text-xs">0.001%</td>
                  <td className="py-2 px-3">1000x</td>
                  <td className="py-2 px-3 text-muted-foreground">Pheromona Skin</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">Androsténone</td>
                  <td className="py-2 px-3 font-mono text-xs">0.0008%</td>
                  <td className="py-2 px-3">1250x</td>
                  <td className="py-2 px-3 text-muted-foreground">Pheromona Alpha</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">Androsténol</td>
                  <td className="py-2 px-3 font-mono text-xs">0.0003-0.0005%</td>
                  <td className="py-2 px-3">2000-3333x</td>
                  <td className="py-2 px-3 text-muted-foreground">Pheromona Truffle</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
