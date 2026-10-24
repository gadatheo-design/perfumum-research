# Contrôle public direct — 24 octobre 2026

Contrôle de lecture, sans connexion, soumission ou mutation. Il complète l’audit statique et MySQL ; il n’est pas un audit exhaustif de l’application.

## Accueil et endpoint de lecture

https://perfumum-h2pjhhjb.manus.space/ a été ouvert dans le navigateur. À l’état initial, le hero affichait les replis 808 molécules et 476 recettes. Après chargement, il affichait 7 473 molécules et 492 recettes. Les comptes de bas de page étaient 7 473 molécules, 3 782 plantes, 93 terroirs, 631 matières premières, 492 recettes et 32 accords. Un GET public de https://perfumum-h2pjhhjb.manus.space/api/trpc/dashboard.getStats a répondu HTTP 200 et les mêmes comptes, avec 4 prototypes et 70 civilisations/traditions.

La carte Créateur conserve 234 recettes alors que le total chargé est 492. L’accueil utilise aussi 26 traditions dans certains textes, alors que le pied affiche 70 traditions. Cette divergence de périmètre doit être expliquée, pas arbitrairement normalisée.

L’accueil affichait « 1 814 plantes géolocalisées » dans la section de zones Köppen. L’audit vivant relève 1 812 plantes avec Köppen et 123 paires GPS valides. Ces objets ne sont pas équivalents. L’écart 1 814/1 812 entre rendu et audit est constaté ; sa cause n’a pas été examinée et ne doit pas être attribuée au cache ou à un bug spécifique sans investigation.

## Hub des visualisations

https://perfumum-h2pjhhjb.manus.space/visualisations a été ouvert. Le hub annonce 40 entrées réparties en graphes, cartes, diagrammes/heatmaps, radars, timelines, ontologie et comparaisons. Cette navigation existe ; sa présence ne valide pas les données de chaque vue. Des liens publics conduisent aussi à des routes /admin/ qui peuvent exiger des droits.

Un double en-tête et un double pied de page sont directement présents dans le DOM et le rendu inspectés du hub. Rien n’a été corrigé : une nouvelle interface n’est pas autorisée dans cette phase.

## Limites

Deux pages inspectées, un endpoint GET de lecture contrôlé. Les 40 visualisations n’ont pas été exécutées, aucun endpoint de mutation n’a été appelé et aucune session admin n’a été utilisée. Le contrôle n’établit ni accessibilité complète, ni responsive mobile, ni performance, ni sécurité. Le type de données de p5data.gcms provient de la lecture de son code dans l’audit, pas d’une mesure d’instrument.
