# Architecture et matériaux — laboratoire de visualisation autonome

**Auteur : Manus AI**  
**Date de vérification : 24 octobre 2026**

Le laboratoire doit d’abord produire des expériences reproductibles depuis le Mac, à partir de copies locales et datées des données PERFUMUM. Une installation n’est pas le point de départ : elle devient un second moteur de rendu, alimenté par les mêmes corpus et règles. Cette distinction évite que l’apparence d’une projection fasse oublier ce que les données établissent, ce qu’elles suggèrent, et ce qui relève d’une règle plastique.

## Choix minimal : navigateur local, D3 et p5.js

Le noyau recommandé est un dossier local autonome ouvert dans un navigateur, sans appel à l’API de production : HTML, bibliothèques conservées avec le projet, import explicite de fichier et répertoire d’expériences. p5.js fournit un champ de fichier, lit JSON/CSV et sauvegarde JSON, tables ou images ; `saveCanvas` documente PNG, WebP et JPEG. [1] [2] Il convient au canevas génératif, au mouvement et aux superpositions. Ne pas lui attribuer un export SVG ou MP4 natif : séquence d’images ou captation sont des sorties distinctes.

D3.js est le complément, non le concurrent de p5 : sa jointure attache les données aux éléments du DOM et gère entrées, mises à jour et sorties. [3] C’est le point de départ des cartes relationnelles, timelines, matrices d’incertitude, légendes et SVG. Le SVG, éditable et imprimable, est préférable aux pixels quand relations, sources et niveaux de preuve doivent rester examinables. p5 intervient quand la même sélection devient trace, densité ou lumière animée.

Three.js/WebGL ne doit être ajouté que sous condition. Son `WebGLRenderer` rend une scène avec caméra dans un canvas WebGL 2. [4] Il a une valeur pour une structure volumique dérivée d’une règle — distribution moléculaire en nuage de points, objet ajouré — et un changement de point de vue. Il est prématuré pour liens bibliographiques, texte, catégories ou relations incertaines : la profondeur décorative suggérerait une mesure spatiale inexistante. **D3 sert la structure explicative, p5 le comportement visuel, Three une géométrie 3D justifiée.**

Processing est une alternative pédagogique pour des esquisses Java : il peut exporter une application macOS, des séquences d’images et des PDF vectoriels. [5] Dans ce laboratoire HTML local, il ferait double emploi avec p5 ; le réserver à une application autonome. Python est l’atelier de préparation déterministe : CSV, JSON, `pathlib` et SQLite suffisent à filtrer, contrôler les identifiants, produire les sous-corpus et journaliser une transformation. [6] Matplotlib peut rendre une planche ou une animation, sans devenir une seconde interface. [7]

## Paquet reproductible et hors ligne

Chaque expérience doit avoir un dossier daté et immuable après export, contenant :

- `corpus.json` ou CSV : seules les entités et relations sélectionnées ; chaque relation conserve son identifiant source, son type de preuve et son statut — observé, documenté, interprété, hypothèse ou calculé ;
- `manifest.json` : date d’export, identifiant/version de corpus, liste des fichiers, empreinte cryptographique, comptages et éventuelles exclusions ;
- `config.json` : filtres, correspondances visuelles, palette, dimensions de rendu, unités, seuils, angles de caméra et réglages choisis ;
- `seed.txt` : graine pseudo-aléatoire qui permet de rejouer une forme générative ;
- `provenance.json` : origine de chaque sortie, versions des bibliothèques, auteur, horodatage, fichier de données et configuration effectivement utilisés ;
- `exports/` : SVG, PNG, séquence d’images ou vidéo, et éventuellement `.glb`.

L’import est un geste volontaire de fichier, jamais une synchronisation silencieuse. La page affiche nom, date et statut de preuve du corpus. Manifeste et seed ne valident pas scientifiquement une forme : ils permettent de retrouver l’export et la règle qui l’ont produite.

Les sorties doivent rester adaptées au médium. D3 produit le SVG de référence pour impression, découpe ou transparents. p5 produit une image raster documentée, et une suite d’images pour une animation ; la suite peut ensuite être encodée en vidéo avec un outil de postproduction choisi et déclaré dans la provenance. Three possède un exporteur glTF 2.0 : il peut produire `.gltf` JSON ou `.glb` binaire et inclure scènes, maillages, matériaux, textures, caméras et animations selon les options. [8] Blender traite glTF comme un format de transmission vers le web et des applications natives ; son import/export couvre notamment maillages, matériaux, textures, caméras, lumières et certains types d’animation. [9] Le glTF est donc une sortie d’objet/scène, non l’équivalent d’une projection ou d’un dossier de recherche.

