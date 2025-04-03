import pytest

def test_create_result(client):
    """
    Testet das Anlegen eines neuen Ergebnisses per POST /results.
    """
    response = client.post("/results", json={
        "athlete_id": 1,     # Falls du bereits einen Athleten in der DB hast
        "year": 2023,
        "age": 25,
        "disciplin": "Ausdauer",
        "result": "12,5",
        "points": 3,
        "medal": "Gold"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Ergebnis hinzugefügt"
    assert "id" in data


def test_get_results(client):
    """
    Testet das Abrufen aller Ergebnisse per GET /results.
    """
    # Mind. 1 Ergebnis anlegen
    client.post("/results", json={
        "athlete_id": 1,
        "year": 2022,
        "age": 30,
        "disciplin": "Kraft",
        "result": "9,8",
        "points": 2,
        "medal": "Silber"
    })

    response = client.get("/results")
    assert response.status_code == 200
    data = response.get_json()
    # Sollte eine Liste sein
    assert isinstance(data, list)
    assert len(data) >= 1


def test_update_result(client):
    """
    Testet das Aktualisieren eines Ergebnisses per PUT /results/<id>.
    Prüft außerdem, ob die Version hochgezählt wird.
    """
    # 1) Ergebnis anlegen
    create_resp = client.post("/results", json={
        "athlete_id": 1,
        "year": 2021,
        "age": 29,
        "disciplin": "Schnelligkeit",
        "result": "11,11",
        "points": 3,
        "medal": "Bronze"
    })
    assert create_resp.status_code == 201
    new_id = create_resp.get_json()["id"]

    # 2) Update
    update_resp = client.put(f"/results/{new_id}", json={
        "year": 2022,
        "result": "10.5"
    })
    assert update_resp.status_code == 200
    update_data = update_resp.get_json()
    assert update_data["message"] == "Ergebnis aktualisiert"

    # 3) Prüfen, ob Daten und Version angepasst sind
    get_all_resp = client.get("/results")
    all_results = get_all_resp.get_json()
    updated = next((r for r in all_results if r["id"] == new_id), None)
    assert updated is not None
    assert updated["year"] == 2022
    assert updated["result"] == "10.5"
    # Falls deine Logik version += 1 macht:
    assert updated["version"] == 2


def test_delete_result(client):
    """
    Testet das Löschen eines Ergebnisses per DELETE /results/<id>.
    """
    # 1) Ergebnis anlegen
    create_resp = client.post("/results", json={
        "athlete_id": 1,
        "year": 2020,
        "age": 28,
        "disciplin": "Ausdauer",
        "result": "15,9",
        "points": 1,
        "medal": "Bronze"
    })
    result_id = create_resp.get_json()["id"]

    # 2) Löschen
    delete_resp = client.delete(f"/results/{result_id}")
    assert delete_resp.status_code == 200
    assert delete_resp.get_json()["message"] == "Ergebnis gelöscht"

    # 3) Prüfen, ob Ergebnis wirklich weg ist
    all_resp = client.get("/results")
    all_data = all_resp.get_json()
    assert not any(r["id"] == result_id for r in all_data)
