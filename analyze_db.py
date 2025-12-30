import mysql.connector
import os
from collections import Counter
import json

# Connection
conn = mysql.connector.connect(
    host=os.environ.get('DB_HOST', 'gateway01.us-west-2.prod.aws.tidbcloud.com'),
    port=int(os.environ.get('DB_PORT', 4000)),
    user=os.environ.get('DB_USER'),
    password=os.environ.get('DB_PASSWORD'),
    database=os.environ.get('DB_NAME'),
    ssl_ca='/etc/ssl/certs/ca-certificates.crt'
)

cursor = conn.cursor(dictionary=True)

print("=" * 80)
print("ANALYSE DE LA BASE DE DONNÉES PERFUMUM")
print("=" * 80)

# 1. Molécules par famille
print("\n📊 DISTRIBUTION DES MOLÉCULES PAR FAMILLE CHIMIQUE")
print("-" * 80)
cursor.execute("""
    SELECT 
        family,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM molecules), 2) as percentage
    FROM molecules
    WHERE family IS NOT NULL AND family != ''
    GROUP BY family
    ORDER BY count DESC
    LIMIT 20
""")
families = cursor.fetchall()
for f in families:
    print(f"{f['family']:40s} {f['count']:4d} ({f['percentage']:5.2f}%)")

# 2. Recettes par gamme
print("\n\n📊 DISTRIBUTION DES RECETTES PAR GAMME")
print("-" * 80)
cursor.execute("""
    SELECT 
        gamme,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM recettes), 2) as percentage
    FROM recettes
    WHERE gamme IS NOT NULL AND gamme != ''
    GROUP BY gamme
    ORDER BY count DESC
""")
gammes = cursor.fetchall()
for g in gammes:
    print(f"{g['gamme']:40s} {g['count']:4d} ({g['percentage']:5.2f}%)")

# 3. Statistiques générales
print("\n\n📊 STATISTIQUES GÉNÉRALES")
print("-" * 80)
cursor.execute("SELECT COUNT(*) as total FROM molecules")
total_molecules = cursor.fetchone()['total']
print(f"Total molécules: {total_molecules}")

cursor.execute("SELECT COUNT(*) as total FROM recettes")
total_recettes = cursor.fetchone()['total']
print(f"Total recettes: {total_recettes}")

cursor.execute("SELECT COUNT(*) as total FROM recette_molecules")
total_links = cursor.fetchone()['total']
print(f"Total liaisons molécules-recettes: {total_links}")

if total_recettes > 0:
    avg_molecules_per_recipe = total_links / total_recettes
    print(f"Moyenne molécules par recette: {avg_molecules_per_recipe:.2f}")

# 4. Recettes sans molécules
print("\n\n⚠️  RECETTES SANS MOLÉCULES ASSOCIÉES")
print("-" * 80)
cursor.execute("""
    SELECT r.id, r.name, r.gamme
    FROM recettes r
    LEFT JOIN recette_molecules rm ON r.id = rm.recette_id
    WHERE rm.id IS NULL
    LIMIT 10
""")
orphan_recipes = cursor.fetchall()
if orphan_recipes:
    for r in orphan_recipes:
        print(f"ID {r['id']:3d}: {r['name']:50s} [{r['gamme']}]")
else:
    print("✅ Toutes les recettes ont des molécules associées")

# 5. Top 10 molécules les plus utilisées
print("\n\n🔝 TOP 10 MOLÉCULES LES PLUS UTILISÉES")
print("-" * 80)
cursor.execute("""
    SELECT 
        m.name,
        m.family,
        COUNT(rm.id) as usage_count
    FROM molecules m
    INNER JOIN recette_molecules rm ON m.id = rm.molecule_id
    GROUP BY m.id, m.name, m.family
    ORDER BY usage_count DESC
    LIMIT 10
""")
top_molecules = cursor.fetchall()
for i, m in enumerate(top_molecules, 1):
    print(f"{i:2d}. {m['name']:40s} [{m['family']:20s}] - {m['usage_count']:3d} recettes")

# 6. Familles chimiques sous-représentées
print("\n\n📉 FAMILLES CHIMIQUES SOUS-REPRÉSENTÉES (< 3 molécules)")
print("-" * 80)
cursor.execute("""
    SELECT 
        family,
        COUNT(*) as count
    FROM molecules
    WHERE family IS NOT NULL AND family != ''
    GROUP BY family
    HAVING count < 3
    ORDER BY count ASC, family ASC
""")
underrepresented = cursor.fetchall()
if underrepresented:
    for f in underrepresented:
        print(f"{f['family']:40s} {f['count']:2d} molécules")
else:
    print("✅ Toutes les familles ont au moins 3 molécules")

conn.close()
print("\n" + "=" * 80)
