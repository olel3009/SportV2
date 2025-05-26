import pytest
from datetime import datetime

@pytest.mark.skip
def test_create_athlete(client):
    """
    Testet das Anlegen eines neuen Athleten per POST /athletes.
    """
    # ...

@pytest.mark.skip
def test_create_athlete_default_swim_certificate(client):
    """
    Testet das Anlegen eines neuen Athleten per POST /athletes
    OHNE Angabe von swim_certificate -> sollte default = false sein
    """
    # ...

@pytest.mark.skip
def test_create_athlete_with_swim_certificate_true(client):
    """
    Testet das Anlegen eines neuen Athleten mit swim_certificate = true
    """
    # ...

@pytest.mark.skip
def test_get_athletes(client):
    """
    Testet das Abrufen aller Athleten per GET /athletes.
    """
    # ...

@pytest.mark.skip
def test_update_athlete(client):
    """
    Testet das Aktualisieren eines Athleten per PUT /athletes/<id>.
    """
    # ...

@pytest.mark.skip
def test_update_athlete_swim_certificate(client):
    """
    Testet das Aktualisieren eines Athleten per PUT /athletes/<id>
    inklusive Ändern von swim_certificate.
    """
    # ...

@pytest.mark.skip
def test_delete_athlete(client):
    """
    Testet das Löschen eines Athleten per DELETE /athletes/<id>.
    """
    # ...

@pytest.mark.skip
def test_export_athlete_pdf(client):
    """
    Testet den PDF-Export eines Athleten per GET /athletes/<id>/export/pdf.
    Legt dafür zuvor den Athleten und optional seine Results an.
    """
    # ...
