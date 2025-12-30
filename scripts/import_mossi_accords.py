#!/usr/bin/env python3
"""
Script d'import des Accords Mossi
Parse le fichier Markdown et insère les données comme recettes dans la base de données
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
    pattern = r'mysql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)'
    match = re.match(pattern, url)
    if match:
        return {
            'user': match.group(1),
            'password': match.group(2),
            'host': match.group(3),
            'port': int(match.group(4)),
            'database': match.group(5),
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

def parse_mossi_file(filepath):
    """Parse le fichier AccordsMossi.md"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    accords = []
    
    # Pattern pour extraire chaque accord
    accord_pattern = r'# (\d+)\. (.+?)\s+### Concept\s+(.+?)\s+(?:Base : (.+?)\s+)?### Formule.*?Tête \((\d+) %\)\s+((?:- .+?\n)+)\s+Cœur \((\d+) %\)\s+((?:- .+?\n)+)\s+Fond \((\d+) %\)\s+((?:- .+?\n)+)\s+### Profil\s+(.+?)\s+---'
    
    matches = re.finditer(accord_pattern, content, re.DOTALL)
    
    for match in matches:
        number = match.group(1)
        name = match.group(2).strip()
        concept = match.group(3).strip()
        base = match.group(4).strip() if match.group(4) else ""
        
        tete_percent = int(match.group(5))
        tete_ingredients = match.group(6).strip()
        coeur_percent = int(match.group(7))
        coeur_ingredients = match.group(8).strip()
        fond_percent = int(match.group(9))
        fond_ingredients = match.group(10).strip()
        profil = match.group(11).strip()
        
        # Parser les ingrédients
        def parse_ingredients(text):
            lines = [line.strip('- ').strip() for line in text.split('\n') if line.strip()]
            return lines
        
        tete_list = parse_ingredients(tete_ingredients)
        coeur_list = parse_ingredients(coeur_ingredients)
        fond_list = parse_ingredients(fond_ingredients)
        
        accord = {
            'name': f"Mossi {name}",
            'category': 'encens',
            'gamme': 'Mossi',
            'description': concept,
            'ingredients': f"Base: {base}" if base else concept,
            'formula': json.dumps({
                'tête': {'percent': tete_percent, 'ingredients': tete_list},
                'cœur': {'percent': coeur_percent, 'ingredients': coeur_list},
                'fond': {'percent': fond_percent, 'ingredients': fond_list}
            }),
            'notes_tete': ', '.join(tete_list),
            'notes_coeur': ', '.join(coeur_list),
            'notes_fond': ', '.join(fond_list),
            'duree_tete_min': 15,
            'duree_coeur_min': 45,
            'duree_fond_min': 120,
            'protocol': f"Profil olfactif: {profil}",
            'status': 'validated',
            'intensity': 7
        }
        
        accords.append(accord)
    
    return accords

def insert_accords(connection, accords):
    """Insère les accords Mossi comme recettes dans la base de données"""
    cursor = connection.cursor()
    
    for accord in accords:
        try:
            query = """
            INSERT INTO recettes (
                name, category, gamme, description, ingredients, formula,
                notes_tete, notes_coeur, notes_fond, duree_tete_min, duree_coeur_min, duree_fond_min,
                protocol, status, intensity
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                accord['name'], accord['category'], accord['gamme'], accord['description'],
                accord['ingredients'], accord['formula'], accord['notes_tete'], accord['notes_coeur'],
                accord['notes_fond'], accord['duree_tete_min'], accord['duree_coeur_min'],
                accord['duree_fond_min'], accord['protocol'], accord['status'], accord['intensity']
            )
            cursor.execute(query, values)
            print(f"✅ Accord Mossi inséré : {accord['name']} (ID: {cursor.lastrowid})")
        except Error as e:
            print(f"❌ Erreur lors de l'insertion de {accord['name']} : {e}")
    
    connection.commit()
    cursor.close()

def main():
    print("🚀 Début de l'import des Accords Mossi\n")
    
    # Connexion à la base de données
    connection = connect_to_database()
    
    # Parser le fichier
    filepath = '/home/ubuntu/upload/AccordsMossi2b5dbb3d5e6c807ab839e2b94c171840.md'
    print(f"📖 Parsing du fichier : {filepath}")
    accords = parse_mossi_file(filepath)
    
    print(f"\n📊 Données parsées : {len(accords)} accords Mossi\n")
    
    # Insertion des données
    insert_accords(connection, accords)
    
    # Fermeture de la connexion
    connection.close()
    print("\n✅ Import terminé avec succès !")

if __name__ == "__main__":
    main()
