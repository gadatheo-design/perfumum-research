CREATE TABLE `accord_civilisations` (
	`accordId` int NOT NULL,
	`civilisationId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `accords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`familyId` int,
	`aromaticProfile` text,
	`texture` enum('sec','humide','lactone','resine','pierre','air'),
	`description` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `civilisations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`region` varchar(255),
	`symbolicMaterials` text,
	`signatureAccordId` int,
	`longDescription` text,
	`temporality` enum('archaic','antique','medieval','abyssal','futuristic'),
	`bibliographicReferences` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `civilisations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `families` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('perfumeum12','biomineralis','petrichor','volcanique','solarmineralis','necrogeo','other') NOT NULL,
	`description` text,
	`variationCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `families_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `installation_families` (
	`installationId` int NOT NULL,
	`familyId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `installation_recettes` (
	`installationId` int NOT NULL,
	`recetteId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `installations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`concept` text,
	`materials` text,
	`diffusionMode` enum('cones','brume','plaque_chauffee','eau','friction'),
	`location` varchar(255),
	`date` timestamp,
	`documentation` text,
	`visitorExperience` text,
	`theoreticalScope` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `installations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laboratoire` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`botanicalName` varchar(255),
	`type` enum('huile_essentielle','absolu','resinoid','concrete','co2','teinture','poudre','alcoolat','autre') NOT NULL,
	`olfactiveFamily` text,
	`note` enum('tete','coeur','fond','tete_coeur','coeur_fond'),
	`origin` varchar(255),
	`extractionMethod` enum('distillation','extraction_solvant','co2_supercritique','expression','teinture','autre'),
	`olfactiveProfile` text,
	`character` text,
	`supplier` varchar(255),
	`pricePerMl` int,
	`stock` int,
	`purchaseDate` timestamp,
	`status` enum('en_stock','a_commander','epuise') DEFAULT 'en_stock',
	`technicalNotes` text,
	`manipulationNotes` text,
	`maxTemperature` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `laboratoire_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laboratoire_molecules` (
	`laboratoireId` int NOT NULL,
	`moleculeId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `laboratoire_recettes` (
	`laboratoireId` int NOT NULL,
	`recetteId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `molecule_accords` (
	`moleculeId` int NOT NULL,
	`accordId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `molecule_families` (
	`moleculeId` int NOT NULL,
	`familyId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `molecule_recettes` (
	`moleculeId` int NOT NULL,
	`recetteId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `molecules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`chemicalFamily` enum('terpene','sesquiterpene','aldehyde','alcohol','resinoid','lactone','mineral','pyrolysate','phenol','ester','other') NOT NULL,
	`olfactiveProfile` text,
	`functionalEffect` enum('cold','humidity','sun','veil','darkness','ionization','fermentation','anchoring','sacred','energizing','sedative'),
	`threshold` varchar(50),
	`toxicityRemarks` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `molecules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `petrichor` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variation` varchar(255) NOT NULL,
	`subfamily` enum('clair','noir','argile','bois_humide','racine','mousse','desert','marin','glaciaire','urbain','sacre') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `petrichor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `petrichor_molecules` (
	`petrichorId` int NOT NULL,
	`moleculeId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `petrichor_recettes` (
	`petrichorId` int NOT NULL,
	`recetteId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `petrichor_tabacs` (
	`petrichorId` int NOT NULL,
	`tabacId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prototype_laboratoire` (
	`prototypeId` int NOT NULL,
	`laboratoireId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prototype_molecules` (
	`prototypeId` int NOT NULL,
	`moleculeId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prototypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`emoji` varchar(10),
	`conceptualAxis` text,
	`sensoryForm` text,
	`olfactiveFamily` text,
	`preferredSupport` varchar(100),
	`keyEmotion` text,
	`overview` text,
	`composition` text,
	`conceptualReflection` text,
	`installation` text,
	`technicalDevelopment` text,
	`theoreticalScope` text,
	`color` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prototypes_id` PRIMARY KEY(`id`),
	CONSTRAINT `prototypes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `recettes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('tabac','resine','cone','parfum','encens','extrait') NOT NULL,
	`familyId` int,
	`accordId` int,
	`tabacId` int,
	`civilisationId` int,
	`formula` text,
	`protocol` text,
	`intensity` int,
	`stability` enum('low','medium','high'),
	`combustionTemperature` int,
	`maturationTime` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recettes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tabac_accords` (
	`tabacId` int NOT NULL,
	`accordId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tabac_civilisations` (
	`tabacId` int NOT NULL,
	`civilisationId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tabac_molecules` (
	`tabacId` int NOT NULL,
	`moleculeId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tabacs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('blond','brun','oriental','experimental') NOT NULL,
	`origin` varchar(255),
	`aromaticProfile` text,
	`intensity` int,
	`idealTemperature` int,
	`internalNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tabacs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `volcanique` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variation` varchar(255) NOT NULL,
	`type` enum('basalte_chaud','basalte_froid','vapeur','soufre','poussiere_tectonique','magma_blanc','pierre_poreuse') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `volcanique_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `volcanique_molecules` (
	`volcaniqueId` int NOT NULL,
	`moleculeId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `volcanique_recettes` (
	`volcaniqueId` int NOT NULL,
	`recetteId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `volcanique_tabacs` (
	`volcaniqueId` int NOT NULL,
	`tabacId` int NOT NULL
);
--> statement-breakpoint
ALTER TABLE `accord_civilisations` ADD CONSTRAINT `accord_civilisations_accordId_accords_id_fk` FOREIGN KEY (`accordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `accord_civilisations` ADD CONSTRAINT `accord_civilisations_civilisationId_civilisations_id_fk` FOREIGN KEY (`civilisationId`) REFERENCES `civilisations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `accords` ADD CONSTRAINT `accords_familyId_families_id_fk` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `civilisations` ADD CONSTRAINT `civilisations_signatureAccordId_accords_id_fk` FOREIGN KEY (`signatureAccordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_families` ADD CONSTRAINT `installation_families_installationId_installations_id_fk` FOREIGN KEY (`installationId`) REFERENCES `installations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_families` ADD CONSTRAINT `installation_families_familyId_families_id_fk` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_recettes` ADD CONSTRAINT `installation_recettes_installationId_installations_id_fk` FOREIGN KEY (`installationId`) REFERENCES `installations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_recettes` ADD CONSTRAINT `installation_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_molecules` ADD CONSTRAINT `laboratoire_molecules_laboratoireId_laboratoire_id_fk` FOREIGN KEY (`laboratoireId`) REFERENCES `laboratoire`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_molecules` ADD CONSTRAINT `laboratoire_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_recettes` ADD CONSTRAINT `laboratoire_recettes_laboratoireId_laboratoire_id_fk` FOREIGN KEY (`laboratoireId`) REFERENCES `laboratoire`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_recettes` ADD CONSTRAINT `laboratoire_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_accords` ADD CONSTRAINT `molecule_accords_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_accords` ADD CONSTRAINT `molecule_accords_accordId_accords_id_fk` FOREIGN KEY (`accordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_families` ADD CONSTRAINT `molecule_families_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_families` ADD CONSTRAINT `molecule_families_familyId_families_id_fk` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_recettes` ADD CONSTRAINT `molecule_recettes_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_recettes` ADD CONSTRAINT `molecule_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_molecules` ADD CONSTRAINT `petrichor_molecules_petrichorId_petrichor_id_fk` FOREIGN KEY (`petrichorId`) REFERENCES `petrichor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_molecules` ADD CONSTRAINT `petrichor_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_recettes` ADD CONSTRAINT `petrichor_recettes_petrichorId_petrichor_id_fk` FOREIGN KEY (`petrichorId`) REFERENCES `petrichor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_recettes` ADD CONSTRAINT `petrichor_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_tabacs` ADD CONSTRAINT `petrichor_tabacs_petrichorId_petrichor_id_fk` FOREIGN KEY (`petrichorId`) REFERENCES `petrichor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_tabacs` ADD CONSTRAINT `petrichor_tabacs_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_laboratoire` ADD CONSTRAINT `prototype_laboratoire_prototypeId_prototypes_id_fk` FOREIGN KEY (`prototypeId`) REFERENCES `prototypes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_laboratoire` ADD CONSTRAINT `prototype_laboratoire_laboratoireId_laboratoire_id_fk` FOREIGN KEY (`laboratoireId`) REFERENCES `laboratoire`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_molecules` ADD CONSTRAINT `prototype_molecules_prototypeId_prototypes_id_fk` FOREIGN KEY (`prototypeId`) REFERENCES `prototypes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_molecules` ADD CONSTRAINT `prototype_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recettes` ADD CONSTRAINT `recettes_familyId_families_id_fk` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recettes` ADD CONSTRAINT `recettes_accordId_accords_id_fk` FOREIGN KEY (`accordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recettes` ADD CONSTRAINT `recettes_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recettes` ADD CONSTRAINT `recettes_civilisationId_civilisations_id_fk` FOREIGN KEY (`civilisationId`) REFERENCES `civilisations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_accords` ADD CONSTRAINT `tabac_accords_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_accords` ADD CONSTRAINT `tabac_accords_accordId_accords_id_fk` FOREIGN KEY (`accordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_civilisations` ADD CONSTRAINT `tabac_civilisations_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_civilisations` ADD CONSTRAINT `tabac_civilisations_civilisationId_civilisations_id_fk` FOREIGN KEY (`civilisationId`) REFERENCES `civilisations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_molecules` ADD CONSTRAINT `tabac_molecules_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_molecules` ADD CONSTRAINT `tabac_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_molecules` ADD CONSTRAINT `volcanique_molecules_volcaniqueId_volcanique_id_fk` FOREIGN KEY (`volcaniqueId`) REFERENCES `volcanique`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_molecules` ADD CONSTRAINT `volcanique_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_recettes` ADD CONSTRAINT `volcanique_recettes_volcaniqueId_volcanique_id_fk` FOREIGN KEY (`volcaniqueId`) REFERENCES `volcanique`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_recettes` ADD CONSTRAINT `volcanique_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_tabacs` ADD CONSTRAINT `volcanique_tabacs_volcaniqueId_volcanique_id_fk` FOREIGN KEY (`volcaniqueId`) REFERENCES `volcanique`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_tabacs` ADD CONSTRAINT `volcanique_tabacs_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;