from database import app, db, Regel
import pytest # type: ignore

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    db.create_all()
    yield app.test_client()
    db.drop_all()

def test_create_regel(client):
    response = client.post('/regeln', json={
        "reglename": "800m Lauf Gold",
        "strecke": 800,
        "zeit_in_sekunden": 180,
        "punkte": 10,
        "gueltig_ab": "2025-01-01"
    })
    assert response.status_code == 201