## Du prototype web à TouchDesigner : trois transferts, aucune importation magique

TouchDesigner reste facultatif, pour projection, masques ou entrée matérielle temps réel. Son interopérabilité liste vidéos, glTF, OSC, WebSockets, MQTT et calibration, sans rendre les langages interchangeables. [10] Un sketch p5.js ne s’importe pas automatiquement comme réseau TouchDesigner modifiable : aucune conversion de code, état ou interaction n’est à présumer.

Le premier transfert est une **captation** : PNG, séquence d’images, ou MOV/MP4 devient texture ou film. Il préserve l’apparence, pas les données sélectionnées ni la règle. Movie File Out de TouchDesigner sait enregistrer des films, images uniques ou séquences, avec notamment H.264/H.265, ProRes, Hap et EXR ; l’encodage H.264/H.265/AV1 est soumis à la licence indiquée par Derivative. [11] C’est la voie robuste pour rejouer une animation p5 à l’échelle d’une projection.

Le second est un **transfert de paramètres** : le navigateur garde sa navigation et envoie seulement des valeurs nommées — par exemple `relation_type`, `evidence_level`, `seed`, vitesse, présence binaire — que TouchDesigner interprète dans sa propre composition. OSC est adapté à ces paramètres ponctuels ou continus : c’est une spécification de messages temps réel, légère et à adressage libre ; l’OSC In CHOP de TouchDesigner reçoit ces messages via UDP et peut mettre en file les données. [12] [13] Ce transfert préserve l’intention de contrôle, non l’image : le rendu TouchDesigner est une nouvelle interprétation, à documenter.

Le troisième est un **transfert d’assets** : SVG statique, image, séquence, modèle glTF/GLB et textures. TouchDesigner liste glTF parmi ses formats de scène 3D ; Blender peut servir à examiner, simplifier ou matérialiser le modèle entre les deux. [9] [10] Il faut tester un fichier représentatif sur la version utilisée, car un matériau de navigateur, un shader p5 ou un détail de glTF ne se traduit pas nécessairement à l’identique.

WebSocket sert seulement à l’échange bidirectionnel navigateur–serveur local. [14] TouchDesigner possède un DAT correspondant. [15] MQTT convient plus tard à plusieurs ESP32 et ordinateurs : ce protocole léger publication/abonnement implique néanmoins courtier, sujets, droits et reprise. [16] [17] MIDI USB est plus simple pour un contrôleur local : une Arduino à USB natif peut apparaître comme périphérique MIDI. [18] [19] Choisir **un seul** protocole : OSC pour Mac–TouchDesigner, MIDI pour un contrôleur connecté, MQTT pour plusieurs objets réseau, WebSocket pour une interface web bidirectionnelle.

Sur macOS, l’étude doit tenir compte des limites actuelles de TouchDesigner : la version officielle disponible au moment de la vérification est 2025.33230 ; elle demande macOS 13 minimum et recommande un Mac Apple Silicon de 2020 ou plus récent. Un Mac Intel requiert un GPU AMD discret. [20] La licence Non-Commercial est gratuite pour apprentissage/personnel et limitée à 1280 × 1280 ; elle ne convient pas à un projet rémunéré. Les licences Commercial et Pro permettent une résolution limitée par le GPU, tandis que la Pro seule inclut notamment synchronisation multi-systèmes, frame-lock matériel et certaines intégrations de tracking/calibration. [21] Il s’agit d’une contrainte de scénario, non d’une recommandation d’achat : toute décision de licence doit être prise séparément, selon le statut réel du projet.

## Projection, objets et présence : calibrer ce qui existe

Un écran est une sortie directe. Un mur, angle, niche ou objet fixe exige canvas à la résolution du projecteur, repères, masque et calibration enregistrée. Kantan Mapper définit des polygones 2D ou contours Bézier, y affecte une texture et les utilise comme formes ou masques ; sa résolution doit correspondre à celle du ou des projecteurs. [22] Cette cartographie ne vaut qu’à un instant donné.

