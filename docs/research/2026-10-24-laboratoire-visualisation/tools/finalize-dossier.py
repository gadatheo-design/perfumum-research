#!/usr/bin/env python3
"""Valider et archiver la documentation, sans connexion réseau ou base de données."""
import csv
import hashlib
import json
import re
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[2]
SOURCE_RESULT = Path('/home/ubuntu/.mcp/tool-results/2026-10-24_13-49-44.482199921_notion_notion-create-pages_46df01d5.json')
if not (ROOT/'notion/pages-prototypes.json').exists():
    shutil.copyfile(SOURCE_RESULT, ROOT/'notion/pages-prototypes.json')

pages_documents = json.loads((ROOT/'notion/pages-documents.json').read_text())['pages']
pages_prototypes = json.loads((ROOT/'notion/pages-prototypes.json').read_text())['pages']
assert len(pages_documents) == 9 and len(pages_prototypes) == 15
hub = {'id':'403dbb3d5e6c815d8f9ec1dfa61e343a','url':'https://app.notion.com/p/403dbb3d5e6c815d8f9ec1dfa61e343a','properties':{'title':'12 — Laboratoire de visualisation autonome — recherche du 24 octobre 2026'}}
registry = {'date':'2026-10-24','status':'created; hub read back; representative prototype read back separately','scientific_production_writes':False,'pages':[hub]+pages_documents+pages_prototypes}
(ROOT/'notion/pages-manifest.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')

references_path = ROOT/'references.json'
refs = json.loads(references_path.read_text())
assert len(refs) == 26
for ref in refs:
    ref.pop('report_path',None)
    ref['consolidated_report'] = 'etat-art.md'
    ref['individual_note_delivered'] = False
references_path.write_text(json.dumps(refs,ensure_ascii=False,indent=2)+'\n')

csv_path = ROOT/'matrices/references.csv'
with csv_path.open() as handle:
    reader=csv.DictReader(handle)
    fields=[f for f in reader.fieldnames if f != 'report_path']
    records=[{key:val for key,val in row.items() if key != 'report_path'} for row in reader]
with csv_path.open('w',newline='') as handle:
    writer=csv.DictWriter(handle,fieldnames=fields)
    writer.writeheader();writer.writerows(records)

concepts=json.loads((ROOT/'prototypes/concepts.json').read_text())
assert len(concepts)==12
assert [c['id'] for c in concepts]==[f'V{i:02}' for i in range(1,13)]
for c in concepts:
    p=ROOT/'prototypes'/f"{c['id']}.md"
    assert p.exists() and len(p.read_text().split())>=150,p
    assert 'non construite' in p.read_text() or 'non construits' in p.read_text(),p

matrix_counts={}
for name,sep,count in [('donnees-phenomenes.csv',';',15),('references.csv',',',26),('concepts-mediums.csv',',',12)]:
    with (ROOT/'matrices'/name).open() as handle:
        reader=csv.DictReader(handle,delimiter=sep);rows=list(reader)
    assert len(rows)==count,(name,len(rows))
    assert all(None not in row and all(val is not None for val in row.values()) for row in rows),name
    matrix_counts[name]={'rows':len(rows),'columns':len(reader.fieldnames),'delimiter':sep}

for name in ['README.md','03-synthese-strategique.md','01-synthese-notion.md','02-materiaux-optiques.md','04-protocole-comparaison.md','etat-art.md','concepts-et-prototypes.md','notes/audit-donnees.md','notes/architecture-et-materiaux.md']:
    p=ROOT/name;assert p.exists() and p.stat().st_size>1000,name

validation={'status':'passed','scope':'Documentation, JSON, CSV et archive seulement; pas de test applicatif ni expérimental','references':26,'concepts':12,'notion_pages':len(registry['pages']),'matrix_counts':matrix_counts,'production_changes':False,'prototypes_built':False,'database_export_performed':False}
(ROOT/'VALIDATION.json').write_text(json.dumps(validation,ensure_ascii=False,indent=2)+'\n')

excluded={'SHA256SUMS'}
def included(p):
    rel=p.relative_to(ROOT)
    return (p.is_file() and p.name not in excluded and '__pycache__' not in rel.parts
            and not (rel.parts[0]=='notion' and (p.name.startswith('payload-') or p.name.startswith('result-'))))
files=sorted(p for p in ROOT.rglob('*') if included(p))
lines=[hashlib.sha256(p.read_bytes()).hexdigest()+'  '+str(p.relative_to(ROOT)) for p in files]
(ROOT/'SHA256SUMS').write_text('\n'.join(lines)+'\n')
for line in lines:
    digest,rel=line.split('  ',1);assert hashlib.sha256((ROOT/rel).read_bytes()).hexdigest()==digest

archive=REPO/'deliverables/PERFUMUM-laboratoire-visualisation-2026-10-24.zip'
archive.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for p in files+[ROOT/'SHA256SUMS']:
        z.write(p,Path('PERFUMUM-laboratoire-visualisation-2026-10-24')/p.relative_to(ROOT))
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert len(z.namelist())==len(files)+1
print(json.dumps(validation,ensure_ascii=False))
print('Archive:',archive)
print('Fichiers:',len(files)+1,'Octets:',archive.stat().st_size)
