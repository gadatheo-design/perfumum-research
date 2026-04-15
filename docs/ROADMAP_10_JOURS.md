# Roadmap PERFUMUM - 10 prochains jours
## 06 janvier - 15 janvier 2026

---

## 📅 JOUR 1 - Lundi 06 janvier 2026

### Objectif : Étendre le schéma de base de données

#### Matin (3h)
- [ ] Ajouter les champs de conservation aux plantes
  - `conservation_status` (ENUM IUCN)
  - `cites_appendix` (ENUM CITES)
  - `conservation_notes` (TEXT)
  - `threat_factors` (JSON)
  - `sustainable_alternatives` (TEXT)
  - `last_assessment_year` (INT)
  - `historical_status` (VARCHAR)

- [ ] Créer la table `variety_genealogy`
  ```sql
  - id
  - variety_id (référence à plant_varieties)
  - parent_variety_id (auto-référence)
  - relationship_type (parent, hybrid, clone, mutation)
  - cross_date (année du croisement)
  - breeder (obtenteur)
  - notes
  ```

#### Après-midi (3h)
- [ ] Créer la table `olfactive_archives`
  ```sql
  - id
  - title (titre du document/source)
  - type (manuscript, formula, archaeological, botanical_illustration)
  - date_created (date historique)
  - civilization (Égypte, Rome, etc.)
  - plant_ids (JSON - plantes mentionnées)
  - molecule_ids (JSON - molécules si connues)
  - description (contenu)
  - provenance (source du document)
  - authenticity_level (confirmed, probable, hypothetical)
  - references (JSON - sources bibliographiques)
  - image_url
  ```

- [ ] Créer la table `civilizational_markers`
  ```sql
  - id
  - plant_id
  - civilization (Égypte, Rome, Grèce, Inde, Chine, etc.)
  - period (Antiquité, Moyen Âge, etc.)
  - start_year / end_year
  - usage_type (ritual, medical, commercial, funerary, cosmetic)
  - historical_significance (TEXT)
  - trade_routes (JSON)
  - archaeological_evidence (TEXT)
  - primary_sources (JSON)
  ```

#### Soir (1h)
- [ ] Migrer le schéma avec `pnpm db:push` ou SQL direct
- [ ] Vérifier l'intégrité de la migration
- [ ] Créer le checkpoint de fin de journée

**Livrables Jour 1** : Schéma étendu, 3 nouvelles tables créées

---

## 📅 JOUR 2 - Mardi 07 janvier 2026

### Objectif : Créer les procédures tRPC pour les nouvelles tables

#### Matin (3h)
- [ ] Créer les procédures tRPC pour `olfactive_archives`
  - `archives.list` (avec filtres par civilisation, période, type)
  - `archives.getById`
  - `archives.create`
  - `archives.update`
  - `archives.delete`
  - `archives.search` (recherche full-text)

- [ ] Créer les procédures tRPC pour `civilizational_markers`
  - `markers.list` (avec filtres)
  - `markers.getByPlant`
  - `markers.getByCivilization`
  - `markers.getByPeriod`
  - `markers.create`

