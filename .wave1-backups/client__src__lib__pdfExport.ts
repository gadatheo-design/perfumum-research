// @ts-nocheck
import jsPDF from "jspdf";

export type MethodologyType = "absorbe" | "pyrolyse" | "gcms";

interface PDFSection {
  title: string;
  content: string[];
}

export function exportMethodologyPDF(type: MethodologyType) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper: Add text with automatic page break
  const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    
    const lines = doc.splitTextToSize(text, maxWidth);
    
    for (const line of lines) {
      if (yPosition + 10 > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    }
    yPosition += 5; // Extra spacing after paragraph
  };

  // Helper: Add section title
  const addSectionTitle = (title: string) => {
    yPosition += 5;
    addText(title, 14, true);
    yPosition += 3;
  };

  // Content based on methodology type
  if (type === "absorbe") {
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("MÉTHODE ABSORBE", margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Protocole de Captation & Analyse Olfactive", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, yPosition);
    yPosition += 15;

    // Introduction
    addText("ABSORBE est un protocole de recherche olfactive développé pour la captation, l'analyse et la restitution d'atmosphères sensorielles. Cette méthode combine approches scientifiques (chimie analytique, pyrolyse) et sensibles (évaluation sensorielle, documentation phénoménologique).");
    
    yPosition += 5;

    // 7 Sections
    const sections: PDFSection[] = [
      {
        title: "1. AIR — Captation Atmosphérique",
        content: [
          "Prélèvement d'air ambiant sur tubes Tenax TA (polymère adsorbant).",
          "Durée: 30-60 minutes selon concentration olfactive estimée.",
          "Débit: 100-200 mL/min contrôlé par pompe péristaltique.",
          "Conservation: tubes scellés, stockage 4°C, analyse sous 7 jours."
        ]
      },
      {
        title: "2. LIEU — Documentation Contextuelle",
        content: [
          "Coordonnées GPS précises (±5m).",
          "Conditions météorologiques (température, humidité, pression, vent).",
          "Description géologique/botanique du site.",
          "Photographies panoramiques et macro-détails.",
          "Cartographie olfactive (zones d'intensité variable)."
        ]
      },
      {
        title: "3. ODEUR — Évaluation Sensorielle",
        content: [
          "Échelle ABSORBE 8 axes: Terreux, Humide, Minéral, Végétal, Fumé, Ambré, Froid, Fantôme.",
          "Notation 0-10 pour chaque axe.",
          "Identification molécules-clés perçues (géosmine, pinène, vétiver...).",
          "Notes de dégustation libres (comparaisons, évocations, temporalité)."
        ]
      },
      {
        title: "4. FUMÉ — Pyrolyse Contrôlée",
        content: [
          "Prélèvement matériaux solides (sol, écorce, végétaux, minéraux).",
          "Pyrolyse 3 températures: 120°C, 160°C, 200°C.",
          "Durée: 15 minutes par palier.",
          "Captation vapeurs sur tubes Tenax TA.",
          "Analyse GC-MS des pyrolysats."
        ]
      },
      {
        title: "5. SON — Enregistrement Sonore",
        content: [
          "Captation audio stéréo (micro omnidirectionnel).",
          "Durée: 5-10 minutes minimum.",
          "Format: WAV 48kHz/24bit.",
          "Documentation paysage sonore (oiseaux, vent, eau, activité humaine).",
          "Synchronisation temporelle avec prélèvements olfactifs."
        ]
      },
      {
        title: "6. IMAGE — Documentation Visuelle",
        content: [
          "Photographies haute résolution (RAW + JPEG).",
          "Séquences macro (textures, détails matériaux).",
          "Panoramas 360° si pertinent.",
          "Vidéo courte (1-2 min) capturant l'atmosphère générale.",
          "Annotations visuelles (zones de prélèvement, points d'intérêt)."
        ]
      },
      {
        title: "7. TEXTE — Rédaction Notes Terrain",
        content: [
          "Carnet de terrain manuscrit (observations immédiates).",
          "Transcription numérique sous 24h.",
          "Structure: Contexte / Observations sensorielles / Hypothèses / Questions.",
          "Références croisées (photos, enregistrements, échantillons).",
          "Archivage horodaté avec métadonnées complètes."
        ]
      }
    ];

    sections.forEach(section => {
      addSectionTitle(section.title);
      section.content.forEach(line => {
        addText(`• ${line}`, 10);
      });
      yPosition += 3;
    });

    // Footer
    yPosition += 10;
    addText("Ce protocole garantit la reproductibilité et la traçabilité des recherches olfactives PERFUMUM sur 10 ans.", 9);

  } else if (type === "pyrolyse") {
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("PROTOCOLE PYROLYSE", margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Pyrolyse Contrôlée & Analyse GC-MS", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, yPosition);
    yPosition += 15;

    // Introduction
    addText("La pyrolyse contrôlée permet d'extraire les composés volatils de matériaux solides (sol, écorce, résines) par chauffage progressif en atmosphère inerte. Cette technique révèle des molécules inaccessibles par extraction classique.");
    
    yPosition += 5;

    // Protocoles
    addSectionTitle("PROTOCOLE 120°C — Volatils Légers");
    addText("• Température: 120°C ± 2°C", 10);
    addText("• Durée: 15 minutes", 10);
    addText("• Atmosphère: Azote (N₂) 99.999%", 10);
    addText("• Débit: 50 mL/min", 10);
    addText("• Captation: Tube Tenax TA en sortie", 10);
    addText("• Observation: Terpènes, aldéhydes, esters légers", 10);
    yPosition += 5;

    addSectionTitle("PROTOCOLE 160°C — Composés Intermédiaires");
    addText("• Température: 160°C ± 2°C", 10);
    addText("• Durée: 15 minutes", 10);
    addText("• Atmosphère: Azote (N₂) 99.999%", 10);
    addText("• Débit: 50 mL/min", 10);
    addText("• Captation: Tube Tenax TA en sortie", 10);
    addText("• Observation: Phénols, cétones, lactones", 10);
    yPosition += 5;

    addSectionTitle("PROTOCOLE 200°C — Composés Lourds");
    addText("• Température: 200°C ± 2°C", 10);
    addText("• Durée: 15 minutes", 10);
    addText("• Atmosphère: Azote (N₂) 99.999%", 10);
    addText("• Débit: 50 mL/min", 10);
    addText("• Captation: Tube Tenax TA en sortie", 10);
    addText("• Observation: Guaiacol, créosol, composés aromatiques lourds", 10);
    yPosition += 5;

    addSectionTitle("ANALYSE GC-MS");
    addText("• Instrument: Agilent 7890B/5977B", 10);
    addText("• Colonne: DB-5MS (30m × 0.25mm × 0.25µm)", 10);
    addText("• Injection: 250°C, splitless 1 min", 10);
    addText("• Programme température: 40°C (3min) → 10°C/min → 280°C (5min)", 10);
    addText("• Détecteur MS: 70eV, scan 35-350 m/z", 10);
    yPosition += 5;

    addSectionTitle("INTERPRÉTATION");
    addText("Comparer les profils chromatographiques des 3 températures pour identifier les familles moléculaires dominantes. Les composés légers (120°C) révèlent l'atmosphère fraîche, les composés lourds (200°C) les notes fumées et résineuses.");

  } else if (type === "gcms") {
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("PROTOCOLE GC-MS", margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Chromatographie en Phase Gazeuse - Spectrométrie de Masse", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, yPosition);
    yPosition += 15;

    // Introduction
    addText("La chromatographie en phase gazeuse couplée à la spectrométrie de masse (GC-MS) est la technique de référence pour l'analyse des composés volatils. Elle permet l'identification et la quantification de molécules odorantes avec une sensibilité de l'ordre du picogramme.");
    
    yPosition += 5;

    addSectionTitle("ÉQUIPEMENT");
    addText("• Chromatographe: Agilent 7890B", 10);
    addText("• Spectromètre de masse: Agilent 5977B", 10);
    addText("• Colonne: DB-5MS (30m × 0.25mm × 0.25µm)", 10);
    addText("• Injecteur: Split/Splitless avec liner déactivé", 10);
    addText("• Gaz vecteur: Hélium (He) 99.9999%", 10);
    yPosition += 5;

    addSectionTitle("PROGRAMME TEMPÉRATURE");
    addText("1. Isotherme initiale: 40°C pendant 3 minutes", 10);
    addText("2. Rampe 1: 10°C/min jusqu'à 150°C", 10);
    addText("3. Rampe 2: 5°C/min jusqu'à 280°C", 10);
    addText("4. Isotherme finale: 280°C pendant 5 minutes", 10);
    addText("Durée totale: 35 minutes", 10);
    yPosition += 5;

    addSectionTitle("PARAMÈTRES INJECTION");
    addText("• Température injecteur: 250°C", 10);
    addText("• Mode: Splitless pendant 1 minute", 10);
    addText("• Volume injection: 1 µL", 10);
    addText("• Débit colonne: 1.2 mL/min (pression constante)", 10);
    yPosition += 5;

    addSectionTitle("DÉTECTION MS");
    addText("• Ionisation: Impact électronique 70 eV", 10);
    addText("• Source: 230°C", 10);
    addText("• Quadrupôle: 150°C", 10);
    addText("• Mode scan: 35-350 m/z", 10);
    addText("• Fréquence: 3.5 scans/seconde", 10);
    yPosition += 5;

    addSectionTitle("STANDARDS INTERNES");
    addText("• n-Dodécane (C₁₂H₂₆): 10 ppm - Temps de rétention ~12 min", 10);
    addText("• n-Hexadécane (C₁₆H₃₄): 10 ppm - Temps de rétention ~18 min", 10);
    addText("• n-Eicosane (C₂₀H₄₂): 10 ppm - Temps de rétention ~24 min", 10);
    yPosition += 5;

    addSectionTitle("INTERPRÉTATION CHROMATOGRAMMES");
    addText("Zone 1 (0-12 min): Terpènes légers (α-pinène, limonène), aldéhydes", 10);
    addText("Zone 2 (12-24 min): Sesquiterpènes (vétiver, cédrol), phénols", 10);
    addText("Zone 3 (24-35 min): Composés lourds (ambroxan, muscs, résines)", 10);
    yPosition += 5;

    addSectionTitle("QUANTIFICATION");
    addText("Utiliser les standards internes pour calculer les concentrations relatives. Comparer les aires de pics des molécules d'intérêt aux aires des standards. Appliquer les facteurs de réponse spécifiques à chaque famille chimique.");
  }

  // Save PDF
  const filename = `PERFUMUM_${type.toUpperCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