Un objet manipulable peut recevoir une projection tant qu’il revient sur un gabarit et que la calibration est refaite après déplacement. Sans caméra de profondeur, marqueurs, système de tracking et protocole de validation, il ne faut revendiquer ni position, ni silhouette, ni suivi de visiteur. De même, un capteur de présence n’indique au départ qu’un événement ou un état de zone : « quelqu’un est détecté », pas qui, où exactement ni comment il se déplace. Le premier geste juste est donc un bouton, un interrupteur au pied, une pression, ou un capteur binaire placé et testé ; Arduino/ESP32 n’arrivent qu’après la définition du comportement recherché.

## Matières optiques, effets réels et sécurité

Pour une première recherche visuelle, préférer les sources visibles : projecteur, LED visible diffuse, rétroéclairage, gélatine ou filtre coloré, papier translucide, miroir, surface texturée et film dichroïque. Elles permettent d’étudier opacité, superposition, ombre, diffraction apparente et changement d’angle sans faire de l’UV ou du laser un prérequis. Un séparateur dichroïque repose sur un revêtement diélectrique dont réflexion/transmission dépendent fortement de la longueur d’onde, et parfois de l’angle/polarisation ; il peut séparer des régions spectrales, mais sa plage et son comportement doivent être vérifiés sur la fiche du matériau effectivement utilisé. [23]

Ne pas confondre luminescences. La fluorescence n’émet que tant que l’énergie externe est fournie ; la phosphorescence absorbe puis réémet lentement après extinction. [24] Tester ces temporalités dans l’obscurité avec le matériau réel. L’UV ajoute un risque oculaire et cutané ; OSHA signale notamment les effets de l’UV-A et le caractère particulièrement nocif de l’UV-B pour la peau. [25] Toute recherche UV impose l’identification de la source, du rayonnement accessible, de l’exposition et des protections ; jamais de source non caractérisée.

Le laser n’est pas nécessaire à ce programme. La FDA indique qu’un 3R peut être dangereux à la vision directe et que les classes 3B et 4 présentent un danger immédiat pour l’œil ; la classe 4 comporte aussi un risque de peau et d’incendie. [26] Les règles américaines sur les spectacles ne sont pas une autorisation locale : elles illustrent au contraire la nécessité de qualification, de contrôles d’ingénierie et de procédures. Écarter les lasers du laboratoire initial. Si cette piste est un jour réexaminée, elle devra être conçue avec un responsable compétent en sécurité laser, une analyse de risque propre au lieu, des interverrouillages et le droit applicable — jamais avec un faisceau accessible au public.

Une caustique **physique** est une concentration de lumière réellement formée par réflexion ou réfraction d’un objet transparent, réfléchissant ou ondulé : sa forme dépend de la source, des matériaux, de leurs défauts et de la position. Une caustique **calculée** est un rendu : Blender/Cycles peut la simuler par tracé de rayons, mais sa documentation précise que les caustiques réfléchies et réfractées peuvent exiger beaucoup d’échantillons et devenir trop bruitées. [27] Un shader ou une vidéo de caustiques est une image contrôlable, non la preuve qu’un objet produira cet effet dans l’espace. Utiliser le rendu pour prévisualiser une intention ; utiliser la maquette éclairée pour constater le phénomène matériel.

## Quatre scénarios sans dimensions présupposées

**1. Atelier minimal — une question, une surface.** Comparer une carte SVG et sa version animée : relations en traits, incertitudes en pulsation. Mac, écran et projection facultative sur mur ou feuille translucide ; image p5/D3 enregistrée, puis masque TouchDesigner si nécessaire. Calibration aux quatre coins, matériaux simples et objets immobiles. Difficulté faible, temps court, budget minimal ; rendu, contraste et masques se simulent à l’écran. Compétences : import, composition 2D, manifeste et réglage élémentaire.

**2. Atelier spatial — une donnée, plusieurs matérialités.** Mur pour la structure SVG, calque ou seconde surface pour la temporalité p5, objet fixe ou feuille ajourée pour une texture. Version sobre : une projection déplacée entre essais ; version ambitieuse : plusieurs sorties et mapping. Risques : alignement, ombres, couleur réelle et lisibilité sur relief. Conserver une calibration et photographier l’état avec l’identifiant du corpus. Temps et budget moyens, difficulté moyenne. Blender prévoit silhouette et ombres ; transparence, diffusion et caustiques se testent matériellement. Compétences : composition multi-couche, masques et gestion de couleur.

