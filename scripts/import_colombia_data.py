#!/usr/bin/env python3
"""
Script d'import des données ABSORBE·COLOMBIA
Parse le fichier Markdown et insère les données dans la base de données
"""

import os
import sys
import re
import json
from datetime import datetime
import mysql.connector
from mysql.connector import Error

# Configuration de la base de données depuis les variables d'environnement
DB_URL = os.getenv('DATABASE_URL', '')

def parse_database_url(url):
    """Parse la DATABASE_URL pour extraire les paramètres de connexion"""
    # Format: mysql://user:password@host:port/database?ssl={"rejectUnauthorized":true}
    pattern = r'mysql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)'
    match = re.match(pattern, url)
    if match:
        return {
            'user': match.group(1),
            'password': match.group(2),
            'host': match.group(3),
            'port': int(match.group(4)),
            'database': match.group(5),
            'ssl_ca': None,
            'ssl_disabled': False
        }
    return None

def connect_to_database():
    """Établit une connexion à la base de données"""
    db_config = parse_database_url(DB_URL)
    if not db_config:
        raise ValueError("DATABASE_URL invalide")
    
    try:
        connection = mysql.connector.connect(
            host=db_config['host'],
            port=db_config['port'],
            user=db_config['user'],
            password=db_config['password'],
            database=db_config['database'],
            ssl_verify_cert=False,
            ssl_verify_identity=False
        )
        print("✅ Connexion à la base de données réussie")
        return connection
    except Error as e:
        print(f"❌ Erreur de connexion : {e}")
        sys.exit(1)

