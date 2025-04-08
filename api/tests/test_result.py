import pytest
from datetime import datetime

# Hilfsfunktionen, um in jedem Test einen Athlete und einen Rule anzulegen.
def create_test_athlete(client, first_name="Test", last_name="Athlete", birth_date="01-01-2000", gender="m"):
    resp = client.post("/athletes", json={
        "first_name": first_name,
        "last_name": last_name,
        "birth_date": birth_date,  # Format: TT-MM-YYYY
        "gender": gender
    })
    assert resp.status_code == 201
    athlete_id = resp.get_json()["id"]
    return athlete_id

def create_test_rule(client, 
                     rule_name="Test Rule",
                     discipline_id =1, 
                     min_age=18, 
                     max_age=40, 
                     action="Test Action",
                     valid_start="2025-01-01", 
                     valid_end="2025-12-31",
                     unit="time",
                     description_m="Kraftübung 80g",
                     description_f="Kraftübung 80g",
                     threshold_bronze_m=30.0,
                     threshold_silver_m=25.0,
                     threshold_gold_m=20.0,
                     threshold_bronze_f=30.0,  
                     threshold_silver_f=25.0,
                     threshold_gold_f=20.0):

    resp = client.post("/rules", json={
        "rule_name": rule_name,
        "discipline_id": discipline_id,
        "min_age": min_age,
        "max_age": max_age,
        "threshold_bronze_m": threshold_bronze_m,
        "threshold_silver_m": threshold_silver_m,
        "threshold_gold_m": threshold_gold_m,
        "threshold_bronze_f": threshold_bronze_f,  
        "threshold_silver_f": threshold_silver_f,
        "threshold_gold_f": threshold_gold_f,
        "action": action,
        "valid_start": valid_start,  
        "valid_end": valid_end,      
        "unit": unit,
        "description_m": description_m,
        "description_f": description_f,
    })
    assert resp.status_code == 201
    rule_data = resp.get_json()
    rule_id = rule_data["id"]
    return rule_id

# Test für unit "time" (niedriger Wert ist besser)
def test_create_result_time(client):
    """
    Testet das Erstellen eines neuen Result, bei unit "time".
    Bei time ist ein niedrigerer Wert besser:
      - gold: result <= 20
      - silver: result <= 25
      - bronze: result <= 30
    """
    # Erstelle einen Athlete und einen Rule (unit "time")
    athlete_id = create_test_athlete(client, first_name="Time", last_name="Tester", birth_date="01-01-1990", gender="m")
    rule_id = create_test_rule(client, rule_name="Time Test Rule", unit="time",
                               threshold_bronze_m=30.0,
                               threshold_silver_m=25.0,
                               threshold_gold_m=20.0)
    # Wähle ein Prüfungsjahr, das innerhalb der gültigen Zeit liegt, z. B. 2025
    # Alter = 2025 - 1990 = 35
    # Teste: result = 18 (niedriger als gold, daher sollte Gold vergeben werden)
    resp = client.post("/results", json={
        "athlete_id": athlete_id,
        "rule_id": rule_id,
        "year": 2025,
        "result": 18.0
        # medal wird automatisch ermittelt, daher nicht mitgesendet
    })
    assert resp.status_code == 201
    data = resp.get_json()
    result_id = data["id"]
    
    # GET the result and check that the medal is "Gold"
    get_resp = client.get("/results")
    results = get_resp.get_json()
    created_result = next((r for r in results if r["id"] == result_id), None)
    assert created_result is not None
    assert created_result["medal"] == "Gold"
    # Prüfe auch, ob age korrekt berechnet wurde (2025 - 1990 = 35)
    assert created_result["age"] == 35

