import pytest
from datetime import datetime

def test_create_athlete(client):
    """
    Testet das Anlegen eines neuen Athleten per POST /athletes.
    """
    response = client.post("/athletes", json={
        "first_name": "Max",
        "last_name": "Mustermann",
        "birth_date": "1.1.2003",  
        "gender": "m"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Athlet hinzugefügt"
    assert "id" in data  # Merkt euch die ID für weitere Tests

def test_create_athlete_default_swim_certificate(client):
    """
    Testet das Anlegen eines neuen Athleten per POST /athletes
    OHNE Angabe von swim_certificate -> sollte default = false sein
    """
    response = client.post("/athletes", json={
        "first_name": "Max",
        "last_name": "Mustermann",
        "birth_date": "1.1.2003",  
        "gender": "m"
        # swim_certificate nicht mitgeschickt => default false
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Athlet hinzugefügt"
    assert "id" in data
    new_id = data["id"]

    # Prüfen, ob swim_certificate tatsächlich false ist:
    get_resp = client.get("/athletes")
    all_athletes = get_resp.get_json()
    created = next((a for a in all_athletes if a["id"] == new_id), None)
    assert created is not None
    assert created["swim_certificate"] == False

def test_create_athlete_with_swim_certificate_true(client):
    """
    Testet das Anlegen eines neuen Athleten mit swim_certificate = true
    """
    response = client.post("/athletes", json={
        "first_name": "Anna",
        "last_name": "Schwimmer",
        "birth_date": "1.1.2003",
        "gender": "f",
        "swim_certificate": True
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Athlet hinzugefügt"
    new_id = data["id"]

    # Prüfen, ob swim_certificate = true in der DB
    get_resp = client.get("/athletes")
    all_athletes = get_resp.get_json()
    created = next((a for a in all_athletes if a["id"] == new_id), None)
    assert created is not None
    assert created["swim_certificate"] == True

def test_get_athletes(client):
    """
    Testet das Abrufen aller Athleten per GET /athletes.
    """
    # Zuerst min. 1 Athlet anlegen
    client.post("/athletes", json={
        "first_name": "Anna",
        "last_name": "Schmidt",
        "birth_date": "1.1.2006",
        "gender": "f"
    })

    response = client.get("/athletes")
    assert response.status_code == 200
    data = response.get_json()
    # 'data' sollte eine Liste sein
    assert isinstance(data, list)
    assert len(data) >= 1
    # Beispiel-Check auf 'id' im ersten Element
    first = data[0]
    assert "id" in first
    assert "first_name" in first
    assert "swim_certificate" in first


def test_update_athlete(client):
    """
    Testet das Aktualisieren eines Athleten per PUT /athletes/<id>.
    """
    # 1) Athlet anlegen
    create_resp = client.post("/athletes", json={
        "first_name": "Erika",
        "last_name": "Mustermann",
        "birth_date": "1.1.2003",
        "gender": "f"
    })
    athlete_id = create_resp.get_json()["id"]

    # 2) Update
    response = client.put(f"/athletes/{athlete_id}", json={
        "first_name": "ErikA-Lena"  # Nur Vorname ändern
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Athlet aktualisiert"

    # 3) Prüfen, ob geändert
    get_resp = client.get("/athletes")
    all_athletes = get_resp.get_json()
    updated = next((x for x in all_athletes if x["id"] == athlete_id), None)
    assert updated is not None
    assert updated["first_name"] == "ErikA-Lena"

def test_update_athlete_swim_certificate(client):
    """
    Testet das Aktualisieren eines Athleten per PUT /athletes/<id>
    inklusive Ändern von swim_certificate.
    """
    # 1) Athlet anlegen
    create_resp = client.post("/athletes", json={
        "first_name": "Peter",
        "last_name": "Lustig",
        "birth_date": "1.1.2003",
        "gender": "m",
        "swim_certificate": False
    })
    assert create_resp.status_code == 201
    athlete_id = create_resp.get_json()["id"]

    # 2) Update: swim_certificate -> true
    response = client.put(f"/athletes/{athlete_id}", json={
        "swim_certificate": True
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Athlet aktualisiert"

    # 3) Prüfen, ob geändert
    get_resp = client.get("/athletes")
    all_athletes = get_resp.get_json()
    updated = next((x for x in all_athletes if x["id"] == athlete_id), None)
    assert updated is not None
    assert updated["swim_certificate"] == True

def test_delete_athlete(client):
    """
    Testet das Löschen eines Athleten per DELETE /athletes/<id>.
    """
    # 1) Athlet anlegen
    create_resp = client.post("/athletes", json={
        "first_name": "Peter",
        "last_name": "Lustig",
        "birth_date": "1.1.2003",
        "gender": "m"
    })
    athlete_id = create_resp.get_json()["id"]

    # 2) Löschen
    delete_resp = client.delete(f"/athletes/{athlete_id}")
    assert delete_resp.status_code == 200
    assert delete_resp.get_json()["message"] == "Athlet gelöscht"

    # 3) Prüfen, ob weg
    get_resp = client.get("/athletes")
    all_athletes = get_resp.get_json()
    assert not any(a["id"] == athlete_id for a in all_athletes)


def test_export_athlete_pdf(client):
    """
    Testet den PDF-Export eines Athleten per GET /athletes/<id>/export/pdf.
    Legt dafür zuvor den Athleten und optional seine Results an.
    """
    # 1) Athlet anlegen
    create_resp = client.post("/athletes", json={
        "first_name": "Lena",
        "last_name": "Test",
        "birth_date": "1.1.2003",
        "gender": "f"
    })
    athlete_id = create_resp.get_json()["id"]

    # 2) (Optional) Results für diesen Athleten anlegen, falls dein PDF-Export 
    #    ab 1 Result Sinn macht. Z.B.:
    client.post("/results", json={
        "athlete_id": athlete_id,
        "year": 2023,
        "age": 28,
        "disciplin": "Ausdauer",
        "result": 12.34,
        "points": 3,
        "medal": "Gold"
    })

    # 3) PDF-Export aufrufen
    export_resp = client.get(f"/athletes/{athlete_id}/export/pdf")
    assert export_resp.status_code == 200
    data = export_resp.get_json()
    assert data["message"] == "Export erfolgreich"
    assert "pdf_feedback" in data
