# Configuration Google Analytics - PERFUMUM

## 📊 Vue d'ensemble

Google Analytics a été intégré au projet PERFUMUM pour suivre :
- Les pages visitées
- Les redirections d'URLs
- L'utilisation des outils
- Les recherches effectuées
- Les visualisations consultées
- Les exports de données

## 🔧 Installation

### Dépendances
- **react-ga4** : Librairie officielle Google Analytics 4 pour React

```bash
pnpm add react-ga4
```

## 📝 Configuration

### 1. Ajouter la clé de mesure

Créez une variable d'environnement `VITE_GA_MEASUREMENT_ID` avec votre ID de mesure Google Analytics :

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Initialisation automatique

L'initialisation se fait automatiquement dans `client/src/main.tsx` :

```typescript
import { initializeAnalytics } from "@/lib/analytics";

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (measurementId) {
  initializeAnalytics(measurementId);
}
```

## 📍 Tracking implémenté

### Page Views
Automatiquement suivi lors des changements de route via `PageTransition.tsx` :

```typescript
trackPageView(location);
```

### Redirections d'URLs
Pour tracker les redirections (migrations d'URLs) :

```typescript
import { trackRedirect } from "@/lib/analytics";

trackRedirect("/old-url", "/new-url", "URL migration");
```

### Recherches
Pour tracker les recherches par type :

```typescript
import { 
  trackMoleculeSearch, 
  trackRecipeSearch, 
  trackPlantSearch 
} from "@/lib/analytics";

trackMoleculeSearch("limonene", 42);
trackRecipeSearch("pétrichor", 15);
trackPlantSearch("rose", 8);
```

### Utilisation des outils
Pour tracker l'utilisation des outils :

```typescript
import { trackToolUsage } from "@/lib/analytics";

trackToolUsage("Éditeur de Formulation");
trackToolUsage("Générateur IA");
trackToolUsage("Calculateur");
```

### Visualisations
Pour tracker les visualisations consultées :

```typescript
import { trackVisualizationView } from "@/lib/analytics";

trackVisualizationView("Synergies Heatmap");
trackVisualizationView("Graphe Réseau");
trackVisualizationView("Diagramme Sankey");
```

### Exports de données
Pour tracker les exports :

```typescript
import { trackDataExport } from "@/lib/analytics";

trackDataExport("CSV", "molecules");
trackDataExport("JSON", "recipes");
```

## 🎯 Événements personnalisés

Vous pouvez créer des événements personnalisés :

```typescript
import { trackEvent } from "@/lib/analytics";

trackEvent("category", "action", "label", value);
```

Exemple :
```typescript
trackEvent("engagement", "formula_saved", "Pétrichor", 1);
trackEvent("collaboration", "shared_formula", "user@example.com", 1);
```

## 📊 Dashboard Google Analytics

1. Accédez à [Google Analytics](https://analytics.google.com/)
2. Sélectionnez votre propriété PERFUMUM
3. Consultez les rapports :
   - **Engagement** : Pages, événements, utilisateurs
   - **Acquisition** : Trafic, sources
   - **Conversions** : Objectifs personnalisés
   - **Audience** : Démographie, appareils

## 🔍 Monitoring des redirections

Pour monitorer les migrations d'URLs en production :

1. Créez un rapport personnalisé dans Google Analytics
2. Filtrez par événement `redirect`
3. Analysez les patterns de redirection
4. Identifiez les URLs obsolètes à mettre à jour

### Exemple de rapport
```
Redirections détectées :
- /old-molecules → /molecules : 1,234 redirections
- /legacy-recipes → /recettes : 856 redirections
- /ancient-plants → /plants : 342 redirections
```

## 🚀 Bonnes pratiques

1. **Initialisation unique** : Google Analytics s'initialise une seule fois au démarrage
2. **Tracking passif** : Les page views sont automatiquement trackés
3. **Événements explicites** : Utilisez les fonctions spécialisées pour les événements
4. **Pas de données sensibles** : Ne trackez jamais les données personnelles
5. **Testing** : Utilisez le mode debug de Google Analytics pour tester

## 🧪 Mode Debug

Pour activer le mode debug (affiche les événements dans la console) :

```typescript
// Dans analytics.ts
if (process.env.NODE_ENV === 'development') {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); };
}
```

## 📱 Compatibilité mobile

Google Analytics fonctionne automatiquement sur mobile via react-ga4. Aucune configuration supplémentaire requise.

## 🔐 Conformité RGPD

- Assurez-vous que votre politique de confidentialité mentionne Google Analytics
- Obtenez le consentement des utilisateurs avant de tracker
- Utilisez le masquage d'IP si nécessaire
- Consultez la documentation Google Analytics sur la conformité RGPD

## 📚 Ressources

- [Documentation react-ga4](https://github.com/react-ga/react-ga4)
- [Google Analytics 4 Guide](https://support.google.com/analytics/answer/10089681)
- [Événements GA4](https://support.google.com/analytics/answer/9322688)

## ✅ Checklist d'intégration

- [x] Installation de react-ga4
- [x] Création du fichier analytics.ts
- [x] Initialisation dans main.tsx
- [x] Tracking des page views dans PageTransition
- [x] Fonctions de tracking pour événements spécialisés
- [ ] Configuration de la clé de mesure (VITE_GA_MEASUREMENT_ID)
- [ ] Test en développement
- [ ] Test en production
- [ ] Création de rapports personnalisés
- [ ] Documentation des événements trackés