#### Après-midi (3h)
- [ ] Créer les procédures tRPC pour `variety_genealogy`
  - `genealogy.getTree` (arbre complet d'une variété)
  - `genealogy.getAncestors` (parents, grands-parents)
  - `genealogy.getDescendants` (enfants, petits-enfants)
  - `genealogy.addRelationship`
  - `genealogy.updateRelationship`

- [ ] Créer les procédures pour les plantes avec conservation
  - `plants.listThreatened` (filtres IUCN/CITES)
  - `plants.getConservationStatus`
  - `plants.updateConservationStatus`

#### Soir (1h)
- [ ] Écrire les tests unitaires pour les nouvelles procédures
- [ ] Valider le fonctionnement des procédures
- [ ] Créer le checkpoint de fin de journée

**Livrables Jour 2** : Procédures tRPC complètes, tests unitaires

---

## 📅 JOUR 3 - Mercredi 08 janvier 2026

### Objectif : Importer les plantes historiques (myrrhe, encens)

#### Matin (3h)
- [ ] Créer le script d'import pour la myrrhe
  - `import-myrrhe.mjs`
  - Utiliser les données de `myrrhe-data.md`
  - Importer Commiphora myrrha avec :
    - Données botaniques complètes
    - 30+ molécules (créer si nécessaire)
    - Propriétés thérapeutiques
    - Contexte historique
    - Statut de conservation (NT/VU)

#### Après-midi (3h)
- [ ] Créer le script d'import pour les 6 espèces de Boswellia
  - `import-boswellia.mjs`
  - Utiliser les données de `encens-boswellia-data.md`
  - Importer :
    - B. sacra (Oman) - VU
    - B. carterii (Somalie)
    - B. serrata (Inde)
    - B. papyrifera (Éthiopie)
    - B. rivae (Éthiopie)
    - B. neglecta
  - Molécules spécifiques à chaque espèce
  - Acides boswelliques (fraction résineuse)

#### Soir (1h)
- [ ] Exécuter les scripts d'import
- [ ] Vérifier l'intégrité des données importées
- [ ] Créer le checkpoint de fin de journée

**Livrables Jour 3** : 7 plantes historiques importées (myrrhe + 6 encens)

---

## 📅 JOUR 4 - Jeudi 09 janvier 2026

### Objectif : Importer les espèces menacées et leurs statuts

#### Matin (3h)
- [ ] Créer le script d'import pour les espèces menacées
  - `import-threatened-species.mjs`
  - Utiliser les données de `plantes-menacees-data.md`
  - Importer les 19 espèces avec statuts IUCN/CITES :
    - Agarwood (Aquilaria malaccensis) - CR, CITES II
    - Santal blanc (Santalum album) - EN, CITES II
    - Guggul (Commiphora wightii) - CR, CITES II
    - Nard (Nardostachys jatamansi) - CR (enrichir données existantes)
    - Bois de rose (Aniba rosaeodora) - EN, CITES II
    - Etc. (15 autres espèces)

#### Après-midi (3h)
- [ ] Enrichir les plantes existantes avec statuts de conservation
  - Boswellia sacra : VU
  - Nard : CR
  - Autres plantes déjà en base

- [ ] Créer les entrées pour plantes disparues
  - Silphium (EX - Extinct)
  - Variétés anciennes de roses (EW - Extinct in Wild)

#### Soir (1h)
- [ ] Exécuter les scripts d'import
- [ ] Vérifier les statuts et alternatives durables
- [ ] Créer le checkpoint de fin de journée

**Livrables Jour 4** : 19 espèces menacées documentées avec statuts

---

## 📅 JOUR 5 - Vendredi 10 janvier 2026

### Objectif : Documenter les marqueurs civilisationnels

#### Matin (3h)
- [ ] Créer les marqueurs civilisationnels pour la myrrhe
  - Égypte antique (3000 av. J.-C. - présent)
    - Usage : Embaumement, rituels funéraires, médecine
    - Sources : Papyrus Ebers, tombes pharaoniques
  - Grèce antique (800 av. J.-C. - 400 ap. J.-C.)
    - Usage : Parfumerie, médecine, rituels
  - Rome antique (500 av. J.-C. - 500 ap. J.-C.)
    - Usage : Commerce, parfumerie, médecine
  - Bible (1000 av. J.-C. - 100 ap. J.-C.)
    - Usage : Onction sacrée, offrande, embaumement de Jésus

#### Après-midi (3h)
- [ ] Créer les marqueurs civilisationnels pour l'encens
  - Route de l'encens (3000 av. J.-C. - présent)
    - Arabie → Méditerranée → Rome
    - Commerce, religion, pouvoir impérial
  - Égypte antique : Rituels religieux (Kyphi)
  - Grèce/Rome : Offrandes aux dieux
  - Christianisme : Liturgie (présent)
  - Inde : Ayurveda, rituels hindous

- [ ] Créer les marqueurs pour le silphium
  - Cyrénaïque (VIIe siècle av. J.-C. - Ier siècle ap. J.-C.)
  - Grèce/Rome : Médecine, contraception, cuisine
  - Extinction documentée : Surexploitation

#### Soir (1h)
- [ ] Importer les marqueurs civilisationnels
- [ ] Vérifier les liens avec les plantes
- [ ] Créer le checkpoint de fin de journée

**Livrables Jour 5** : Marqueurs civilisationnels pour 3 plantes majeures

---

## 📅 JOUR 6 - Samedi 11 janvier 2026

### Objectif : Créer la page "Patrimoine menacé"

#### Matin (3h)
- [ ] Créer la page `/patrimoine-menace`
  - `client/src/pages/PatrimoineMenace.tsx`
  - Liste des plantes menacées avec filtres :
    - Par statut IUCN (CR, EN, VU, NT)
    - Par annexe CITES (I, II, III)
    - Par type de menace (surexploitation, habitat, climat)
    - Par région d'origine

- [ ] Créer les composants d'affichage
  - Carte de plante menacée avec badges de statut
  - Indicateurs visuels (couleurs par gravité)
  - Section "Alternatives durables"
  - Section "Initiatives de conservation"

#### Après-midi (3h)
- [ ] Créer la page de détail enrichie pour plantes menacées
  - Onglet "Conservation" dans les fiches plantes
  - Affichage du statut IUCN avec explication
  - Affichage du statut CITES avec réglementation
  - Facteurs de menace (liste)
  - Alternatives durables recommandées
  - Dernière évaluation (année)

- [ ] Créer la carte interactive des zones menacées
  - Utiliser Google Maps
  - Marqueurs par espèce menacée
  - Couleurs par niveau de menace
  - Popup avec informations de conservation

#### Soir (1h)
- [ ] Intégrer la page dans le menu principal
- [ ] Tester le responsive (desktop + mobile)
- [ ] Créer le checkpoint de fin de journée

**Livrables Jour 6** : Page "Patrimoine menacé" fonctionnelle

---

## 📅 JOUR 7 - Dimanche 12 janvier 2026

### Objectif : Créer la page "Archives olfactives"

#### Matin (3h)
- [ ] Créer la page `/archives-olfactives`
  - `client/src/pages/ArchivesOlfactives.tsx`
  - Timeline historique interactive
  - Filtres par :
    - Civilisation (Égypte, Rome, Grèce, Inde, Chine, etc.)
    - Période (Antiquité, Moyen Âge, Renaissance, etc.)
    - Type d'usage (rituel, médical, commercial, funéraire)
    - Plante

- [ ] Créer le composant Timeline
  - Frise chronologique horizontale scrollable
  - Points clés par événement/document
  - Zoom par période
  - Liens vers fiches plantes et archives

#### Après-midi (3h)
- [ ] Créer les cartes d'archives historiques
  - Affichage du document/source
  - Date et civilisation
  - Plantes mentionnées (liens)
  - Niveau d'authenticité (confirmé/probable/hypothétique)
  - Références bibliographiques
  - Images si disponibles

- [ ] Créer la vue "Routes commerciales"
  - Carte animée des routes historiques
  - Route de l'encens
  - Route des épices
  - Routes de la soie (parfums)

#### Soir (1h)
- [ ] Intégrer la page dans le menu principal
- [ ] Tester le responsive
- [ ] Créer le checkpoint de fin de journée

**Livrables Jour 7** : Page "Archives olfactives" avec timeline

---

## 📅 JOUR 8 - Lundi 13 janvier 2026

### Objectif : Enrichir les fiches plantes avec contexte historique

#### Matin (3h)
- [ ] Ajouter l'onglet "Histoire" aux fiches plantes
  - Section "Usages historiques par civilisation"
  - Section "Importance spirituelle/religieuse"
  - Section "Routes commerciales"
  - Section "Preuves archéologiques"
  - Section "Sources anciennes" (textes, manuscrits)

- [ ] Créer le composant de visualisation historique
  - Timeline de la plante
  - Carte des civilisations utilisatrices
  - Citations de sources anciennes
  - Images historiques (illustrations botaniques, etc.)

#### Après-midi (3h)
- [ ] Enrichir les fiches des plantes importées
  - Myrrhe : Contexte égyptien, biblique, ayurvédique
  - Encens : Route de l'encens, contexte religieux
  - Nard : Contexte biblique, himalayen
  - Agarwood : Contexte asiatique, oud

- [ ] Créer les associations limbiques communes
  - Ajouter le champ `limbic_associations` (JSON)
  - Documenter les associations courantes :
    - Rose → Enfance, jardin maternel
    - Encens → Spiritualité, temples
    - Tabac → Rituels, passages
    - Myrrhe → Sacré, deuil, antiquité

#### Soir (1h)
- [ ] Tester les nouvelles sections
- [ ] Vérifier les liens entre pages
- [ ] Créer le checkpoint de fin de journée

**Livrables Jour 8** : Fiches plantes enrichies avec contexte historique

---

## 📅 JOUR 9 - Mardi 14 janvier 2026

### Objectif : Créer la documentation et préparer les variétés disparues

#### Matin (3h)
- [ ] Documenter 5 variétés disparues majeures
  - **Rosa × centifolia 'Grasse'** (Rose de Grasse historique)
    - Dernière culture : ~1950
    - Profil : Citronellol/géraniol ratio unique
    - Cause : Standardisation industrielle
  
  - **Jasminum grandiflorum 'Grasse ancien'**
    - Dernière culture : ~1960
    - Profil : Indole/benzyl acetate ratio distinct
    - Cause : Abandon des cultures traditionnelles
  
  - **Lavandula angustifolia 'Population Sauvage Provence'**
    - Dernière observation : ~1980
    - Profil : Linalol/linalyl acetate sauvage
    - Cause : Hybridation avec cultures
  
  - **Nicotiana rustica 'Variété cérémonielle Iroquois'**
    - Dernière culture : ~1900
    - Profil : Nicotine + alcaloïdes spécifiques
    - Cause : Interdiction, perte culturelle
  
  - **Cannabis indica 'Hindu Kush Landrace'**
    - Dernière culture pure : ~1970
    - Profil : Myrcène/caryophyllène ancestral
    - Cause : Hybridation commerciale

#### Après-midi (3h)
- [ ] Créer les entrées de variétés disparues
  - Utiliser la table `plant_varieties`
  - Statut : `extinct` ou `extinct_in_wild`
  - Documenter les causes de disparition
  - Ajouter les tentatives de reconstruction si existantes
  - Lier aux plantes parentes

- [ ] Créer les relations généalogiques
  - Utiliser la table `variety_genealogy`
  - Documenter les lignées connues
  - Marquer les chaînons manquants

#### Soir (1h)
- [ ] Créer la documentation utilisateur
  - Guide d'utilisation des nouvelles pages
  - Explication des statuts IUCN/CITES
  - Glossaire des termes de conservation
- [ ] Créer le checkpoint de fin de journée

**Livrables Jour 9** : 5 variétés disparues documentées, guide utilisateur

---

## 📅 JOUR 10 - Mercredi 15 janvier 2026

### Objectif : Tests, validation et livraison

#### Matin (3h)
- [ ] Tests complets du système
  - Tester toutes les nouvelles pages (Patrimoine menacé, Archives)
  - Tester les filtres et recherches
  - Tester les liens entre pages
  - Tester le responsive mobile
  - Vérifier les performances (chargement)

- [ ] Écrire les tests unitaires manquants
  - Tests pour les procédures tRPC
  - Tests pour les imports de données
  - Tests pour les composants React
  - Objectif : >80% de couverture pour le nouveau code

#### Après-midi (2h)
- [ ] Valider l'intégrité des données
  - Vérifier les 7 plantes historiques importées
  - Vérifier les 19 espèces menacées avec statuts
  - Vérifier les 5 variétés disparues
  - Vérifier les marqueurs civilisationnels
  - Vérifier les liens et relations

- [ ] Corriger les bugs identifiés
  - Fixer les problèmes de performance
  - Corriger les erreurs d'affichage
  - Valider les données incohérentes

#### Soir (2h)
- [ ] Créer le checkpoint final
  - `webdev_save_checkpoint`
  - Description : "Système de conservation du patrimoine olfactif - Phase 1"
  - Inclure toutes les modifications des 10 jours

- [ ] Préparer la présentation pour l'utilisateur
  - Récapitulatif des fonctionnalités livrées
  - Démonstration des nouvelles pages
  - Liste des données importées
  - Prochaines étapes suggérées

- [ ] Livrer le système à l'utilisateur
  - Message de livraison avec captures d'écran
  - Lien vers le checkpoint
  - Documentation utilisateur
  - Roadmap pour les prochaines phases

**Livrables Jour 10** : Système testé, validé et livré avec checkpoint

---

## 📊 RÉCAPITULATIF DES LIVRABLES (10 JOURS)

### Base de données
- ✅ 3 nouvelles tables (olfactive_archives, civilizational_markers, variety_genealogy)
- ✅ 7 nouveaux champs de conservation dans plants
- ✅ Procédures tRPC complètes pour toutes les tables

### Données importées
- ✅ 7 plantes historiques (myrrhe + 6 espèces Boswellia)
- ✅ 19 espèces menacées avec statuts IUCN/CITES
- ✅ 5 variétés disparues documentées
- ✅ Marqueurs civilisationnels pour 3 plantes majeures
- ✅ Propriétés thérapeutiques enrichies

### Interfaces
- ✅ Page "Patrimoine menacé" avec filtres et carte
- ✅ Page "Archives olfactives" avec timeline
- ✅ Onglet "Histoire" dans les fiches plantes
- ✅ Onglet "Conservation" dans les fiches plantes
- ✅ Enrichissement des fiches existantes

### Documentation
- ✅ Guide utilisateur
- ✅ Glossaire de conservation
- ✅ Tests unitaires (>80% couverture)
- ✅ Checkpoint final

---

## 🎯 MÉTRIQUES DE SUCCÈS

### Quantitatives
- 3 nouvelles tables créées ✓
- 7 nouveaux champs ajoutés ✓
- 31 plantes/variétés importées (7 + 19 + 5) ✓
- 2 nouvelles pages créées ✓
- 2 onglets ajoutés aux fiches ✓
- >80% couverture de tests ✓

### Qualitatives
- Stabilité du système (0 crash) ✓
- Performance acceptable (<2s chargement) ✓
- Responsive mobile fonctionnel ✓
- Documentation claire et complète ✓
- Données scientifiquement validées ✓

---

## 🚀 PROCHAINES PHASES (APRÈS JOUR 10)

### Phase 2 (Jours 11-20) : Généalogie avancée
- Arbre généalogique interactif (visualisation D3.js)
- Import de 20+ variétés disparues supplémentaires
- Reconstruction de lignées perdues
- Interface de comparaison moléculaire ancien/moderne

### Phase 3 (Jours 21-30) : Fil d'Ariane limbique
- Table `olfactive_memories` (associations personnelles)
- Carte limbique interactive
- Profils olfactifs individuels
- Navigation par émotion et mémoire

### Phase 4 (Jours 31-40) : Archéologie olfactive
- Reconstruction de parfums antiques
- Analyse de résidus archéologiques
- Comparaison avec formules modernes
- Certification d'authenticité

---

## ⚠️ RISQUES ET MITIGATION

### Risques techniques
- **Migration de schéma** : Tester sur copie de base avant production
- **Performance** : Indexer les champs de recherche fréquents
- **Compatibilité mobile** : Tester sur vrais appareils

### Risques de données
- **Qualité des sources** : Valider avec références scientifiques
- **Incohérences** : Scripts de validation automatique
- **Données manquantes** : Marquer explicitement (NULL vs "inconnu")

### Risques de planning
- **Retards** : Buffer de 1 jour intégré (Jour 10 flexible)
- **Bugs bloquants** : Rollback possible via checkpoints quotidiens
- **Scope creep** : Respecter strictement la roadmap, noter les idées pour phases futures

---

## 📝 NOTES IMPORTANTES

1. **Pas de précipitation** : Si un jour prend du retard, décaler le planning plutôt que bâcler
2. **Checkpoints quotidiens** : Sauvegarder chaque soir pour pouvoir revenir en arrière
3. **Tests continus** : Tester au fur et à mesure, pas seulement le Jour 10
4. **Documentation au fil de l'eau** : Documenter pendant le développement, pas après
5. **Communication** : Informer l'utilisateur des progrès quotidiens

---

**Début de la roadmap** : 06 janvier 2026  
**Fin de la roadmap** : 15 janvier 2026  
**Durée** : 10 jours  
**Effort estimé** : ~70 heures  
**Checkpoint final** : 15 janvier 2026 au soir
