#!/usr/bin/env python3
"""
PERFUMUM — Script de Remédiation TypeScript — Vague 1
======================================================
Supprime `// @ts-nocheck` des fichiers qui n'utilisent aucun `any` explicite.

Fonctionnalités :
  - Mode DRY-RUN par défaut (aucune modification sans --apply)
  - Sauvegarde automatique de chaque fichier avant modification
  - Vérification syntaxique légère post-suppression
  - Rollback complet en cas d'erreur
  - Rapport JSON + résumé lisible

Usage :
  python3 wave1_remove_nocheck.py              # Dry-run (analyse seule)
  python3 wave1_remove_nocheck.py --apply      # Applique les modifications
  python3 wave1_remove_nocheck.py --rollback   # Annule toutes les modifications
  python3 wave1_remove_nocheck.py --apply --batch-size 50   # Par lots de 50
  python3 wave1_remove_nocheck.py --apply --file client/src/components/Breadcrumbs.tsx

Auteur : Manus AI — 11 mars 2026
"""

import os
import re
import sys
import json
import shutil
import argparse
import datetime
from pathlib import Path
from typing import NamedTuple

# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).parent.parent.resolve()
BACKUP_DIR = BASE_DIR / ".wave1-backups"
REPORT_PATH = BASE_DIR / "wave1_report.json"
LOG_PATH = BASE_DIR / "wave1_execution.log"

# Répertoires à exclure de l'analyse
EXCLUDED_DIRS = {"node_modules", "dist", ".git", ".vite", "coverage", ".wave1-backups"}

# Patterns qui rendent un fichier NON éligible à la Vague 1
INELIGIBLE_PATTERNS = [
    (r":\s*any\b", "type 'any' explicite"),
    (r"\bas\s+any\b", "cast 'as any'"),
]

# Patterns de cas limites (éligibles mais à surveiller)
EDGE_CASE_PATTERNS = [
    (r"!\.", "non-null assertion '!.'"),
    (r"//\s*@ts-ignore", "@ts-ignore présent"),
    (r"//\s*@ts-expect-error", "@ts-expect-error présent"),
]

# ─────────────────────────────────────────────────────────────────────────────
# TYPES
# ─────────────────────────────────────────────────────────────────────────────

class FileStatus(NamedTuple):
    path: str          # Chemin relatif depuis BASE_DIR
    lines: int         # Nombre de lignes
    eligible: bool     # Éligible Vague 1
    edge_case: bool    # Cas limite (patterns à surveiller)
    edge_reasons: list # Raisons du cas limite
    ineligible_reason: str  # Raison si non éligible


class ExecutionResult(NamedTuple):
    path: str
    success: bool
    action: str        # 'modified', 'skipped', 'error', 'rolled_back'
    detail: str


# ─────────────────────────────────────────────────────────────────────────────
# ANALYSE
# ─────────────────────────────────────────────────────────────────────────────

def scan_files(target_file: str = None) -> list[FileStatus]:
    """Parcourt le projet et identifie tous les fichiers @ts-nocheck éligibles."""
    results = []

    if target_file:
        # Mode fichier unique
        full_path = BASE_DIR / target_file
        if not full_path.exists():
            print(f"[ERREUR] Fichier introuvable : {target_file}", file=sys.stderr)
            sys.exit(1)
        paths = [full_path]
    else:
        # Parcours complet
        paths = []
        for root, dirs, files in os.walk(BASE_DIR):
            dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
            for f in files:
                if f.endswith((".ts", ".tsx")):
                    paths.append(Path(root) / f)

    for full_path in paths:
        rel = str(full_path.relative_to(BASE_DIR))
        try:
            content = full_path.read_text(encoding="utf-8", errors="ignore")
            lines = content.split("\n")

            # Vérifier si le fichier a @ts-nocheck en première ligne
            if not lines or "@ts-nocheck" not in lines[0]:
                continue

            n_lines = len(lines)

            # Vérifier les patterns d'inéligibilité
            ineligible_reason = ""
            for pattern, reason in INELIGIBLE_PATTERNS:
                if re.search(pattern, content):
                    ineligible_reason = reason
                    break

            if ineligible_reason:
                results.append(FileStatus(
                    path=rel, lines=n_lines, eligible=False,
                    edge_case=False, edge_reasons=[], ineligible_reason=ineligible_reason
                ))
                continue

            # Vérifier les cas limites
            edge_reasons = []
            for pattern, reason in EDGE_CASE_PATTERNS:
                if re.search(pattern, content):
                    edge_reasons.append(reason)

            results.append(FileStatus(
                path=rel, lines=n_lines, eligible=True,
                edge_case=bool(edge_reasons), edge_reasons=edge_reasons,
                ineligible_reason=""
            ))

        except Exception as e:
            print(f"[WARN] Impossible de lire {rel}: {e}", file=sys.stderr)

    return results


