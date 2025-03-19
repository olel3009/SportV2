# tests/conftest.py
import pytest
from database import create_app, db

@pytest.fixture
def app():
    """
    Erstellt eine Test-App mit einer in-memory SQLite-Datenbank.
    """
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """
    Testclient zum Aufrufen der Flask-Endpunkte.
    """
    return app.test_client()
