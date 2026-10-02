#!/usr/bin/env python3
"""Génère les exports de données des prototypes de mapping à partir du dépôt.

Lecture seule : aucune base, aucun réseau. Chaque export embarque le chemin et le
sha256 de ses fichiers sources, la date de génération et le commit git courant.

Le champ `command` des journaux `.manus/db` (hôte, utilisateur et base TiDB) et le
texte SQL ne sont jamais recopiés : seuls l'horodatage, le type d'instruction, la
table visée et l'état d'erreur sont conservés.

Usage : python3 tools/mapping-prototypes/cli/build_data.py
"""

from __future__ import annotations

import csv
import datetime as dt
import glob
import hashlib
import json
import os
import re
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
OUT_DIR = os.path.join(ROOT, "tools", "mapping-prototypes", "data")


def rel(path: str) -> str:
    return os.path.relpath(path, ROOT)


def sha256_file(path: str) -> str:
    with open(path, "rb") as handle:
        return hashlib.sha256(handle.read()).hexdigest()


def source_entry(path: str) -> dict:
    return {"path": rel(path), "sha256": sha256_file(path)}


def git_commit() -> str | None:
    try:
        return subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    except (OSError, subprocess.CalledProcessError):
        return None


def write_js(name: str, variable: str, payload: dict) -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    body = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    with open(os.path.join(OUT_DIR, name), "w", encoding="utf-8") as handle:
        handle.write("/* Généré par tools/mapping-prototypes/cli/build_data.py — ne pas éditer à la main. */\n")
        handle.write(f"window.{variable} = {body};\n")


# ---------------------------------------------------------------------------
# Données documentaires (preuves, relations, absences)
# ---------------------------------------------------------------------------

FIELD_RE = re.compile(r'(\w+):\s*("(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?)')


def parse_evidence_lot(path: str) -> tuple[list[dict], list[str]]:
    text = open(path, encoding="utf-8").read()
    main = text.split("export const plantMoleculeEvidenceLot1", 1)[1].split("export const withheld", 1)[0]
    records = []
    for block in re.findall(r"\{([^{}]*)\}", main.split("=", 1)[1]):
        fields = {}
        for key, raw in FIELD_RE.findall(block):
            fields[key] = json.loads(raw) if raw.startswith('"') else float(raw) if "." in raw else int(raw)
        if "moleculeCasNumber" in fields:
            records.append(fields)
    withheld_block = text.split("export const withheldPlantMoleculeEvidenceLot1", 1)[1]
    withheld = [json.loads(s) for s in re.findall(r'"(?:[^"\\]|\\.)*"', withheld_block)]
    return records, withheld