# Test für unit "distance" (höherer Wert ist besser)
def test_create_result_distance(client):
    """
    Testet das Erstellen eines neuen Result, bei unit "distance".
    Für distance: Je höher, desto besser:
      - gold: result >= 15
      - silver: result >= 10
      - bronze: result >= 5
    """
    # Für diesen Test passen wir die Thresholds entsprechend an.
    athlete_id = create_test_athlete(client, first_name="Distance", last_name="Tester", birth_date="01-01-1995", gender="m")
    # Hier definieren wir für unit "distance" höhere Werte als besser.
    # Wir setzen beispielsweise:
    # Bronze: 5, Silver: 10, Gold: 15 (für männlich, gleiche für weiblich in diesem Test)
    rule_id = create_test_rule(client, rule_name="Distance Test Rule", unit="distance",
                               threshold_bronze_m=5.0,
                               threshold_silver_m=10.0,
                               threshold_gold_m=15.0)
    # Prüfungsjahr: 2025; Alter = 2025 - 1995 = 30.
    # Teste: result = 16.0, also >= gold, sodass "Gold" vergeben werden sollte.
    resp = client.post("/results", json={
        "athlete_id": athlete_id,
        "rule_id": rule_id,
        "year": 2025,
        "result": 16.0
    })
    assert resp.status_code == 201
    data = resp.get_json()
    result_id = data["id"]

    # GET the result and check that the medal is "Gold"
    get_resp = client.get("/results")
    results = get_resp.get_json()
    created_result = next((r for r in results if r["id"] == result_id), None)
    assert created_result is not None
    assert created_result["medal"] == "Gold"
    # Check age: 2025 - 1995 = 30
    assert created_result["age"] == 30

def test_update_result(client):
    """
    Testet das Aktualisieren eines vorhandenen Result.
    Wir ändern den result-Wert, sodass sich die Medal ändert.
    """
    # Erstelle Athlete und Rule (unit "time" Test)
    athlete_id = create_test_athlete(client, first_name="Update", last_name="Tester", birth_date="01-01-1985", gender="m")
    rule_id = create_test_rule(client, rule_name="Update Time Rule", unit="time",
                               threshold_bronze_m=30.0,
                               threshold_silver_m=25.0,
                               threshold_gold_m=20.0)
    resp = client.post("/results", json={
        "athlete_id": athlete_id,
        "rule_id": rule_id,
        "year": 2025,
        "result": 26.0
    })
    assert resp.status_code == 201
    result_id = resp.get_json()["id"]

    # Update: setze result auf 24 (24 <= 25, aber >20 => Silver)
    update_resp = client.put(f"/results/{result_id}", json={
        "result": 24.0
    })
    assert update_resp.status_code == 200
    # Hole alle Ergebnisse und prüfe
    get_resp = client.get("/results")
    results = get_resp.get_json()
    updated_result = next((r for r in results if r["id"] == result_id), None)
    assert updated_result is not None
    assert updated_result["result"] == 24.0
    assert updated_result["medal"] == "Silber"

def test_delete_result(client):
    """
    Testet das Löschen eines Result-Datensatzes per DELETE /results/<id>
    """
    # Erstelle Athlete und Rule (unit "time")
    athlete_id = create_test_athlete(client, first_name="Delete", last_name="Tester", birth_date="01-01-1992", gender="m")
    rule_id = create_test_rule(client, rule_name="Delete Rule", unit="time",
                               threshold_bronze_m=30.0,
                               threshold_silver_m=25.0,
                               threshold_gold_m=20.0)
    resp = client.post("/results", json={
        "athlete_id": athlete_id,
        "rule_id": rule_id,
        "year": 2025,
        "result": 22.0 
    })
    assert resp.status_code == 201
    result_id = resp.get_json()["id"]

    # Lösche das Result
    del_resp = client.delete(f"/results/{result_id}")
    assert del_resp.status_code == 200
    assert del_resp.get_json()["message"] == "Result deleted"

    # Prüfe, dass es nicht mehr vorhanden ist
    get_resp = client.get("/results")
    all_results = get_resp.get_json()
    assert not any(r["id"] == result_id for r in all_results)
