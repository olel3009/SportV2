from database import db, create_app
from database.models import Trainer, Athlete, Discipline, Rule, Result, User
from datetime import datetime, date as _date
from api.logs.logger import logger

def parse_date(d: str) -> _date:
    """
    Wandelt einen String im Format 'DD.MM.YYYY' in ein datetime.date-Objekt.
    """
    return datetime.strptime(d, "%d.%m.%Y").date()

def seed_test_data():
    with app.app_context():
        db.drop_all() 
        db.create_all()

        # Erstelle mehrere Disziplinen
        disciplines = [
        Discipline(discipline_name="Ausdauer"),
        Discipline(discipline_name="Kraft"),
        Discipline(discipline_name="Schnelligkeit"),
        Discipline(discipline_name="Koordination")
    ]
        # Füge alle Athleten und Disziplinen zur Session hinzu
        db.session.add_all(disciplines)
        db.session.commit()

app = create_app()
if __name__ == '__main__':
    seed_test_data()