def build_documentary() -> dict:
    fleur_path = os.path.join(ROOT, "tools/physical-tests/data/fleur-fantome-2026-09-15.json")
    lot_path = os.path.join(ROOT, "server/data/plant-molecule-evidence-lot-1.ts")
    refs_path = os.path.join(ROOT, "docs/data/refs-without-doi.json")
    plants_path = os.path.join(ROOT, "docs/data/plants-not-geocoded.json")
    missing_path = os.path.join(ROOT, "docs/data/MOLECULES_CLASSIQUES_MANQUANTES.csv")
    seasonal_path = os.path.join(ROOT, "docs/data/seasonal-variations.json")

    fleur = json.load(open(fleur_path, encoding="utf-8"))
    lot, withheld = parse_evidence_lot(lot_path)

    assertions = []
    for index, item in enumerate(lot, start=1):
        assertions.append({
            "id": f"LOT1-{index:02d}",
            "family": "gcms_lot1",
            "label": f"{item['plantLabel']} → {item['moleculeLabel']}",
            "plant_id": item["plantId"],
            "plant_latin": item["expectedLatinName"],
            "molecule": item["moleculeLabel"],
            "cas": item["moleculeCasNumber"],
            "range_min": item["percentageMin"],
            "range_max": item["percentageMax"],
            "unit": "% relatif dans l’échantillon analytique",
            "method": item["method"],
            "citation": item["sourceCitation"],
            "source_url": item["sourceUrl"],
            "sample_context": item["sampleContext"],
            "caveat": item["caveat"],
            # Niveau : mesure scientifique primaire (N5) ; vérification : lot maintenu en revue
            # (docs/audits/2026-09-bilan-remediation-controlee.md). Confiance non renseignée dans le dépôt.
            "evidence": {"level": "primaire", "confidence": None, "verification": "a_verifier"},
            "pointer": {"table": "plants", "id": item["plantId"], "file": rel(lot_path)},
        })
    for molecule in fleur["molecules"]:
        assertions.append({
            "id": f"FF-{molecule['id']}",
            "family": "fleur_fantome",
            "label": f"Fleur Fantôme → {molecule['name']}",
            "molecule": molecule["name"],
            "cas": molecule["cas"],
            "proportion": molecule["proportion"],
            "boiling_point_c": molecule["boilingPointC"],
            "unit": "proportion déclarée (unité non documentée)",
            "caveat": fleur["dataStatus"],
            # Relation interne de base sans source attachée dans l'export : aucune dimension renseignée.
            "evidence": {"level": None, "confidence": None, "verification": None},
            "pointer": {"table": "recette_molecules", "recette_id": fleur["recipe"]["id"], "molecule_id": molecule["id"], "file": rel(fleur_path)},
        })

    pool = []
    refs = json.load(open(refs_path, encoding="utf-8"))
    for ref in refs:
        empties = [k for k in ("authors", "year", "journal", "publisher", "isbn") if not ref.get(k)]
        pool.append({
            "id": f"REF-{ref['id']}", "category": "ref_sans_doi",
            "title": ref.get("title") or "(sans titre)",
            "detail": "; ".join(filter(None, [ref.get("authors"), str(ref.get("year") or ""), ref.get("journal")])),
            "missing": ["doi", *empties], "weight": 1 + 1 + len(empties),
            "pointer": {"table": "bibliography_entries", "id": ref["id"], "file": rel(refs_path)},
        })
    fleur_by_name = {m["name"].lower(): m for m in fleur["molecules"]}
    for row in csv.DictReader(open(missing_path, encoding="utf-8")):
        empties = [k for k, v in row.items() if not (v or "").strip()]
        item = {
            "id": f"MQ-{row['name']}", "category": "molecule_manquante",
            "title": row["name"], "detail": f"{row.get('family') or ''} · {row.get('chemicalFormula') or ''}".strip(" ·"),
            "missing": ["entrée en base", *empties], "weight": 1 + 1 + len(empties),
            "pointer": {"table": "molecules", "id": None, "file": rel(missing_path)},
        }
        # Contradiction conservée, non résolue : la liste « manquante » n'est pas datée,
        # alors que l'export daté de Fleur Fantôme contient la molécule.
        present = fleur_by_name.get(row["name"].lower())
        if present:
            item["contradiction"] = {
                "statement": "présente dans un export daté de la base",
                "file": rel(fleur_path), "exported_at": fleur["exportedAt"], "molecule_id": present["id"], "cas": present["cas"],
            }
        pool.append(item)
    for plant in json.load(open(plants_path, encoding="utf-8")):
        pool.append({
            "id": f"PL-{plant['id']}", "category": "plante_non_geocodee",
            "title": plant["name"], "detail": f"origine : {plant.get('origin') or 'non renseignée'}",
            "missing": ["coordonnées", *([] if plant.get("origin") else ["origine"])],
            "weight": 1 + 1 + (0 if plant.get("origin") else 1),
            "pointer": {"table": "plants", "id": plant["id"], "file": rel(plants_path)},
        })
    seasonal = json.load(open(seasonal_path, encoding="utf-8"))
    for material, content in seasonal.items():
        for index, variation in enumerate(content.get("variations", []), start=1):
            pool.append({
                "id": f"SV-{material}-{index}", "category": "variation_sans_source",
                "title": f"{material} — {variation.get('season', '?')}",
                "detail": ", ".join(f"{m} {r.get('min')}–{r.get('max')} %" for m, r in variation.get("molecules", {}).items()),
                "missing": ["source", "méthode", "échantillon"], "weight": 1 + 3,
                "pointer": {"table": None, "file": rel(seasonal_path), "key": f"{material}.variations[{index - 1}]"},
            })
    for index, reason in enumerate(withheld, start=1):
        pool.append({
            "id": f"RET-{index:02d}", "category": "preuve_retenue",
            "title": reason.split(":")[0].strip(), "detail": reason,
            "missing": ["décision humaine"], "weight": 1 + 1,
            "pointer": {"table": None, "file": rel(lot_path), "key": f"withheldPlantMoleculeEvidenceLot1[{index - 1}]"},
        })

    return {
        "kind": "perfumum-mapping-documentary-export",
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "git_commit": git_commit(),
        "sources": [source_entry(p) for p in (fleur_path, lot_path, refs_path, plants_path, missing_path, seasonal_path)],
        "status": "Export documentaire en lecture seule. Aucune donnée ne commande une émission, une chauffe ou une formulation.",
        "recipe": fleur["recipe"],
        "assertions": assertions,
        "absence_pool": pool,
        "absence_weight_formula": "poids = 1 + nombre de dimensions manquantes listées pour l’enregistrement source",
    }


# ---------------------------------------------------------------------------
# Journal .manus/db → frise temporelle (sans `command`, sans SQL)
# ---------------------------------------------------------------------------

