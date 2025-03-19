# tests/test_trainer.py
import pytest
from datetime import datetime

def test_create_trainer(client):
    """
    Testet das Anlegen eines neuen Trainers per POST /trainers
    """
    response = client.post("/trainers", json={
        "first_name": "Max",
        "last_name": "Mustermann",
        "email": "max@example.com",
        "birth_date": "01-01-1990",
        "gender": "m"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Trainer hinzugefügt"
    assert "id" in data

def test_get_trainers(client):
    """
    Testet das Abrufen aller Trainer per GET /trainers
    """
    # Vorher mind. 1 Trainer anlegen:
    client.post("/trainers", json={
        "first_name": "Erika",
        "last_name": "Mustermann",
        "email": "erika@example.com",
        "birth_date": "02-02-1985",
        "gender": "f"
    })

    response = client.get("/trainers")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_update_trainer(client):
    """
    Testet das Aktualisieren eines Trainers per PUT /trainers/<id>
    """
    # Zuerst einen Trainer anlegen
    create_resp = client.post("/trainers", json={
        "first_name": "Anna",
        "last_name": "Schmidt",
        "email": "anna@example.com",
        "birth_date": "01-03-1992",
        "gender": "f"
    })
    trainer_id = create_resp.get_json()["id"]

    # Jetzt updaten
    response = client.put(f"/trainers/{trainer_id}", json={
        "first_name": "Anna-Lena",
        "email": "anna.lena@example.com"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Trainer aktualisiert"

    # Prüfen, ob die Daten wirklich geändert wurden
    get_resp = client.get("/trainers")
    trainers = get_resp.get_json()
    updated_trainer = next((t for t in trainers if t["id"] == trainer_id), None)
    assert updated_trainer is not None
    assert updated_trainer["first_name"] == "Anna-Lena"
    assert updated_trainer["email"] == "anna.lena@example.com"

def test_delete_trainer(client):
    """
    Testet das Löschen eines Trainers per DELETE /trainers/<id>
    """
    # Trainer anlegen
    create_resp = client.post("/trainers", json={
        "first_name": "Peter",
        "last_name": "Lustig",
        "email": "peter@example.com",
        "birth_date": "05-05-1980",
        "gender": "m"
    })
    trainer_id = create_resp.get_json()["id"]

    # Löschen
    response = client.delete(f"/trainers/{trainer_id}")
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Trainer gelöscht"

    # Prüfen, ob wirklich gelöscht
    get_resp = client.get("/trainers")
    trainers = get_resp.get_json()
    # Trainer sollte nicht mehr in der Liste sein
    assert not any(t["id"] == trainer_id for t in trainers)
