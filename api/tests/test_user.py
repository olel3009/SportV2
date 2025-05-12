import pytest
'''
def test_create_user(client):
    """
    Testet das Anlegen eines neuen Users mit trainer_id per POST /users.
    Prüft, ob der Status 201 und ein 'id' zurückkommen.
    """
    response = client.post("/users", json={
        "email": "traineruser@example.com",
        "password": "SuperSecure123"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "User erstellt"
    assert "id" in data


def test_get_users(client):
    """
    Testet das Abrufen aller User per GET /users.
    """
    # Mindestens 1 User anlegen
    client.post("/users", json={
        "email": "testget@example.com",
        "password": "TestGetPass"
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
        "password": "UpdatePass123"
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
        "password": "DeletePass123"
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
'''