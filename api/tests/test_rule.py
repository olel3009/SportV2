import pytest

def test_create_regel(client):
    """
    Testet das Anlegen einer neuen Regel per POST /regeln.
    """
    response = client.post("/regeln", json={
        "rulename": "Kraftübung",
        "description": "Gewichtheben max. 50kg",
        "disciplin": "Kraft",
        "distance": 0,
        "time_in_seconds": 60,
        "points": 3,
        "valid_start": "01-01-2025",
        "valid_end": "31-12-2025"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Regel hinzugefügt"
    assert "id" in data


def test_get_regeln(client):
    """
    Testet das Abrufen aller Regeln per GET /regeln.
    """
    # Mind. 1 Regel anlegen:
    client.post("/regeln", json={
        "rulename": "Schwimmen Bronze 400m",
        "description": "400m in 12 Minuten",
        "disciplin": "Schwimmen",
        "distance": 400,
        "time_in_seconds": 720,
        "points": 3,
        "valid_start": "01-05-2025",
        "valid_end": "01-08-2025"
    })

    response = client.get("/regeln")
    assert response.status_code == 200
    regeln_list = response.get_json()
    assert isinstance(regeln_list, list)
    assert len(regeln_list) >= 1

def test_update_regel(client):
    """
    Testet das Aktualisieren einer Regel per PUT /regeln/<id>.
    Prüft außerdem, ob die Version erhöht wird.
    """
    # 1) Regel anlegen
    create_resp = client.post("/regeln", json={
        "rulename": "Kraftübung",
        "description": "Gewichtheben max. 50kg",
        "disciplin": "Kraft",
        "distance": 0,
        "time_in_seconds": 60,
        "points": 3,
        "valid_start": "01-01-2025",
        "valid_end": "31-12-2025"
    })
    assert create_resp.status_code == 201
    rule_id = create_resp.get_json()["id"]

    # 2) Update
    update_resp = client.put(f"/regeln/{rule_id}", json={
        "description": "Gewichtheben max. 55kg",
        "points": 2
    })
    assert update_resp.status_code == 200
    assert update_resp.get_json()["message"] == "Regel aktualisiert"

    # 3) Prüfen, ob geändert & Version hochgezählt
    get_resp = client.get("/regeln")
    all_rules = get_resp.get_json()
    updated = next((r for r in all_rules if r["id"] == rule_id), None)
    assert updated is not None
    assert updated["description"] == "Gewichtheben max. 55kg"
    assert updated["points"] == 2
    # Falls dein Code version += 1 macht:
    assert updated["version"] == 2

def test_delete_regel(client):
    """
    Testet das Löschen einer Regel per DELETE /regeln/<id>.
    """
    # Regel anlegen
    create_resp = client.post("/regeln", json={
        "rulename": "Testregel",
        "description": "Dies ist nur ein Test",
        "disciplin": "Koordination",
        "distance": 100,
        "time_in_seconds": 40,
        "points": 3,
        "valid_start": "01-01-2026",
        "valid_end": "31-12-2026"
    })
    rule_id = create_resp.get_json()["id"]

    # Löschen
    delete_resp = client.delete(f"/regeln/{rule_id}")
    assert delete_resp.status_code == 200
    assert delete_resp.get_json()["message"] == "Regel gelöscht"

    # Prüfen, ob sie weg ist
    get_resp = client.get("/regeln")
    all_rules = get_resp.get_json()
    assert not any(r["id"] == rule_id for r in all_rules)
