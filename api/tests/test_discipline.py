import pytest

def test_create_discipline(client):
    """
    Testet das Anlegen einer neuen Disziplin per POST /disciplines
    """
    response = client.post("/disciplines", json={
        "group": "Ausdauer",
        "discipline_name": "Laufen"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Discipline created"
    assert "id" in data

def test_get_disciplines(client):
    """
    Testet das Abrufen aller Disziplinen per GET /disciplines
    """
    # Mind. 1 Disziplin anlegen
    client.post("/disciplines", json={
        "group": "Kraft",
        "discipline_name": "Kugelstoßen"
    })

    response = client.get("/disciplines")
    assert response.status_code == 200
    disc_list = response.get_json()
    assert isinstance(disc_list, list)
    assert len(disc_list) >= 1
    # Beispielhafter Check
    first = disc_list[0]
    assert "id" in first
    assert "group" in first
    assert "discipline_name" in first

def test_update_discipline(client):
    """
    Testet das Aktualisieren einer Disziplin per PUT /disciplines/<id>
    """
    # 1) Disziplin anlegen
    create_resp = client.post("/disciplines", json={
        "group": "Schnelligkeit",
        "discipline_name": "Laufen"
    })
    assert create_resp.status_code == 201
    disc_id = create_resp.get_json()["id"]

    # 2) Update
    response = client.put(f"/disciplines/{disc_id}", json={
        "group": "Ausdauer"
    })
    assert response.status_code == 200
    assert response.get_json()["message"] == "Discipline updated"

    # 3) Prüfen, ob geändert
    get_all = client.get("/disciplines").get_json()
    updated = next((d for d in get_all if d["id"] == disc_id), None)
    assert updated is not None
    assert updated["group"] == "Ausdauer"

def test_delete_discipline(client):
    """
    Testet das Löschen einer Disziplin per DELETE /disciplines/<id>
    """
    # 1) Disziplin anlegen
    create_resp = client.post("/disciplines", json={
        "group": "Koordination",
        "discipline_name": "Drehwurf"
    })
    disc_id = create_resp.get_json()["id"]

    # 2) Löschen
    delete_resp = client.delete(f"/disciplines/{disc_id}")
    assert delete_resp.status_code == 200
    assert delete_resp.get_json()["message"] == "Discipline deleted"

    # 3) Prüfen, ob weg
    get_all = client.get("/disciplines").get_json()
    assert not any(d["id"] == disc_id for d in get_all)