**3. Laboratoire interactif — présence déclarée, pas tracking inventé.** Une présence déclenche lentement couche de sources, seed ou transition de densité vers relations. Écran, mur et objet fixe ont des rôles distincts. Version sobre : bouton ou capteur binaire, MIDI USB ou OSC ; version ambitieuse : microcontrôleur et journal d’événements. Aucun geste, trajectoire ou identité sans démonstration mesurée. Prévoir zones masquées et comportement face à un capteur silencieux ou instable. Temps, budget et compétences moyens à élevés pour fiabilité, câblage, faux positifs et sûreté ; simuler l’état avant le branchement.

**4. Installation distribuée — une même expérience, plusieurs lectures.** Répartir une sélection : preuves et textes sur une surface, transformation sur une autre, trace historique ou absence documentaire sur une troisième. Les transitions visuelles ne rendent pas les murs continus. Version sobre : boucle vidéo depuis un ordinateur ; version ambitieuse : sorties multiples et synchronisation explicite. TouchDesigner Pro documente synchronisation multi-systèmes et frame-lock, sans que cela soit requis ici. [21] Risques : dérive temporelle, colorimétrie, recouvrements et ombres. Temps et budget élevés ; simuler d’abord une planche puis une vidéo composite identifiant chaque surface.

La trajectoire proposée est progressive : commencer par un corpus exporté, une visualisation D3 auditable et une version p5 avec seed ; produire ensuite une sortie imprimée ou projetée ; n’introduire TouchDesigner et un seul protocole de contrôle qu’après avoir démontré ce que le passage spatial révèle réellement. Cette architecture préserve l’autonomie de recherche, maintient une provenance révisable et évite de faire de l’équipement une réponse avant que la question PERFUMUM soit formulée.

## Références

[1]: https://p5js.org/reference/ "Référence p5.js"
[2]: https://p5js.org/reference/p5/saveCanvas/ "p5.js saveCanvas"
[3]: https://d3js.org/d3-selection/joining "D3 Joining data"
[4]: https://threejs.org/docs/pages/WebGLRenderer.html "Three.js WebGLRenderer"
[5]: https://processing.org/tutorials/overview "Processing Overview"
[6]: https://docs.python.org/3/library/index.html "Bibliothèque standard Python"
[7]: https://matplotlib.org/stable/users/explain/animations/animations.html "Matplotlib Animations"
[8]: https://threejs.org/docs/pages/GLTFExporter.html "Three.js GLTFExporter"
[9]: https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html "Blender glTF 2.0"
[10]: https://docs.derivative.ca/Interoperability "TouchDesigner Interoperability"
[11]: https://docs.derivative.ca/Movie_File_Out_TOP "TouchDesigner Movie File Out TOP"
[12]: https://cnmat.berkeley.edu/research/projects/osc "CNMAT Open Sound Control"
[13]: https://docs.derivative.ca/OSC_In_CHOP "TouchDesigner OSC In CHOP"
[14]: https://www.rfc-editor.org/rfc/rfc6455 "RFC 6455 WebSocket Protocol"
[15]: https://docs.derivative.ca/WebSocket_DAT "TouchDesigner WebSocket DAT"
[16]: https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html "OASIS MQTT Version 5.0"
[17]: https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/protocols/mqtt.html "ESP-MQTT ESP32"
[18]: https://docs.arduino.cc/libraries/midiusb "Arduino MIDIUSB"
[19]: https://midi.org/about-midi-part-3midi-messages "MIDI Messages"
[20]: https://derivative.ca/download "TouchDesigner Download et exigences macOS"
[21]: https://derivative.ca/UserGuide/Licensing "TouchDesigner Licensing"
[22]: https://docs.derivative.ca/Palette:kantanMapper "TouchDesigner Kantan Mapper"
[23]: https://www.rp-photonics.com/beam_splitters.html "RP Photonics Beam Splitters"
[24]: https://oceantoday.noaa.gov/fullmoon-light-it-up/ "NOAA Fluorescence et phosphorescence"
[25]: https://www.osha.gov/otm/section-3-health-hazards/chapter-6 "OSHA Laser and ultraviolet hazards"
[26]: https://www.fda.gov/radiation-emitting-products/home-business-and-entertainment-products/laser-products-and-instruments "FDA Laser Products and Instruments"
[27]: https://docs.blender.org/manual/en/latest/render/cycles/render_settings/light_paths.html "Blender Cycles Light Paths"
