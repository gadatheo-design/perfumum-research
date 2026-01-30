# Rapport d'enrichissement PubChem — 7 janvier 2026

## Résumé exécutif

L'enrichissement en masse des molécules de la base de données PERFUMUM via l'API PubChem a été réalisé avec succès. Ce processus a permis d'augmenter significativement la complétude des données scientifiques de la base.

## Statistiques avant enrichissement

| Métrique | Valeur | Pourcentage |
|----------|--------|-------------|
| Total molécules | 556 | 100% |
| Sans numéro CAS | 422 | 75.9% |
| Sans nom IUPAC | 460 | 82.7% |
| Sans classe chimique | 399 | 71.8% |

## Résultats de l'enrichissement

### Traitement des 422 molécules sans CAS

| Résultat | Nombre | Pourcentage |
|----------|--------|-------------|
| **Enrichies avec succès** | 187 | 44.3% |
| Non trouvées sur PubChem | 235 | 55.7% |
| Erreurs techniques | 0 | 0% |

### Données récupérées pour les 187 molécules enrichies

| Type de donnée | Récupérées | Pourcentage |
|----------------|------------|-------------|
| Numéro CAS | 183 | 97.9% |
| Nom IUPAC | 187 | 100% |
| Classe chimique | 131 | 70.1% |
| Formule moléculaire | 187 | 100% |

## Statistiques après enrichissement

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| Avec numéro CAS | 134 (24.1%) | **317 (57.0%)** | +183 (+32.9%) |
| Avec nom IUPAC | 96 (17.3%) | **282 (50.7%)** | +186 (+33.4%) |
| Avec classe chimique | 157 (28.2%) | **278 (50.0%)** | +121 (+21.8%) |

## Méthodologie

### Script d'enrichissement (Version 2)

Le script a été optimisé avec les fonctionnalités suivantes :

1. **Dictionnaire de traduction français-anglais** pour les noms courants de molécules
2. **Génération de variantes de recherche** (avec/sans accents, noms entre parenthèses, etc.)
3. **Gestion des rate limits PubChem** (300ms entre requêtes, 5s entre lots de 50)
4. **Détermination automatique des classes chimiques** basée sur les noms IUPAC et SMILES

### Exemples de traductions réussies

| Nom français | Variante trouvée | CAS récupéré |
|--------------|------------------|--------------|
| 1,8-cineole | eucalyptol | 470-82-6 |
| Acide Coumarique | coumaric acid | 501-98-4 |
| Aldéhyde C-10 | decanal | 112-31-2 |
| Acétate de benzyle | benzyl acetate | 140-11-4 |
| β-Caryophyllène | beta-caryophyllene | 87-44-5 |

## Molécules non trouvées

Les 235 molécules non trouvées sur PubChem correspondent principalement à :

- **Mélanges complexes** (ex: "Cacao Colombien", "Café Geisha")
- **Noms commerciaux ou poétiques** (ex: "Calcaire Olfactif", "Poussière blanche du Sahel")
- **Extraits naturels** (ex: "CEDARWOOD OIL", "Absolue d'Iris")
- **Composés très spécifiques** non référencés dans PubChem

Ces molécules nécessiteront un enrichissement manuel ou via d'autres sources (RIFM, Good Scents Company, etc.).

## Fichiers générés

| Fichier | Description |
|---------|-------------|
| `scripts/molecules-sans-cas.json` | Liste des 422 molécules sans CAS (entrée) |
| `scripts/enrichment-results-v2.json` | Résultats complets de l'enrichissement |
| `scripts/enrichment-log-v2.txt` | Log détaillé de l'exécution |
| `scripts/integration-log.txt` | Log de l'intégration en base de données |

## Recommandations pour la suite

1. **Enrichissement manuel** des 235 molécules non trouvées via :
   - The Good Scents Company
   - RIFM (Research Institute for Fragrance Materials)
   - Sigma-Aldrich / Merck
   - Bases de données spécialisées en parfumerie

2. **Ajout du champ molecular_weight** au schéma de la table molecules pour stocker les masses molaires récupérées

3. **Validation croisée** des numéros CAS avec d'autres sources pour les molécules critiques

4. **Mise à jour périodique** (trimestrielle) pour les nouvelles molécules ajoutées

---

*Rapport généré automatiquement le 7 janvier 2026*
*Projet PERFUMUM — Recherche Olfactive*
