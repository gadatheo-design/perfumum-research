import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Search, RotateCcw, Zap, ZapOff } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Déclarer les types TypeScript pour WebSerial
declare global {
  interface Navigator {
    serial?: {
      requestPort(): Promise<SerialPort>;
    };
  }
  interface SerialPort {
    open(options: { baudRate: number }): Promise<void>;
    close(): Promise<void>;
    readable: ReadableStream<Uint8Array> | null;
  }
  interface Window {
    p5SketchData?: {
      zoomLevel: number;
      panX: number;
    };
  }
}

/**
 * VisualisationGCMS — Chromatogramme GC-MS interactif
 * Embarque le sketch p5.js avec sélecteur de plante intégré
 */
export default function VisualisationGCMS() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);
  const serialPortRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  
  const [selectedPlant, setSelectedPlant] = useState<string>("Lavandula angustifolia");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plantList, setPlantList] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [arduinoConnected, setArduinoConnected] = useState<boolean>(false);
  const [arduinoStatus, setArduinoStatus] = useState<string>("Déconnecté");

  // Récupérer la liste des plantes disponibles
  const { data: plantsData } = trpc.p5data.molecules.useQuery({});

  useEffect(() => {
    if (plantsData?.plants) {
      setPlantList(plantsData.plants.slice(0, 50)); // Top 50 plantes
    }
  }, [plantsData]);

  // Charger p5.js dynamiquement
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js";
    script.async = true;
    script.onload = () => {
      loadSketch();
    };
    document.body.appendChild(script);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
      if (arduinoConnected) {
        disconnectArduino();
      }
    };
  }, []);

  // Charger le sketch p5.js
  const loadSketch = async () => {
    if (!canvasRef.current || !window.p5) return;

    const plantName = selectedPlant;
    setIsLoading(true);

    try {
      // Récupérer les données GC-MS depuis l'API
      const response = await fetch(
        `${window.location.origin}/api/trpc/p5data.gcms?input={"plantName":"${encodeURIComponent(plantName)}"}`
      );
      const result = await response.json();

      if (!result.result?.data?.peaks) {
        console.error("Données GC-MS non disponibles");
        setIsLoading(false);
        return;
      }

      const gcmsData = result.result.data;

      // Créer le sketch p5.js
      const sketch = (p: any) => {
        let peaks = gcmsData.peaks || [];
        let curve: any[] = [];
        let baselineNoise: any[] = [];
        let zoomLevel = 1;
        let panX = 0;
        let selectedPeakIndex = -1;
        let showGrid = true;
        let showColors = true;
        let animationMode = false;
        let animationProgress = 0;

        p.setup = function () {
          const width = canvasRef.current?.clientWidth || 1000;
          const height = 500;
          const canvas = p.createCanvas(width, height);
          canvas.parent(canvasRef.current);
          generateCurve();
          generateBaselineNoise();
        };

        p.draw = function () {
          // Mettre à jour depuis Arduino
          if ((window as any).p5SketchData) {
            zoomLevel = (window as any).p5SketchData.zoomLevel;
            panX = (window as any).p5SketchData.panX;
          }

          p.background(255);

          // Grille
          if (showGrid) drawGrid();

          // Axes
          drawAxes();

          // Baseline
          p.stroke(200);
          p.strokeWeight(1);
          p.beginShape();
          for (let i = 0; i < baselineNoise.length; i++) {
            const x = p.map(i, 0, baselineNoise.length - 1, 50, p.width - 50);
            const y = p.map(baselineNoise[i], 0, 1, p.height - 50, 100);
            p.vertex(x, y);
          }
          p.endShape();

          // Courbe GC-MS
          p.stroke(50);
          p.strokeWeight(2);
          p.beginShape();
          for (let i = 0; i < curve.length; i++) {
            const x = p.map(i, 0, curve.length - 1, 50, p.width - 50);
            const y = p.map(curve[i], 0, 100, p.height - 50, 100);
            p.vertex(x, y);
          }
          p.endShape();

          // Pics
          for (let i = 0; i < peaks.length; i++) {
            const peak = peaks[i];
            const x = p.map(peak.rt, 0, 30, 50, p.width - 50);
            const y = p.map(peak.intensity, 0, 100, p.height - 50, 100);

            // Couleur par famille
            let color = getColorByFamily(peak.family);
            p.fill(color);
            p.stroke(50);
            p.strokeWeight(1);
            p.circle(x, y, i === selectedPeakIndex ? 12 : 8);

            // Ligne verticale
            p.stroke(color);
            p.strokeWeight(1);
            p.line(x, p.height - 50, x, y);
          }

          // Tooltip
          if (selectedPeakIndex >= 0) {
            drawDetailPanel();
          }
        };

        const generateCurve = () => {
          curve = [];
          for (let i = 0; i < 800; i++) {
            let value = 0;
            for (let peak of peaks) {
              const rt = peak.rt;
              const intensity = peak.intensity;
              const sigma = 0.3;
              const x = p.map(i, 0, 800, 0, 30);
              value += intensity * p.exp(-0.5 * ((x - rt) / sigma) ** 2);
            }
            curve.push(p.min(value, 100));
          }
        };

        const generateBaselineNoise = () => {
          baselineNoise = [];
          let noise = 0;
          for (let i = 0; i < 800; i++) {
            noise = p.noise(i * 0.01) * 2;
            baselineNoise.push(noise);
          }
        };

        const drawGrid = () => {
          p.stroke(220);
          p.strokeWeight(1);
          for (let i = 0; i <= 10; i++) {
            const x = p.map(i, 0, 10, 50, p.width - 50);
            p.line(x, 100, x, p.height - 50);
            p.fill(150);
            p.textSize(10);
            p.text((i * 3).toFixed(1), x - 10, p.height - 30);
          }
        };

        const drawAxes = () => {
          p.stroke(0);
          p.strokeWeight(2);
          p.line(50, p.height - 50, p.width - 50, p.height - 50); // X axis
          p.line(50, 100, 50, p.height - 50); // Y axis

          p.fill(0);
          p.textSize(12);
          p.text("Temps de rétention (min)", p.width / 2 - 80, p.height - 10);
          p.text("Intensité", 10, p.height / 2);
        };

        const drawDetailPanel = () => {
          if (selectedPeakIndex < 0 || !peaks[selectedPeakIndex]) return;

          const peak = peaks[selectedPeakIndex];
          const panelX = 10;
          const panelY = 10;
          const panelW = 250;
          const panelH = 180;

          p.fill(255);
          p.stroke(100);
          p.strokeWeight(1);
          p.rect(panelX, panelY, panelW, panelH);

          p.fill(0);
          p.textSize(12);
          p.textStyle(p.BOLD);
          p.text(peak.molecule, panelX + 10, panelY + 25);

          p.textSize(10);
          p.textStyle(p.NORMAL);
          p.text(`RT: ${(peak).toFixed(2)} min`, panelX + 10, panelY + 45);
          p.text(`Intensité: ${(peak).toFixed(1)}%`, panelX + 10, panelY + 60);
          p.text(`CAS: ${peak.cas}`, panelX + 10, panelY + 75);
          p.text(`Famille: ${peak.family}`, panelX + 10, panelY + 90);
          p.text(`Odeur: ${peak.odor}`, panelX + 10, panelY + 105);
          p.text(`Note: ${peak.note}`, panelX + 10, panelY + 120);
          p.text(`MW: ${peak.mw} g/mol`, panelX + 10, panelY + 135);
          p.text(`BP: ${peak.bp}°C`, panelX + 10, panelY + 150);
        };

        const getColorByFamily = (family: string) => {
          const colors: { [key: string]: number[] } = {
            "Monoterpènes": [100, 200, 100],
            "Monoterpénols": [100, 150, 255],
            "Esters": [200, 150, 200],
            "Cétones": [255, 150, 100],
            "Oxydes": [150, 200, 220],
            "Sesquiterpènes": [50, 150, 50],
            "Coumarines": [255, 180, 150],
          };
          const color = colors[family] || [150, 150, 150];
          return p.color(color[0], color[1], color[2]);
        };

        p.mousePressed = function () {
          for (let i = 0; i < peaks.length; i++) {
            const peak = peaks[i];
            const x = p.map(peak.rt, 0, 30, 50, p.width - 50);
            const y = p.map(peak.intensity, 0, 100, p.height - 50, 100);
            const distance = p.dist(p.mouseX, p.mouseY, x, y);
            if (distance < 15) {
              selectedPeakIndex = i;
              return false;
            }
          }
          selectedPeakIndex = -1;
        };

        p.keyPressed = function () {
          if (p.key === "r" || p.key === "R") {
            zoomLevel = 1;
            panX = 0;
          }
          if (p.key === "g" || p.key === "G") {
            showGrid = !showGrid;
          }
          if (p.key === "f" || p.key === "F") {
            showColors = !showColors;
          }
        };



        p.windowResized = function () {
          if (canvasRef.current) {
            const width = canvasRef.current.clientWidth;
            p.resizeCanvas(width, 500);
          }
        };
      };

      // Créer l'instance p5
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
      
      // Créer un objet global pour partager les données avec Arduino
      (window as any).p5SketchData = {
        zoomLevel: 1,
        panX: 0,
      };
      
      p5InstanceRef.current = new (window as any).p5(sketch);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement du sketch:", error);
      setIsLoading(false);
    }
  };

  const handlePlantSelect = (plant: string) => {
    setSelectedPlant(plant);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(query.length > 0);
  };

  // Connexion Arduino WebSerial
  const connectArduino = async () => {
    try {
      if (!('serial' in navigator)) {
        alert('WebSerial API non supportée par ce navigateur. Utilisez Chrome/Edge.');
        return;
      }

      const port = await (navigator.serial as any).requestPort();
      await port.open({ baudRate: 9600 });
      serialPortRef.current = port;
      setArduinoConnected(true);
      setArduinoStatus("Connecté");

      // Lire les données du port série
      readSerialData();
    } catch (error) {
      console.error('Erreur de connexion Arduino:', error);
      setArduinoStatus("Erreur de connexion");
    }
  };

  const readSerialData = async () => {
    if (!serialPortRef.current) return;

    try {
      const reader = serialPortRef.current.readable?.getReader();
      if (!reader) return;
      readerRef.current = reader;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Décoder les données du port série
        const text = new TextDecoder().decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          const data = line.trim().split(',');
          if (data.length >= 2) {
            const potentiometer1 = parseInt(data[0]); // Zoom
            const potentiometer2 = parseInt(data[1]); // Pan

            // Mettre à jour le sketch p5.js avec les données Arduino
            if (p5InstanceRef.current) {
              // Zoom: 0-1023 → 0.5-20x
              const newZoom = 0.5 + (potentiometer1 / 1023) * 19.5;
              // Pan: 0-1023 → -500 à 500
              const newPan = (potentiometer2 / 1023) * 1000 - 500;

              // Envoyer les données au sketch (via une variable globale ou callback)
              if (window.p5SketchData) {
                window.p5SketchData.zoomLevel = newZoom;
                window.p5SketchData.panX = newPan;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur de lecture du port série:', error);
    }
  };

  const disconnectArduino = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
      }
      if (serialPortRef.current) {
        await serialPortRef.current.close();
      }
      serialPortRef.current = null;
      readerRef.current = null;
      setArduinoConnected(false);
      setArduinoStatus("Déconnecté");
    } catch (error) {
      console.error('Erreur de déconnexion Arduino:', error);
    }
  };

  const filteredPlants = plantList.filter((plant) =>
    plant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Déclarer les types TypeScript pour WebSerial
  interface SerialPort {
    open(options: { baudRate: number }): Promise<void>;
    close(): Promise<void>;
    readable: ReadableStream<Uint8Array> | null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <h1 className="text-3xl font-bold mb-4">Chromatogramme GC-MS Interactif</h1>
          <p className="text-muted-foreground">
            Explorez le profil moléculaire des plantes aromatiques de PERFUMUM
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-20">
              <h2 className="font-semibold mb-4">Sélectionner une plante</h2>

              {/* Recherche */}
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Suggestions */}
              {showSuggestions && (
                <div className="border border-border rounded-md max-h-48 overflow-y-auto mb-4">
                  {filteredPlants.map((plant) => (
                    <button
                      key={plant}
                      onClick={() => handlePlantSelect(plant)}
                      className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
                    >
                      {plant}
                    </button>
                  ))}
                </div>
              )}

              {/* Plante sélectionnée */}
              <div className="mb-4 p-3 bg-accent/10 rounded-md">
                <p className="text-sm font-medium">{selectedPlant}</p>
              </div>

              {/* Boutons d'action */}
              <Button
                onClick={() => loadSketch()}
                disabled={isLoading}
                className="w-full mb-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Recharger
                  </>
                )}
              </Button>

              {/* Bouton Arduino */}
              <Button
                onClick={arduinoConnected ? disconnectArduino : connectArduino}
                variant={arduinoConnected ? "destructive" : "outline"}
                className="w-full mb-2"
              >
                {arduinoConnected ? (
                  <>
                    <ZapOff className="h-4 w-4 mr-2" />
                    Déconnecter Arduino
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Connecter Arduino
                  </>
                )}
              </Button>

              {/* Statut Arduino */}
              <div className={`text-xs p-2 rounded-md mb-4 ${
                arduinoConnected
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                <p>Arduino: {arduinoStatus}</p>
              </div>

              {/* Légende des contrôles */}
              <div className="text-xs text-muted-foreground space-y-2 mt-4 pt-4 border-t border-border">
                <p>
                  <strong>Contrôles:</strong>
                </p>
                <p>• Clic sur pic = Détails</p>
                <p>• R = Reset zoom</p>
                <p>• G = Grille on/off</p>
                <p>• F = Couleurs on/off</p>
                <p className="mt-3 pt-3 border-t border-border/50">
                  <strong>Arduino:</strong>
                </p>
                <p>• Pot 1 = Zoom</p>
                <p>• Pot 2 = Pan</p>
              </div>
            </Card>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <Card className="p-4 bg-white">
              {isLoading && (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <div
                ref={canvasRef}
                className="w-full"
                style={{ minHeight: "500px" }}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