def parse_colombia_file(filepath):
    """Parse le fichier ABSORBE·COLOMBIA.md"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    data = {
        'climate_studies': [],
        'molecular_protocols': []
    }
    
    # Parser les études climatiques
    # ÉTUDE I : Petrichor Andin
    petrichor_match = re.search(
        r'## ÉTUDE I : Petrichor Andin — Odeur de seuil\s+### 🗺️ CONTEXTE\s+- \*\*Zone\*\* : (.+?)\s+- \*\*Altitude\*\* : (.+?)\s+- \*\*Climat\*\* : (.+?)\s+- \*\*Moment clé\*\* : (.+?)\s+### 🌬️ DESCRIPTION SENSORIELLE\s+\*\*Attaque\*\*\s+(.+?)\s+\*\*Cœur\*\*\s+(.+?)\s+\*\*Fond\*\*\s+(.+?)\s+>',
        content,
        re.DOTALL
    )
    
    if petrichor_match:
        data['climate_studies'].append({
            'name': 'Petrichor Andin — Odeur de seuil',
            'collection': 'COLOMBIA · Humidity Studies',
            'axis': 'Petrichor',
            'concept': 'Odeurs situées liées à l\'humidité tropicale. Pas d\'exotisme. Pas de fétichisation de la matière. Traduction olfactive uniquement.',
            'zone': petrichor_match.group(1),
            'altitude': petrichor_match.group(2),
            'climate': petrichor_match.group(3),
            'key_moment': petrichor_match.group(4),
            'attack_description': petrichor_match.group(5).strip(),
            'heart_description': petrichor_match.group(6).strip(),
            'base_description': petrichor_match.group(7).strip(),
            'observed_supports': json.dumps(['pierre volcanique', 'terre tassée urbaine', 'feuilles larges humides', 'murs minéraux']),
            'absorbe_reading': 'Le petrichor andin n\'est pas une odeur de forêt, mais une odeur de transition : entre pluie et soleil, entre ville et montagne, entre corps chaud et air froid. Odeur de seuil, pas de refuge.',
            'threshold_odor': 'yes',
            'recommended_tests': json.dumps([
                {'name': 'Test A — Terre humide', 'description': 'Terre + alcool 95 %, 24–48 h, Filtration légère'},
                {'name': 'Test B — Pierre mouillée', 'description': 'Pierre propre + alcool, Agitation manuelle, Résultat très subtil (trace)'}
            ]),
            'head_translation': 'ozone / air froid',
            'heart_translation': 'minéral humide',
            'base_translation': 'poussière sèche',
            'ethical_position': 'Ce petrichor ne doit pas rassurer. Il doit ouvrir.',
            'status': 'lab_translation'
        })
    
    # ÉTUDE II : Feuilles après pluie
    feuilles_match = re.search(
        r'## ÉTUDE II : Feuilles après pluie\s+### Chlorophylle humide · Vapeur verte · Peau végétale\s+### 🗺️ CONTEXTE\s+- \*\*Zone\*\* : (.+?)\s+- \*\*Altitude\*\* : (.+?)\s+- \*\*Climat\*\* : (.+?)\s+- \*\*Moment clé\*\* : (.+?)\s+### 🌬️ DESCRIPTION SENSORIELLE\s+\*\*Attaque\*\*\s+(.+?)\s+\*\*Cœur\*\*\s+(.+?)\s+\*\*Fond\*\*\s+(.+?)\s+>',
        content,
        re.DOTALL
    )
    
    if feuilles_match:
        data['climate_studies'].append({
            'name': 'Feuilles après pluie — Chlorophylle humide',
            'collection': 'COLOMBIA · Humidity Studies',
            'axis': 'Feuilles après pluie',
            'concept': 'Chlorophylle humide · Vapeur verte · Peau végétale',
            'zone': feuilles_match.group(1),
            'altitude': feuilles_match.group(2),
            'climate': feuilles_match.group(3),
            'key_moment': feuilles_match.group(4),
            'attack_description': feuilles_match.group(5).strip(),
            'heart_description': feuilles_match.group(6).strip(),
            'base_description': feuilles_match.group(7).strip(),
            'observed_supports': json.dumps(['feuilles larges tropicales', 'herbes écrasées', 'haies urbaines après pluie', 'bordures de chemins']),
            'absorbe_reading': 'Les feuilles après pluie ne "sentent" pas : elles respirent. Ce n\'est pas une note verte abstraite, mais un moment physiologique : la plante relâche, l\'eau s\'évapore, l\'air devient conducteur. Odeur de surface, pas de profondeur. Odeur de présent immédiat.',
            'threshold_odor': 'no',
            'recommended_tests': json.dumps([
                {'name': 'Test A — Feuille fraîche (MCT)', 'description': 'feuille intacte, non froissée, immersion partielle MCT, 24 h max. Résultat attendu : vert doux, rond, très fidèle'},
                {'name': 'Test B — Feuille froissée (alcool)', 'description': 'feuille écrasée entre doigts, alcool 95 %, 12–24 h. Résultat attendu : plus agressif, amer, utile comme contraste'}
            ]),
            'head_translation': 'vapeur humide',
            'heart_translation': 'chlorophylle douce',
            'base_translation': 'peau végétale',
            'ethical_position': 'Traduire la feuille, sans la styliser. Cette odeur n\'est pas décorative. Elle est fonctionnelle : elle signale la vie en cours.',
            'status': 'field_observation'
        })
    
    # Parser les protocoles moléculaires
    # PROTOCOLE I : Petrichor Andin
    protocol1_match = re.search(
        r'## PROTOCOLE I : Petrichor Andin — Reconstruction olfactive\s+### OBJECTIF\s+(.+?)\s+### ARCHITECTURE OLFACTIVE\s+\*\*Axe principal\*\* : (.+?)\s+\*\*Fonction\*\* : (.+?)\s+',
        content,
        re.DOTALL
    )
    
    if protocol1_match:
        data['molecular_protocols'].append({
            'name': 'Petrichor Andin — Reconstruction olfactive',
            'linked_study_id': None,  # Sera lié après insertion
            'objective': protocol1_match.group(1).strip(),
            'olfactive_architecture': protocol1_match.group(2).strip(),
            'function': protocol1_match.group(3).strip(),
            'head_palette': json.dumps([
                {'molecule': 'Aldéhydes froids (C10–C11)', 'percentage': 6, 'function': 'ouverture, verticalité, respiration', 'warning': 'Aucun effet "lessive"'},
                {'molecule': 'Iso E Super', 'percentage': 10, 'function': 'diffusion aérienne', 'warning': None},
                {'molecule': 'Dihydromyrcenol', 'percentage': 3, 'function': 'fraîcheur abstraite', 'warning': None},
                {'molecule': 'Accord air abstrait', 'percentage': 6, 'function': 'ouverture', 'warning': None}
            ]),
            'heart_palette': json.dumps([
                {'molecule': 'Patchouli fractionné clair', 'percentage': 18, 'function': 'pierre mouillée, sol compact', 'warning': 'très propre, non terreux'},
                {'molecule': 'Ambroxan', 'percentage': 12, 'function': 'structure sèche', 'warning': 'dosage bas'},
                {'molecule': 'Géosmine (dilution 1 %)', 'percentage': 1, 'function': 'humidité retenue', 'warning': 'doit être perçue, jamais identifiée'},
                {'molecule': 'Accord minéral humide', 'percentage': 14, 'function': 'cœur minéral', 'warning': None}
            ]),
            'base_palette': json.dumps([
                {'molecule': 'Vétiveryl acétate', 'percentage': 12, 'function': 'assèchement progressif', 'warning': 'sec, aérien'},
                {'molecule': 'Bois ambré clair', 'percentage': 10, 'function': 'disparition', 'warning': 'type Ambercore'},
                {'molecule': 'Musc minéral dilué', 'percentage': 8, 'function': 'calme olfactif', 'warning': 'Ambrettolide très dilué'}
            ]),
            'head_ratio': 25,
            'heart_ratio': 45,
            'base_ratio': 30,
            'formulation_protocol': json.dumps([
                'Construire le cœur minéral seul',
                'Tester la perception humide à froid',
                'Ajouter la tête par micro-incréments',
                'Ajuster le fond pour écourter la tenue',
                'Reposer 7–14 jours',
                'Évaluer en air libre, pas sur mouillette seule'
            ]),
            'sensory_tests': json.dumps([
                'Test à température basse (15–18 °C)',
                'Test après vaporisation + attente 2 min',
                'Test en espace minéral (cage d\'escalier, pierre)'
            ]),
            'typical_failures': 'Trop de géosmine → "terre humide", Trop d\'aldéhydes → cosmétique, Trop de bois → refuge olfactif',
            'status': 'conceptual'
        })
    
    return data

def insert_climate_studies(connection, studies):
    """Insère les études climatiques dans la base de données"""
    cursor = connection.cursor()
    inserted_ids = []
    
    for study in studies:
        try:
            query = """
            INSERT INTO climate_studies (
                name, collection, axis, concept, zone, altitude, climate, key_moment,
                attack_description, heart_description, base_description, observed_supports,
                absorbe_reading, threshold_odor, recommended_tests, head_translation,
                heart_translation, base_translation, ethical_position, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                study['name'], study['collection'], study['axis'], study['concept'],
                study['zone'], study['altitude'], study['climate'], study['key_moment'],
                study['attack_description'], study['heart_description'], study['base_description'],
                study['observed_supports'], study['absorbe_reading'], study['threshold_odor'],
                study['recommended_tests'], study['head_translation'], study['heart_translation'],
                study['base_translation'], study['ethical_position'], study['status']
            )
            cursor.execute(query, values)
            inserted_ids.append(cursor.lastrowid)
            print(f"✅ Étude climatique insérée : {study['name']} (ID: {cursor.lastrowid})")
        except Error as e:
            print(f"❌ Erreur lors de l'insertion de {study['name']} : {e}")
    
    connection.commit()
    cursor.close()
    return inserted_ids

