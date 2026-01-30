#!/usr/bin/env python3
import csv
import mysql.connector
import os
from datetime import datetime

# Connexion à la base de données
db = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'gateway01.us-east-1.prod.aws.tidbcloud.com'),
    port=int(os.getenv('DB_PORT', 4000)),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME'),
    ssl_ca='/etc/ssl/certs/ca-certificates.crt'
)

cursor = db.cursor()

print("🔄 Import des nouvelles molécules...\n")

# Lire le fichier CSV
with open('/home/ubuntu/perfumum-research/NOUVELLES_MOLECULES_25.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    count = 0
    
    for row in reader:
        if not row['name']:  # Skip empty rows
            continue
            
        try:
            # Préparer les données
            name = row['name']
            family = row['family'] or None
            formula = row['chemicalFormula'] or None
            olfactive_profile = row['olfactiveProfile'] or None
            emotional_resonance = row['emotionalResonance'] or None
            functional_effect = row['functionalEffect'] or None
            source_origin = row['sourceOrigin'] or None
            
            # Radar values
            radar_intensity = int(row['radarIntensity']) if row['radarIntensity'] else None
            radar_freshness = int(row['radarFreshness']) if row['radarFreshness'] else None
            radar_warmth = int(row['radarWarmth']) if row['radarWarmth'] else None
            radar_sweetness = int(row['radarSweetness']) if row['radarSweetness'] else None
            radar_spiciness = int(row['radarSpiciness']) if row['radarSpiciness'] else None
            radar_earthiness = int(row['radarEarthiness']) if row['radarEarthiness'] else None
            
            # Physical properties
            molecular_weight = int(row['molecularWeight']) if row['molecularWeight'] else None
            boiling_point = int(row['boilingPoint']) if row['boilingPoint'] else None
            volatility = int(row['volatility']) if row['volatility'] else None
            intensity = int(row['intensity']) if row['intensity'] else None
            complexity = int(row['complexity']) if row['complexity'] else None
            
            # Additional info
            botanical_sources = row['botanicalSources'] or None
            extraction_method = row['extractionMethod'] or None
            therapeutic_properties = row['therapeuticProperties'] or None
            
            # Insérer dans la base de données
            query = """
            INSERT INTO molecules (
                name, family, chemicalFormula, olfactiveProfile, emotionalResonance,
                functionalEffect, sourceOrigin, radarIntensity, radarFreshness, radarWarmth,
                radarSweetness, radarSpiciness, radarEarthiness, molecularWeight, boilingPoint,
                volatility, intensity, complexity, botanicalSources, extractionMethod,
                therapeuticProperties, createdAt, updatedAt
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW()
            )
            """
            
            values = (
                name, family, formula, olfactive_profile, emotional_resonance,
                functional_effect, source_origin, radar_intensity, radar_freshness, radar_warmth,
                radar_sweetness, radar_spiciness, radar_earthiness, molecular_weight, boiling_point,
                volatility, intensity, complexity, botanical_sources, extraction_method,
                therapeutic_properties
            )
            
            cursor.execute(query, values)
            db.commit()
            
            count += 1
            print(f"✅ {name} importée (ID: {cursor.lastrowid})")
            
        except Exception as e:
            print(f"❌ Erreur pour {row.get('name', 'Unknown')}: {str(e)}")
            db.rollback()

print(f"\n✨ Import terminé ! {count} molécules importées.")

cursor.close()
db.close()
