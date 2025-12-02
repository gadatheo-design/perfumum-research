# PERFUMUM Research - Intégration Manuel Technique (Phases 2-5)

## ✅ PHASE 1: Intégration des données fondamentales (TERMINÉE)
- [x] 4 familles chimiques
- [x] 19 molécules
- [x] 5 tabacs alchimiques
- [x] 20 accords expérimentaux
- [x] 18 échelles sensorielles ABSORBE

---

## 🔄 PHASE 2: Tables de relations entre entités

### Relations molécules ↔ familles chimiques
- [x] Créer les relations entre les 19 nouvelles molécules et leurs familles chimiques
- [x] Valider les associations

### Relations tabacs ↔ installations
- [x] Associer les 5 tabacs alchimiques aux installations correspondantes
- [x] Créer les liens dans la table `tobacco_formula_installations` - 9 relations créées

### Relations accords expérimentaux ↔ civilisations
- [x] Identifier les correspondances entre accords et civilisations
- [x] Créer les liens dans la table `experimental_accord_civilisations` - 44 relations créées

### Validation
- [x] Vérifier l'intégrité de toutes les relations créées - 72 relations totales
- [ ] Créer un checkpoint de sécuritélles olfactives dominantes
- [ ] Documenter les profils sensoriels

---

## PHASE 3: Connexion avec données existantes

### Prototypes C1-C4 ↔ Familles chimiques
- [ ] Analyser la composition chimique de chaque prototype
- [ ] Créer les liens avec les familles chimiques pertinentes

### Prototypes C1-C4 ↔ Tabacs alchimiques
- [ ] Identifier quels tabacs alchimiques sont utilisés dans quels prototypes
- [ ] Documenter les applications pratiques

### Accords existants ↔ Accords expérimentaux
- [ ] Comparer les 19 accords existants avec les 20 accords expérimentaux
- [ ] Identifier les similitudes et différences
- [ ] Fusionner ou distinguer selon pertinence

### Pétrichor/Volcanique ↔ Accords expérimentaux
- [ ] Relier les variations Pétrichor aux accords "Terre & Minéral"
- [ ] Relier les variations Volcanique aux accords "Soufré & Volcanique"

---

## PHASE 4: Combler les 8 lacunes identifiées

### 1. Glossaire unifié
- [ ] Créer une table `glossary` avec tous les termes techniques
- [ ] Importer les définitions depuis le manuel et arch_2.txt
- [ ] Ajouter les termes manquants

### 2. Protocoles de sécurité
- [ ] Créer une table `safety_protocols`
- [ ] Documenter les précautions pour chaque famille chimique
- [ ] Ajouter les fiches de sécurité des molécules

### 3. Calendrier de recherche décennal
- [ ] Créer une table `research_timeline`
- [ ] Définir les jalons 2025-2035
- [ ] Planifier les phases de développement

### 4. Visualisations de réseaux moléculaires
- [ ] Préparer les données pour graphes de relations
- [ ] Documenter les interactions moléculaires

### 5. Protocoles pour civilisations
- [ ] Créer des protocoles de reconstitution olfactive
- [ ] Lier aux accords signature de chaque civilisation

### 6. Liens installations ↔ prototypes
- [ ] Documenter quels prototypes sont utilisés dans quelles installations
- [ ] Créer les relations manquantes

### 7. Documentation des réactions thermiques
- [ ] Créer une table `thermal_reactions`
- [ ] Documenter fermentation, pyrolyse, oxydation
- [ ] Lier aux molécules et familles chimiques

### 8. Système d'appellation interne
- [ ] Documenter le système Climat/Texture/Âme
- [ ] Créer une table `naming_system`
- [ ] Appliquer aux entités existantes

---

## PHASE 5: Adaptation UX/UI et finalisation

### Pages de visualisation
- [ ] Page Familles Chimiques avec molécules associées
- [ ] Page Tabacs Alchimiques avec compositions interactives
- [ ] Page Accords Expérimentaux (standards vs extrêmes)
- [ ] Page Échelle Sensorielle ABSORBE avec visualisations

### Navigation et recherche
- [ ] Intégrer les nouvelles entités dans la recherche globale
- [ ] Ajouter les filtres appropriés
- [ ] Créer les liens de navigation entre entités

### Interface d'administration
- [ ] Formulaires pour tabacs alchimiques
- [ ] Formulaires pour accords expérimentaux
- [ ] Formulaires pour familles chimiques

### Tests et validation
- [ ] Tester toutes les relations
- [ ] Vérifier l'intégrité des données
- [ ] Valider les performances

### Checkpoint final
- [ ] Créer le checkpoint complet
- [ ] Documenter l'architecture finale