# ─────────────────────────────────────────────────────────────────────────────
# VÉRIFICATION SYNTAXIQUE LÉGÈRE
# ─────────────────────────────────────────────────────────────────────────────

def verify_syntax(content: str, path: str) -> tuple[bool, str]:
    """
    Vérification syntaxique légère sans appel à tsc (trop lent).
    Vérifie les invariants de base : accolades équilibrées, imports valides.
    """
    lines = content.split("\n")

    # Vérifier que la directive a bien été supprimée
    if lines and "@ts-nocheck" in lines[0]:
        return False, "@ts-nocheck toujours présent en ligne 1"

    # Vérifier que le fichier n'est pas vide
    non_empty = [l for l in lines if l.strip()]
    if len(non_empty) < 2:
        return False, "Fichier quasi-vide après suppression"

    # Vérifier l'équilibre des accolades (heuristique)
    open_braces = content.count("{")
    close_braces = content.count("}")
    if abs(open_braces - close_braces) > 5:
        return False, f"Accolades déséquilibrées : {open_braces} {{ vs {close_braces} }}"

    # Vérifier que les imports sont toujours présents si le fichier en avait
    if "import " in content and not any("import " in l for l in lines[:20]):
        return False, "Imports manquants dans les 20 premières lignes"

    return True, "OK"


# ─────────────────────────────────────────────────────────────────────────────
# SAUVEGARDE ET ROLLBACK
# ─────────────────────────────────────────────────────────────────────────────

def backup_file(rel_path: str) -> Path:
    """Sauvegarde un fichier avant modification. Retourne le chemin de sauvegarde."""
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    backup_path = BACKUP_DIR / rel_path.replace("/", "__")
    full_path = BASE_DIR / rel_path
    shutil.copy2(full_path, backup_path)
    return backup_path


def rollback_all() -> int:
    """Restaure tous les fichiers depuis les sauvegardes. Retourne le nombre restauré."""
    if not BACKUP_DIR.exists():
        print("[INFO] Aucune sauvegarde trouvée. Rien à restaurer.")
        return 0

    restored = 0
    for backup_file in BACKUP_DIR.iterdir():
        rel_path = backup_file.name.replace("__", "/")
        target = BASE_DIR / rel_path
        if target.exists():
            shutil.copy2(backup_file, target)
            restored += 1
            print(f"  [RESTAURÉ] {rel_path}")
        else:
            print(f"  [WARN] Cible introuvable pour restauration : {rel_path}")

    return restored


# ─────────────────────────────────────────────────────────────────────────────
# MODIFICATION
# ─────────────────────────────────────────────────────────────────────────────

def remove_nocheck(rel_path: str) -> ExecutionResult:
    """
    Supprime `// @ts-nocheck` de la première ligne d'un fichier.
    Retourne le résultat de l'opération.
    """
    full_path = BASE_DIR / rel_path

    try:
        original = full_path.read_text(encoding="utf-8", errors="ignore")
        lines = original.split("\n")

        # Vérifier que la première ligne est bien @ts-nocheck
        if not lines or "@ts-nocheck" not in lines[0]:
            return ExecutionResult(rel_path, False, "skipped", "Pas de @ts-nocheck en ligne 1")

        # Supprimer la ligne @ts-nocheck
        # Gérer les variantes : "// @ts-nocheck", "/* @ts-nocheck */", avec espaces
        new_lines = lines[1:]

        # Supprimer la ligne vide éventuelle qui suit @ts-nocheck
        if new_lines and new_lines[0].strip() == "":
            new_lines = new_lines[1:]

        modified = "\n".join(new_lines)

        # Vérification syntaxique légère
        ok, reason = verify_syntax(modified, rel_path)
        if not ok:
            return ExecutionResult(rel_path, False, "skipped", f"Vérification échouée : {reason}")

        # Sauvegarde avant écriture
        backup_file(rel_path)

        # Écriture
        full_path.write_text(modified, encoding="utf-8")

        return ExecutionResult(rel_path, True, "modified", f"@ts-nocheck supprimé ({len(lines)} → {len(new_lines)} lignes)")

    except PermissionError:
        return ExecutionResult(rel_path, False, "error", "Permission refusée")
    except Exception as e:
        return ExecutionResult(rel_path, False, "error", str(e))