TABLE_PATTERNS = [
    re.compile(r"^(?:SELECT|DELETE)\b.*?\bFROM\s+`?(\w+)`?", re.I | re.S),
    re.compile(r"^INSERT\s+(?:IGNORE\s+)?INTO\s+`?(\w+)`?", re.I),
    re.compile(r"^REPLACE\s+INTO\s+`?(\w+)`?", re.I),
    re.compile(r"^UPDATE\s+`?(\w+)`?", re.I),
    re.compile(r"^(?:CREATE|ALTER|DROP|TRUNCATE)\s+TABLE\s+(?:IF\s+(?:NOT\s+)?EXISTS\s+)?`?(\w+)`?", re.I),
    re.compile(r"^TRUNCATE\s+`?(\w+)`?", re.I),
    re.compile(r"^(?:DESCRIBE|DESC|EXPLAIN)\s+`?(\w+)`?", re.I),
    re.compile(r"^SHOW\s+(?:FULL\s+)?(?:CREATE\s+TABLE|COLUMNS\s+FROM|FIELDS\s+FROM|INDEX\s+FROM|INDEXES\s+FROM|KEYS\s+FROM)\s+`?(\w+)`?", re.I),
    re.compile(r"^RENAME\s+TABLE\s+`?(\w+)`?", re.I),
    re.compile(r"^CREATE\s+(?:UNIQUE\s+)?INDEX\s+\w+\s+ON\s+`?(\w+)`?", re.I),
]


def strip_comments(sql: str) -> str:
    sql = re.sub(r"/\*.*?\*/", " ", sql, flags=re.S)
    return "\n".join(line for line in sql.splitlines() if not line.strip().startswith("--")).strip()


def classify(statement: str) -> tuple[str, str | None]:
    statement = statement.strip()
    kind = statement.split(None, 1)[0].upper() if statement else "VIDE"
    for pattern in TABLE_PATTERNS:
        match = pattern.search(statement)
        if match:
            return kind, match.group(1).lower()
    return kind, None


def build_timeline() -> dict:
    files = sorted(glob.glob(os.path.join(ROOT, ".manus/db/*.json")))
    entries, purges, manifest_lines = [], [], []
    tables: dict[str, int] = {}
    kinds: dict[str, int] = {}

    def index_of(mapping: dict[str, int], key: str) -> int:
        if key not in mapping:
            mapping[key] = len(mapping)
        return mapping[key]

    for path in files:
        name = os.path.basename(path)
        manifest_lines.append(f"{sha256_file(path)}  {name}")
        epoch = int(re.search(r"(\d{13})", name).group(1))
        is_error = "-error-" in name
        try:
            query = json.load(open(path, encoding="utf-8")).get("query", "")
        except (OSError, json.JSONDecodeError):
            query = ""
        statements = [s for s in (strip_comments(part) for part in strip_comments(query).split(";")) if s]
        kind, table = classify(statements[0]) if statements else ("VIDE", None)
        entries.append([epoch, index_of(kinds, kind), index_of(tables, table) if table else -1, 1 if is_error else 0])
        for statement in statements:
            purge_kind, purge_table = classify(statement)
            if purge_kind in ("DELETE", "DROP", "TRUNCATE"):
                purges.append({
                    "t": epoch, "file": name, "kind": purge_kind, "table": purge_table,
                    "partial": bool(re.search(r"\bWHERE\b", statement, re.I)),
                    "error": is_error,
                })

    manifest = "\n".join(manifest_lines) + "\n"
    return {
        "kind": "perfumum-manus-db-timeline",
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "git_commit": git_commit(),
        "source": {"path": ".manus/db/*.json", "file_count": len(files), "manifest_sha256": hashlib.sha256(manifest.encode()).hexdigest()},
        "redaction": "Champ `command` (hôte, utilisateur, base) et texte SQL exclus. Seuls horodatage, type d’instruction, table et état d’erreur sont conservés.",
        "caveat": "Journal de l’outil d’administration Manus, pas journal de la base : les écritures applicatives n’y figurent pas. Un DELETE peut précéder une réimportation.",
        "kinds": list(kinds),
        "tables": list(tables),
        "entry_fields": ["epoch_ms", "kind_index", "table_index(-1 = aucune)", "error(0/1)"],
        "entries": entries,
        "purges": purges,
    }


def main() -> None:
    documentary = build_documentary()
    timeline = build_timeline()
    write_js("perfumum-data.js", "PM_DATA", documentary)
    write_js("manus-db-timeline.js", "PM_TIMELINE", timeline)
    print(f"perfumum-data.js : {len(documentary['assertions'])} assertions, {len(documentary['absence_pool'])} absences")
    print(f"manus-db-timeline.js : {len(timeline['entries'])} requêtes, {len(timeline['purges'])} purges, {len(timeline['tables'])} tables")


if __name__ == "__main__":
    main()
