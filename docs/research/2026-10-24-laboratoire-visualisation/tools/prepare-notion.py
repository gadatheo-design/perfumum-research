#!/usr/bin/env python3
"""Préparer des charges utiles Notion, sans appel réseau ni écriture scientifique."""
import argparse
import csv
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HUB = '403dbb3d5e6c815d8f9ec1dfa61e343a'
HUB_URL = 'https://app.notion.com/p/' + HUB


def plain(s):
    s = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s)
    s = re.sub(r'[`*_]', '', s)
    return html.escape(s.strip())


def notion_text(text, remove_title=True):
    refs = dict(re.findall(r'^\[(\d+)\]:\s+(https?://\S+)(?:\s+.*)?$', text, re.M))
    text = re.sub(r'^\[(\d+)\]:\s+https?://\S+(?:\s+.*)?\n?', '', text, flags=re.M)
    for key, url in refs.items():
        if 'notion.com/' in url or 'notion.so/' in url:
            replacement = '<mention url="' + url + '">Référence ' + key + '</mention>'
        else:
            replacement = '[' + key + '](' + url + ')'
        text = re.sub(r'\[' + re.escape(key) + r'\](?!\()', lambda m: replacement, text)
    if remove_title:
        text = re.sub(r'^# [^\n]+\n+', '', text, count=1)
    def link(m):
        label, url = m.groups()
        if 'notion.com/' in url or 'notion.so/' in url:
            return '<mention url="' + url + '">' + label + '</mention>'
        if not re.match(r'^[a-z]+://', url):
            return label + ' — voir les annexes de cette étude'
        return m.group(0)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, text)
    text = re.sub(r'(?<![\w:/=-])2026-10-24(?![\wT/-])', '<date start="2026-10-24" />', text)
    lines = text.splitlines()
    out = []
    i = 0
    while i < len(lines):
        if lines[i].lstrip().startswith('|') and i + 1 < len(lines) and re.match(r'^\s*\|[\s:|\-]+\|\s*$', lines[i+1]):
            rows = [lines[i]]
            i += 2
            while i < len(lines) and lines[i].lstrip().startswith('|'):
                rows.append(lines[i]); i += 1
            out.append('<table header-row="true">')
            for row in rows:
                cells = re.split(r'(?<!\\)\|', row.strip().strip('|'))
                out.append('  <tr>')
                for cell in cells:
                    out.append('    <td>' + plain(cell.replace('\\|', '|')) + '</td>')
                out.append('  </tr>')
            out.append('</table>')
        else:
            out.append(lines[i]); i += 1
    value = '\n'.join(out).strip() + '\n'
    assert not re.search(r'<(?:thead|tbody|th)>', value)
    assert not re.search(r'^\s*\|', value, re.M)
    return value


def page(title, content):
    body = notion_text(content)
    body += '\n<mention url="' + HUB_URL + '">Synthèse et navigation du laboratoire de visualisation</mention>\n'
    return {'properties': {'title': title}, 'content': body}


def reference_group(refs, number):
    text = '# Références artistiques et techniques — partie ' + str(number) + '\n\n'
    text += 'Projets étudiés séparément à partir de sources primaires et de leurs pages publiques. Un projet vérifié ne signifie pas que toutes ses techniques ou vidéos ont été accessibles. Les limites de chaque inspection sont conservées. Les transferts sont des propositions pour PERFUMUM, jamais des résultats établis sur l’olfaction.\n\n'
    fields = [('author','Auteur'), ('medium','Médium'), ('principle','Principe et observations'), ('documented_technology','Techniques documentées'), ('transfer_to_perfumum','Transfert proposé, interprétatif'), ('difficulty','Difficulté'), ('limits','Limites et accès')]
    for r in refs:
        text += '## ' + r['id'] + ' — ' + r['title'] + '\n\n'
        for key, label in fields:
            text += '**' + label + ' :** ' + r[key] + '\n\n'
        text += '**Sources consultées :**\n\n'
        for url in r['source_urls']:
            text += '- [' + url + '](' + url + ')\n'
        text += '\n'
    return text


def write_payload(mode, parent_id=None):
    folder = ROOT / 'notion'
    folder.mkdir(exist_ok=True)
    pages = []
    if mode == 'documents':
        specs = [
            ('Stratégie — un laboratoire de lectures, pas une nouvelle vitrine','03-synthese-strategique.md'),
            ('Contexte — potentiel et limites de l’Olfactory Ontology','01-synthese-notion.md'),
            ('Données — audit réel et périmètres du 24 octobre 2026','notes/audit-donnees.md'),
            ('Outils — architecture locale, transferts et scénarios spatiaux','notes/architecture-et-materiaux.md'),
            ('Matériaux — lumière, transparences, fluorescence et optique','02-materiaux-optiques.md'),
            ('Site public — contrôle de lecture et écarts de rendu','notes/controle-site-public.md'),
        ]
        for title, path in specs:
            pages.append(page(title, (ROOT / path).read_text()))
        refs = json.loads((ROOT / 'references.json').read_text())
        assert len(refs) == 26
        for index, group in enumerate((refs[:13], refs[13:]), 1):
            pages.append(page('Références — R01 à R13' if index == 1 else 'Références — R14 à R26', reference_group(group, index)))
        pages.append(page('Concepts et prototypes — fiches V01 à V12', '# Concepts et prototypes\n\nDouze propositions distinctes, non construites. Trois priorités : V01 atlas documentaire Boswellia ; V02 calques de preuves ; V03 salle des trois lectures. Les fiches enfants conservent hypothèse, corpus, règle, médium, dépendances, test et limites. Aucun protocole matériel ni collecte n’est lancé par leur publication.\n'))
        parent_id = HUB
    elif mode == 'prototypes':
        assert parent_id
        concepts = json.loads((ROOT / 'prototypes/concepts.json').read_text())
        assert len(concepts) == 12
        for c in concepts:
            pages.append(page(c['id'] + ' — ' + c['title'], (ROOT / 'prototypes' / (c['id'] + '.md')).read_text()))
        pages.append(page('Programme — concepts, classement et progression', (ROOT / 'concepts-et-prototypes.md').read_text()))
        pages.append(page('Protocole — comparer, rejouer et décider du passage au médium', (ROOT / '04-protocole-comparaison.md').read_text()))
        matrix_path = ROOT / 'matrices/concepts-mediums.csv'
        with matrix_path.open() as handle:
            header = handle.readline()
            separator = ';' if header.count(';') > header.count(',') else ','
            handle.seek(0)
            matrix = list(csv.DictReader(handle, delimiter=separator))
        assert len(matrix) == 12
        text = '# Matrice données–relations–médiums\n\n'
        for row in matrix:
            text += '## ' + next(iter(row.values())) + '\n\n'
            for key, val in row.items():
                text += '**' + key + ' :** ' + str(val) + '\n\n'
        pages.append(page('Matrice — données, règles, interactions, médiums et limites', text))
    else:
        raise ValueError(mode)
    payload = {'parent': {'page_id': parent_id}, 'allow_async': False, 'pages': pages}
    target = folder / ('payload-' + mode + '.json')
    target.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    print(str(target))
    print('Pages:', len(pages), 'Octets de contenu:', sum(len(p['content'].encode()) for p in pages))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=['documents','prototypes'])
    parser.add_argument('--parent')
    args = parser.parse_args()
    write_payload(args.mode, args.parent)