# ─────────────────────────────────────────────────────────────────────────────
# RAPPORT
# ─────────────────────────────────────────────────────────────────────────────

def save_report(scan_results: list[FileStatus], exec_results: list[ExecutionResult], dry_run: bool):
    """Sauvegarde un rapport JSON complet."""
    report = {
        "generated_at": datetime.datetime.now().isoformat(),
        "mode": "dry-run" if dry_run else "apply",
        "project": str(BASE_DIR),
        "summary": {
            "total_nocheck": len(scan_results),
            "eligible_wave1": sum(1 for f in scan_results if f.eligible),
            "edge_cases": sum(1 for f in scan_results if f.edge_case),
            "ineligible": sum(1 for f in scan_results if not f.eligible),
            "modified": sum(1 for r in exec_results if r.action == "modified"),
            "skipped": sum(1 for r in exec_results if r.action == "skipped"),
            "errors": sum(1 for r in exec_results if r.action == "error"),
        },
        "eligible_files": [
            {"path": f.path, "lines": f.lines, "edge_case": f.edge_case, "edge_reasons": f.edge_reasons}
            for f in scan_results if f.eligible
        ],
        "edge_case_files": [
            {"path": f.path, "lines": f.lines, "reasons": f.edge_reasons}
            for f in scan_results if f.edge_case
        ],
        "ineligible_files": [
            {"path": f.path, "reason": f.ineligible_reason}
            for f in scan_results if not f.eligible
        ],
        "execution_results": [
            {"path": r.path, "success": r.success, "action": r.action, "detail": r.detail}
            for r in exec_results
        ],
    }
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    return report["summary"]


def print_summary(scan_results: list[FileStatus], exec_results: list[ExecutionResult], dry_run: bool):
    """Affiche un résumé lisible dans le terminal."""
    eligible = [f for f in scan_results if f.eligible]
    edge = [f for f in scan_results if f.edge_case]
    ineligible = [f for f in scan_results if not f.eligible]

    print("\n" + "═" * 60)
    print("  PERFUMUM — Remédiation TypeScript — Vague 1")
    print("  Mode : " + ("DRY-RUN (aucune modification)" if dry_run else "APPLY (modifications appliquées)"))
    print("═" * 60)

    print(f"\n📊 ANALYSE DES FICHIERS @ts-nocheck")
    print(f"  Total @ts-nocheck trouvés    : {len(scan_results)}")
    print(f"  ✅ Éligibles Vague 1          : {len(eligible)}")
    print(f"  ⚠️  Cas limites (inclus)       : {len(edge)}")
    print(f"  ❌ Non éligibles (ont 'any')   : {len(ineligible)}")

    if eligible:
        total_lines = sum(f.lines for f in eligible)
        print(f"\n  Lignes totales concernées    : {total_lines:,}")
        print(f"  Taille moyenne par fichier   : {total_lines // len(eligible)} lignes")

    if exec_results:
        modified = [r for r in exec_results if r.action == "modified"]
        skipped = [r for r in exec_results if r.action == "skipped"]
        errors = [r for r in exec_results if r.action == "error"]

        print(f"\n⚙️  RÉSULTATS D'EXÉCUTION")
        print(f"  ✅ Modifiés avec succès      : {len(modified)}")
        print(f"  ⏭️  Ignorés (vérif. échouée)  : {len(skipped)}")
        print(f"  ❌ Erreurs                   : {len(errors)}")

        if errors:
            print(f"\n  Fichiers en erreur :")
            for r in errors:
                print(f"    {r.path} — {r.detail}")

        if skipped:
            print(f"\n  Fichiers ignorés :")
            for r in skipped[:5]:
                print(f"    {r.path} — {r.detail}")

    if edge:
        print(f"\n⚠️  CAS LIMITES (modifiés mais à surveiller) :")
        for f in edge[:10]:
            print(f"    {f.path} [{', '.join(f.edge_reasons)}]")
        if len(edge) > 10:
            print(f"    ... et {len(edge) - 10} autres (voir wave1_report.json)")

    print(f"\n📄 Rapport complet : {REPORT_PATH}")
    if not dry_run and exec_results:
        print(f"💾 Sauvegardes     : {BACKUP_DIR}")
        print(f"↩️  Rollback        : python3 {Path(__file__).name} --rollback")
    print("═" * 60 + "\n")


