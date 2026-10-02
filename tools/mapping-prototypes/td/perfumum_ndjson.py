"""PERFUMUM — lecture et vérification des runs NDJSON, utilisable dans TouchDesigner.

Python standard uniquement (TouchDesigner embarque CPython). Ce module est un
consommateur : il lit et vérifie, il n'écrit jamais dans un run.

Règle de chaîne (identique à shared/pm-core.js et cli/verify-run.mjs) :
    hash = sha256(prev_hash + "\\n" + JSON canonique de la ligne sans `hash`)
Le JSON canonique trie les clés récursivement et formate les nombres comme
JavaScript (JSON.stringify), d'où `js_number`.

Usage dans TouchDesigner (Script DAT ou Text DAT exécuté) :
    import perfumum_ndjson as pn          # placer ce fichier dans le dossier du projet
    run = pn.load_run(project.folder + '/runs/RUN-20261002-001.ndjson')
    pn.fill_table(op('events'), run)      # une ligne par événement, pointeurs visibles
Hors TouchDesigner :
    python3 perfumum_ndjson.py RUN-20261002-001.ndjson
"""

from __future__ import annotations

import hashlib
import json
import math
import sys
from decimal import Decimal

ZERO_HASH = "0" * 64


def js_number(value: float | int) -> str:
    """Formate un nombre exactement comme JSON.stringify en JavaScript."""
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    if math.isnan(value) or math.isinf(value):
        return "null"
    if value == 0:
        return "0"
    sign, digits, exponent = Decimal(repr(value)).normalize().as_tuple()
    digits_str = "".join(map(str, digits))
    n = len(digits_str) + exponent  # position du point décimal (convention ECMAScript)
    k = len(digits_str)
    prefix = "-" if sign else ""
    if k <= n <= 21:
        return prefix + digits_str + "0" * (n - k)
    if 0 < n <= 21:
        return prefix + digits_str[:n] + "." + digits_str[n:]
    if -6 < n <= 0:
        return prefix + "0." + "0" * (-n) + digits_str
    e = n - 1
    mantissa = digits_str[0] + ("." + digits_str[1:] if k > 1 else "")
    return f"{prefix}{mantissa}e{'+' if e >= 0 else '-'}{abs(e)}"


def canon(value) -> str:
    if isinstance(value, dict):
        return "{" + ",".join(json.dumps(k, ensure_ascii=False) + ":" + canon(value[k]) for k in sorted(value)) + "}"
    if isinstance(value, list):
        return "[" + ",".join(canon(v) for v in value) + "]"
    if isinstance(value, bool) or value is None:
        return json.dumps(value)
    if isinstance(value, (int, float)):
        return js_number(value)
    return json.dumps(value, ensure_ascii=False)


def line_hash(line: dict) -> str:
    rest = {k: v for k, v in line.items() if k != "hash"}
    return hashlib.sha256((line["prev_hash"] + "\n" + canon(rest)).encode("utf-8")).hexdigest()


def load_run(path: str) -> dict:
    """Charge un run et vérifie sa chaîne. Retourne {'lines', 'valid', 'problems', 'header'}."""
    lines, problems = [], []
    previous = ZERO_HASH
    with open(path, encoding="utf-8") as handle:
        for number, raw in enumerate(handle, start=1):
            if not raw.strip():
                continue
            try:
                line = json.loads(raw)
            except json.JSONDecodeError:
                problems.append(f"ligne {number} : JSON illisible")
                continue
            if line.get("prev_hash") != previous:
                problems.append(f"seq {line.get('seq')} : prev_hash rompu")
            if line_hash(line) != line.get("hash"):
                problems.append(f"seq {line.get('seq')} : empreinte différente")
            if line.get("seq") != len(lines):
                problems.append(f"seq {line.get('seq')} : numéro attendu {len(lines)}")
            previous = line.get("hash")
            lines.append(line)
    return {"lines": lines, "valid": not problems and bool(lines), "problems": problems, "header": lines[0] if lines else None}


def pointer(line: dict) -> str:
    """Pointeur lisible à afficher sur le mur : RUN-…#seq · empreinte courte."""
    return f"{line.get('run_id')}#{line.get('seq')} · {str(line.get('hash', ''))[:8]}"


def fill_table(table_dat, run: dict) -> None:
    """Remplit un Table DAT TouchDesigner (clear + appendRow), une ligne par événement."""
    table_dat.clear()
    table_dat.appendRow(["seq", "ts_utc", "kind", "event_type", "actor_source", "flux", "pointer", "payload_json", "chain_ok"])
    for line in run["lines"]:
        table_dat.appendRow([
            line.get("seq"), line.get("ts_utc"), line.get("kind"), line.get("event_type", ""),
            line.get("actor_source", ""), line.get("flux", ""), pointer(line),
            json.dumps(line.get("payload", {}), ensure_ascii=False), "1" if run["valid"] else "0",
        ])


if __name__ == "__main__":
    status = 0
    for path in sys.argv[1:]:
        run = load_run(path)
        header = run["header"] or {}
        print(f"{'✓' if run['valid'] else '✗'} {path} — {header.get('run_id')} · {header.get('concept')} · {len(run['lines'])} lignes")
        for problem in run["problems"][:10]:
            print(f"   - {problem}")
        status = status or (0 if run["valid"] else 1)
    sys.exit(status)
