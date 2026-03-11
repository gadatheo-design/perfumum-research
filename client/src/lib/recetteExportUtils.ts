/**
 * Utilitaires d'export pour les recettes
 * 
 * Formats supportés :
 * - Markdown (Notion-ready)
 * - JSON (structure complète)
 */

interface RecetteExportData {
  id: number;
  name: string;
  category: string | null;
  family: string | null;
  intensity: number | null;
  stability: string | null;
  moleculeCount?: number;
  ingredients?: string | null;
  avgIntensity?: number;
  avgFreshness?: number;
  avgWarmth?: number;
  avgSweetness?: number;
  avgSpiciness?: number;
  avgEarthiness?: number;
}

/**
 * Exporter une recette en Markdown (format Notion-ready)
 */
export function exportRecetteToMarkdown(recette: RecetteExportData): void {
  const date = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let markdown = `# ${recette.name}\n\n`;
  markdown += `> Exporté depuis PERFUMUM le ${date}\n\n`;
  markdown += `---\n\n`;

  // Métadonnées
  markdown += `## 📋 Métadonnées\n\n`;
  markdown += `- **ID** : ${recette.id}\n`;
  markdown += `- **Catégorie** : ${recette.category || 'Non spécifiée'}\n`;
  markdown += `- **Famille** : ${recette.family || 'Non spécifiée'}\n`;
  markdown += `- **Intensité** : ${recette.intensity || 5}/10\n`;
  markdown += `- **Stabilité** : ${recette.stability || 'Non spécifiée'}\n`;
  if (recette.moleculeCount) {
    markdown += `- **Nombre de molécules** : ${recette.moleculeCount}\n`;
  }
  markdown += `\n`;

  // Profil radar (si disponible)
  if (recette.moleculeCount && recette.moleculeCount > 0) {
    markdown += `## 🎯 Profil Radar\n\n`;
    markdown += `| Axe | Valeur |\n`;
    markdown += `|-----|--------|\n`;
    markdown += `| Intensité | ${recette.avgIntensity || 50}/100 |\n`;
    markdown += `| Fraîcheur | ${recette.avgFreshness || 50}/100 |\n`;
    markdown += `| Chaleur | ${recette.avgWarmth || 50}/100 |\n`;
    markdown += `| Douceur | ${recette.avgSweetness || 50}/100 |\n`;
    markdown += `| Épicé | ${recette.avgSpiciness || 50}/100 |\n`;
    markdown += `| Terreux | ${recette.avgEarthiness || 50}/100 |\n`;
    markdown += `\n`;
  }

  // Ingrédients (si disponibles)
  if (recette.ingredients) {
    markdown += `## 🧪 Ingrédients\n\n`;
    markdown += `${recette.ingredients}\n\n`;
  }

  // Footer
  markdown += `---\n\n`;
  markdown += `*Généré par PERFUMUM — Plateforme de recherche olfactive*\n`;

  // Télécharger le fichier
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(recette.name)}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporter une recette en JSON (structure complète)
 */
export function exportRecetteToJSON(recette: RecetteExportData): void {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      source: "PERFUMUM",
      version: "1.0"
    },
    recette: {
      id: recette.id,
      name: recette.name,
      category: recette.category,
      family: recette.family,
      intensity: recette.intensity,
      stability: recette.stability,
      moleculeCount: recette.moleculeCount,
      ingredients: recette.ingredients,
      radarProfile: recette.moleculeCount && recette.moleculeCount > 0 ? {
        intensity: recette.avgIntensity || 50,
        freshness: recette.avgFreshness || 50,
        warmth: recette.avgWarmth || 50,
        sweetness: recette.avgSweetness || 50,
        spiciness: recette.avgSpiciness || 50,
        earthiness: recette.avgEarthiness || 50
      } : null
    }
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(recette.name)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Sanitize filename (remove special characters)
 */
function sanitizeFilename(filename: string): string {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9-_]/g, '_') // Replace special chars with underscore
    .replace(/_+/g, '_') // Remove duplicate underscores
    .toLowerCase();
}
