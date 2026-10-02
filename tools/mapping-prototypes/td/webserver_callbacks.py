"""PERFUMUM — callbacks du Web Server DAT de TouchDesigner (relais direct).

NON TESTÉ DANS TOUCHDESIGNER : les noms de callbacks suivent la documentation du
Web Server DAT ; vérifiez-les dans votre version avant une séance.

Montage :
  1. Web Server DAT, port 9980, Active = On ; coller ce fichier comme DAT de callbacks.
  2. Table DAT nommé `events` à côté (rempli ici, lu par le rendu).
  3. Dans le prototype navigateur : « Relayer (WebSocket) » vers ws://127.0.0.1:9980.

TouchDesigner reste consommateur : il reçoit des lignes déjà écrites et chaînées par
le navigateur. Il ne réécrit pas le run ; un trou de `seq` est affiché, pas comblé.
"""

import json

EXPECTED = {"seq": 0, "run_id": None}


def _table():
    return op("events")


def _ensure_header(table):
    if table.numRows == 0:
        table.appendRow(["seq", "ts_utc", "event_type", "actor_source", "flux", "pointer", "gap", "payload_json"])


def onServerStart(webServerDAT):
    _ensure_header(_table())


def onServerStop(webServerDAT):
    return


def onHTTPRequest(webServerDAT, request, response):
    response["statusCode"] = 200
    response["statusReason"] = "OK"
    response["data"] = "PERFUMUM relais TouchDesigner : WebSocket uniquement."
    return response


def onWebSocketOpen(webServerDAT, client, uri):
    return


def onWebSocketClose(webServerDAT, client):
    return


def onWebSocketReceiveText(webServerDAT, client, data):
    table = _table()
    _ensure_header(table)
    try:
        line = json.loads(data)
    except ValueError:
        table.appendRow(["?", "", "ligne illisible", "", "", "", "", data[:200]])
        return
    if line.get("kind") == "header" or line.get("run_id") != EXPECTED["run_id"]:
        # Nouveau run (ou reconnexion) : on repart de son en-tête.
        EXPECTED["run_id"] = line.get("run_id")
        EXPECTED["seq"] = line.get("seq", 0)
    gap = ""
    if line.get("seq") != EXPECTED["seq"]:
        # Absence de transmission : affichée comme donnée, jamais comblée.
        gap = f"trou : attendu {EXPECTED['seq']}, reçu {line.get('seq')}"
    EXPECTED["seq"] = (line.get("seq") or 0) + 1
    table.appendRow([
        line.get("seq"), line.get("ts_utc"), line.get("event_type", line.get("kind")),
        line.get("actor_source", ""), line.get("flux", ""),
        f"{line.get('run_id')}#{line.get('seq')} · {str(line.get('hash', ''))[:8]}",
        gap, json.dumps(line.get("payload", {}), ensure_ascii=False),
    ])


def onWebSocketReceiveBinary(webServerDAT, client, data):
    return


def onWebSocketReceivePing(webServerDAT, client, data):
    webServerDAT.webSocketSendPong(client, data=data)


def onWebSocketReceivePong(webServerDAT, client, data):
    return