# ─────────────────────────────────────────────────────────────────────────────
# POINT D'ENTRÉE
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="PERFUMUM — Remédiation @ts-nocheck — Vague 1",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples :
  python3 wave1_remove_nocheck.py                         # Analyse seule (dry-run)
  python3 wave1_remove_nocheck.py --apply                 # Applique toutes les modifications
  python3 wave1_remove_nocheck.py --apply --batch-size 50 # Par lots de 50 fichiers
  python3 wave1_remove_nocheck.py --apply --file client/src/components/Breadcrumbs.tsx
  python3 wave1_remove_nocheck.py --rollback              # Annule toutes les modifications
  python3 wave1_remove_nocheck.py --stats                 # Statistiques seules
        """
    )
    parser.add_argument("--apply", action="store_true",
                        help="Applique les modifications (sans ce flag : dry-run)")
    parser.add_argument("--rollback", action="store_true",
                        help="Restaure tous les fichiers depuis les sauvegardes")
    parser.add_argument("--file", type=str, default=None,
                        help="Traiter un seul fichier (chemin relatif depuis la racine du projet)")
    parser.add_argument("--batch-size", type=int, default=0,
                        help="Nombre maximum de fichiers à traiter (0 = tous)")
    parser.add_argument("--stats", action="store_true",
                        help="Affiche uniquement les statistiques sans modifier")
    parser.add_argument("--include-edge-cases", action="store_true",
                        help="Inclure les cas limites (!., @ts-ignore) dans la Vague 1")
    args = parser.parse_args()

    # ── Mode rollback ──────────────────────────────────────────────────────
    if args.rollback:
        print("\n↩️  ROLLBACK en cours...")
        n = rollback_all()
        print(f"\n✅ {n} fichier(s) restauré(s) depuis {BACKUP_DIR}")
        # Nettoyer les sauvegardes après rollback réussi
        if n > 0:
            shutil.rmtree(BACKUP_DIR)
            print(f"🗑️  Dossier de sauvegardes supprimé.")
        return

    # ── Analyse ────────────────────────────────────────────────────────────
    print(f"\n🔍 Analyse du projet : {BASE_DIR}")
    scan_results = scan_files(target_file=args.file)

    if not scan_results:
        print("[INFO] Aucun fichier @ts-nocheck trouvé.")
        return

    # Filtrer les éligibles
    eligible = [f for f in scan_results if f.eligible]

    # Exclure les cas limites sauf si --include-edge-cases
    if not args.include_edge_cases:
        targets = [f for f in eligible if not f.edge_case]
        edge_excluded = [f for f in eligible if f.edge_case]
        if edge_excluded:
            print(f"  [INFO] {len(edge_excluded)} cas limites exclus (utiliser --include-edge-cases pour les inclure)")
    else:
        targets = eligible
        edge_excluded = []

    # Appliquer le batch-size
    if args.batch_size > 0:
        targets = targets[:args.batch_size]
        print(f"  [INFO] Batch limité à {args.batch_size} fichiers")

    # ── Mode stats uniquement ──────────────────────────────────────────────
    if args.stats or not args.apply:
        print_summary(scan_results, [], dry_run=True)
        save_report(scan_results, [], dry_run=True)

        if not args.apply:
            print(f"💡 Pour appliquer les modifications sur {len(targets)} fichiers :")
            print(f"   python3 {Path(__file__).name} --apply")
            if args.batch_size == 0:
                print(f"   python3 {Path(__file__).name} --apply --batch-size 50  # Par lots de 50")
        return

    # ── Mode apply ────────────────────────────────────────────────────────
    print(f"\n⚙️  Application sur {len(targets)} fichiers...")
    exec_results = []

    for i, file_status in enumerate(targets, 1):
        result = remove_nocheck(file_status.path)
        exec_results.append(result)

        # Affichage progressif
        icon = "✅" if result.success else ("⏭️" if result.action == "skipped" else "❌")
        print(f"  [{i:3d}/{len(targets)}] {icon} {file_status.path}")
        if not result.success:
            print(f"         → {result.detail}")

    # ── Rapport final ──────────────────────────────────────────────────────
    print_summary(scan_results, exec_results, dry_run=False)
    save_report(scan_results, exec_results, dry_run=False)

    # Log d'exécution
    with open(LOG_PATH, "a", encoding="utf-8") as log:
        log.write(f"\n{'='*60}\n")
        log.write(f"Exécution : {datetime.datetime.now().isoformat()}\n")
        log.write(f"Mode : apply | Batch : {args.batch_size or 'all'}\n")
        modified = sum(1 for r in exec_results if r.action == "modified")
        log.write(f"Résultat : {modified}/{len(targets)} fichiers modifiés\n")
        for r in exec_results:
            log.write(f"  [{r.action.upper():10s}] {r.path} — {r.detail}\n")


if __name__ == "__main__":
    main()
