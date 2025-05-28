import pytest
from datetime import datetime

def test_create_athlete(client):
    """
    Testet das Anlegen eines neuen Athleten per POST /athletes.
    """
    response = client.post("/athletes", json={
        "first_name": "Max",
        "last_name": "Mustermann",
        "email": "max.mustermann@test.de",
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
        "email": "max.mustermann@test.de",
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

def test_get_athletes(client):
    """
    Testet das Abrufen aller Athleten per GET /athletes.
    """
    # Zuerst min. 1 Athlet anlegen
    client.post("/athletes", json={
        "first_name": "Anna",
        "last_name": "Schmidt",
        "email": "anna.schmidt@test.de",
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


def test_update_athlete(client):
    """
    Testet das Aktualisieren eines Athleten per PUT /athletes/<id>.
    """
    # 1) Athlet anlegen
    create_resp = client.post("/athletes", json={
        "first_name": "Erika",
        "last_name": "Mustermann",
        "email": "erika.mustermann@test.de",
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

def test_update_athlete_gender_email(client):
    """
    Testet das Aktualisieren eines Athleten per PUT /athletes/<id>
    inklusive Ändern von swim_certificate.
    """
    # 1) Athlet anlegen
    create_resp = client.post("/athletes", json={
        "first_name": "Peter",
        "last_name": "Lustig",
        "email": "peter.lustig@test.de",
        "birth_date": "1.1.2003",
        "gender": "m"
    })
    assert create_resp.status_code == 201
    athlete_id = create_resp.get_json()["id"]

    # 2) Update: swim_certificate -> true
    response = client.put(f"/athletes/{athlete_id}", json={
        "gender": "f",
        "email": "anna.lustig@test.de"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Athlet aktualisiert"

    # 3) Prüfen, ob geändert
    get_resp = client.get("/athletes")
    all_athletes = get_resp.get_json()
    updated = next((x for x in all_athletes if x["id"] == athlete_id), None)
    assert updated is not None
    assert updated["gender"] == "f"
    assert updated["email"] == "anna.lustig@test.de"

def test_delete_athlete(client):
    """
    Testet das Löschen eines Athleten per DELETE /athletes/<id>.
    """
    # 1) Athlet anlegen
    create_resp = client.post("/athletes", json={
        "first_name": "Peter",
        "last_name": "Lustig",
        "email": "peter.lustig@test.de",
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