def insert_molecular_protocols(connection, protocols, study_ids):
    """Insère les protocoles moléculaires dans la base de données"""
    cursor = connection.cursor()
    
    for i, protocol in enumerate(protocols):
        try:
            # Lier au bon climate_study_id
            if i < len(study_ids):
                protocol['linked_study_id'] = study_ids[i]
            
            query = """
            INSERT INTO molecular_protocols (
                name, linked_study_id, objective, olfactive_architecture, function,
                head_palette, heart_palette, base_palette, head_ratio, heart_ratio, base_ratio,
                formulation_protocol, sensory_tests, typical_failures, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                protocol['name'], protocol['linked_study_id'], protocol['objective'],
                protocol['olfactive_architecture'], protocol['function'],
                protocol['head_palette'], protocol['heart_palette'], protocol['base_palette'],
                protocol['head_ratio'], protocol['heart_ratio'], protocol['base_ratio'],
                protocol['formulation_protocol'], protocol['sensory_tests'],
                protocol['typical_failures'], protocol['status']
            )
            cursor.execute(query, values)
            print(f"✅ Protocole moléculaire inséré : {protocol['name']} (ID: {cursor.lastrowid})")
        except Error as e:
            print(f"❌ Erreur lors de l'insertion de {protocol['name']} : {e}")
    
    connection.commit()
    cursor.close()

def main():
    print("🚀 Début de l'import des données ABSORBE·COLOMBIA\n")
    
    # Connexion à la base de données
    connection = connect_to_database()
    
    # Parser le fichier
    filepath = '/home/ubuntu/upload/ABSORBE·COLOMBIA2d4dbb3d5e6c8089af3afc25395a1606.md'
    print(f"📖 Parsing du fichier : {filepath}")
    data = parse_colombia_file(filepath)
    
    print(f"\n📊 Données parsées :")
    print(f"   - {len(data['climate_studies'])} études climatiques")
    print(f"   - {len(data['molecular_protocols'])} protocoles moléculaires\n")
    
    # Insertion des données
    study_ids = insert_climate_studies(connection, data['climate_studies'])
    insert_molecular_protocols(connection, data['molecular_protocols'], study_ids)
    
    # Fermeture de la connexion
    connection.close()
    print("\n✅ Import terminé avec succès !")

if __name__ == "__main__":
    main()
