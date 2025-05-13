import pytest

def test_create_rule(client):
    """
    Testet das Anlegen einer neuen Regel per POST /rules.
    Prüft, ob Version = 1 gesetzt wird, wenn noch keine Regel mit diesem Namen existiert.
    """
    # Vorher ggf. discipline anlegen, wenn discipline_id=1 nicht existiert:
    # disc_resp = client.post("/disciplines", json={...})
    # discipline_id = disc_resp.get_json()["id"]
    discipline_id = 1  # Hier als Beispiel

    response = client.post("/rules", json={
        "discipline_id": discipline_id,
        "rule_name": "Kraftübung",
        "unit": "Punkte",
        "description_m": "Kraftübung 80g",
        "description_f": "Kraftübung 70g",
        "min_age": 18,
        "max_age": 40,
        "threshold_bronze_m": 10.0,
        "threshold_silver_m": 12.0,
        "threshold_gold_m": 15.0,
        "threshold_bronze_f": 8.0,
        "threshold_silver_f": 10.0,
        "threshold_gold_f": 13.0,
        "valid_start": "01.01.2025",
        "valid_end": "31.12.2025"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Rule created"
    assert "id" in data
    assert "version" in data
    # Wenn es die erste Regel mit diesem Namen war, version = 1
    assert data["version"] == 1

def test_get_rules(client):
    """
    Testet das Abrufen aller Regeln per GET /rules
    """
    # Mind. 1 Regel anlegen
    discipline_id = 1  # oder neu anlegen
    client.post("/rules", json={
        "discipline_id": discipline_id,
        "rule_name": "Testregel",
        "unit": "Punkte",
        "description_m": "Kraftübung 80g",
        "description_f": "Kraftübung 70g",
        "min_age": 20,
        "max_age": 30,
        "threshold_bronze_m": 5.0,
        "threshold_silver_m": 6.0,
        "threshold_gold_m": 7.0,
        "threshold_bronze_f": 4.0,
        "threshold_silver_f": 5.0,
        "threshold_gold_f": 6.0,
        "valid_start": "01.01.2026",
        "valid_end": "31.12.2026"
    })

    response = client.get("/rules")
    assert response.status_code == 200
    rule_list = response.get_json()
    assert isinstance(rule_list, list)
    assert len(rule_list) >= 1
    # Check
    first = rule_list[0]
    assert "id" in first
    assert "rule_name" in first
    assert "version" in first

def test_update_rule(client):
    """
    Testet das Aktualisieren einer Regel per PUT /rules/<id>
    und prüft, ob Felder geändert wurden.
    """
    # 1) Regel anlegen
    discipline_id = 1
    create_resp = client.post("/rules", json={
        "discipline_id": discipline_id,
        "rule_name": "Kraftübung",
        "unit": "Punkte",
        "description_m": "Kraftübung 80g",
        "description_f": "Kraftübung 70g",
        "min_age": 18,
        "max_age": 40,
        "threshold_bronze_m": 5.0,
        "threshold_silver_m": 10.0,
        "threshold_gold_m": 15.0,
        "threshold_bronze_f": 4.0,
        "threshold_silver_f": 8.0,
        "threshold_gold_f": 12.0,
        "valid_start": "01.01.2025",
        "valid_end": "31.12.2025"
    })
    assert create_resp.status_code == 201
    rule_id = create_resp.get_json()["id"]

    # 2) Update
    update_resp = client.put(f"/rules/{rule_id}", json={
        "description_m": "Gewichtheben max. 65kg",
        "max_age": 50
    })
    assert update_resp.status_code == 200
    assert update_resp.get_json()["message"] == "Rule updated"

    # 3) Prüfen, ob geändert
    get_all = client.get("/rules").get_json()
    updated = next((r for r in get_all if r["id"] == rule_id), None)
    assert updated is not None
    assert updated["description_m"] == "Gewichtheben max. 65kg"

def test_delete_rule(client):
    """
    Testet das Löschen einer Regel per DELETE /rules/<id>
    """
    # 1) Regel anlegen
    discipline_id = 1
    create_resp = client.post("/rules", json={
        "discipline_id": discipline_id,
        "rule_name": "DeleteTest",
        "unit": "Punkte",
        "description_m": "Kraftübung 80g",
        "description_f": "Kraftübung 70g",
        "min_age": 25,
        "max_age": 35,
        "threshold_bronze_m": 3.0,
        "threshold_silver_m": 5.0,
        "threshold_gold_m": 7.0,
        "threshold_bronze_f": 2.0,
        "threshold_silver_f": 4.0,
        "threshold_gold_f": 6.0,
        "valid_start": "01.01.2030"
    })
    assert create_resp.status_code == 201
    rule_id = create_resp.get_json()["id"]

    # 2) Löschen
    delete_resp = client.delete(f"/rules/{rule_id}")
    assert delete_resp.status_code == 200
    assert delete_resp.get_json()["message"] == "Rule deleted"

    # 3) Prüfen, ob weg
    all_rules = client.get("/rules").get_json()
    assert not any(r["id"] == rule_id for r in all_rules)
