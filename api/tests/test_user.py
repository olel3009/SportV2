import pytest

def test_create_user_with_trainer(client):
    """
    Testet das Anlegen eines neuen Users mit trainer_id per POST /users.
    Prüft, ob der Status 201 und ein 'id' zurückkommen.
    """
    # Falls trainer_id=1 existiert, sonst anlegen:
    trainer_resp = client.post("/trainers", json={
        "first_name": "Max",
        "last_name": "Mustermann",
        "email": "max@example.com",
        "birth_date": "01-01-1990",
        "gender": "m"
    })
    trainer_id = trainer_resp.get_json()["id"]

    response = client.post("/users", json={
        "email": "traineruser@example.com",
        "password": "SuperSecure123",
        "trainer_id": 1
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "User erstellt"
    assert "id" in data


def test_create_user_with_athlete(client):
    """
    Testet das Anlegen eines neuen Users mit athlete_id per POST /users.
    """
    # Falls athlete_id=1 existiert, sonst anlegen:
    athlete_resp = client.post("/athletes", json={
        "first_name": "Max",
        "last_name": "Mustermann",
        "birth_date": "01-01-2000",  # TT-MM-YYYY
        "gender": "m"
    })
    athlete_id = athlete_resp.get_json()["id"]

    response = client.post("/users", json={
        "email": "athleteuser@example.com",
        "password": "AnotherSecurePass!",
        "athlete_id": 1
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "User erstellt"
    assert "id" in data


def test_create_user_with_both_roles(client):
    """
    Testet, dass User mit trainer_id UND athlete_id nicht erlaubt ist.
    Erwartet einen 400-Fehler.
    """
    response = client.post("/users", json={
        "email": "bothroles@example.com",
        "password": "Password123",
        "trainer_id": 1,
        "athlete_id": 2
    })
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data or "Ein User kann entweder Trainer oder Athlet sein, aber nicht beides" in str(data)


def test_create_user_with_no_role(client):
    """
    Testet, dass User ohne trainer_id UND athlete_id nicht erlaubt ist.
    Erwartet einen 400-Fehler.
    """
    response = client.post("/users", json={
        "email": "norole@example.com",
        "password": "NoRolePass"
    })
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data or "Ein User kann entweder Trainer oder Athlet sein" in str(data)


def test_get_users(client):
    """
    Testet das Abrufen aller User per GET /users.
    """
    # Mindestens 1 User anlegen
    client.post("/users", json={
        "email": "testget@example.com",
        "password": "TestGetPass",
        "trainer_id": 1
    })

    response = client.get("/users")
    assert response.status_code == 200
    users_list = response.get_json()
    assert isinstance(users_list, list)
    assert len(users_list) >= 1


def test_update_user(client):
    """
    Testet das Aktualisieren eines Users per PUT /users/<id>.
    """
    # 1) User anlegen
    create_resp = client.post("/users", json={
        "email": "update@example.com",
        "password": "UpdatePass123",
        "trainer_id": 1
    })
    assert create_resp.status_code == 201
    user_id = create_resp.get_json()["id"]

    # 2) Update
    update_resp = client.put(f"/users/{user_id}", json={
        "email": "updateNew@example.com",
        "password": "NewPass456"
    })
    assert update_resp.status_code == 200
    data = update_resp.get_json()
    assert data["message"] == "User aktualisiert"

    # 3) Prüfen, ob geändert
    get_all = client.get("/users")
    all_users = get_all.get_json()
    updated = next((u for u in all_users if u["id"] == user_id), None)
    assert updated is not None
    assert updated["email"] == "updateNew@example.com"


def test_delete_user(client):
    """
    Testet das Löschen eines Users per DELETE /users/<id>.
    """
    # 1) User anlegen
    create_resp = client.post("/users", json={
        "email": "delete@example.com",
        "password": "DeletePass123",
        "trainer_id": 1
    })
    assert create_resp.status_code == 201
    user_id = create_resp.get_json()["id"]

    # 2) Löschen
    delete_resp = client.delete(f"/users/{user_id}")
    assert delete_resp.status_code == 200
    data = delete_resp.get_json()
    assert data["message"] == "User gelöscht"

    # 3) Prüfen, ob weg
    get_resp = client.get("/users")
    all_users = get_resp.get_json()
    assert not any(u["id"] == user_id for u in all_users)
