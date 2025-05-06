from flask import Blueprint
from database.models import Athlete as DBAthlete, Result as DBResult, Regel as DBRule
from database import db
import logging
import csv
from sqlalchemy import select

bp_csv = Blueprint("csv", __name__)#

test_csv =r"api\data\PO.csv"

@bp_csv.route("/sportdaten/import", method=["POST"])
def import_csv(csv_file):
    try:
        with open(csv_file, newline="") as csv_data:
            reader = csv.reader(csv_data)
            for row in reader:
                #Athleten-ID aus der CSV
                athlete_name=row["Name"]
                athlete_surname=row["Vorname"]
                athlete_year = row["Geburtsjahr"]
                athlete_day = row["Geburtstag"]
                
                #Ermittelt die ID des Athleten anhand von Namen und Geburtsdaten
                athletes = DBAthlete.query.all()
                athlete_id = select("athletes") \
                .where(athletes.first_name == athlete_name) \
                .where(athletes.last_name == athlete_surname)\
                .where(athlete_year in athletes.birth_date) \
                .where(athlete_day in athletes.birth_date) \
                .compile()['id']
                
                #Objekte mit der Athleten-ID
                dbathlete = DBAthlete.query.get_or_404(athlete_id)
                dbresult = DBResult.query.get_or_404(athlete_id)
                dbrule = DBRule.query.get_or_404(athlete_id)
                
                #Attribute aktualisieren
                dbrule.disziplin = f"{row["Disziplin"]} {row["Kategorie"]}"
                dbresult.result = row["Leitstung"]
                dbresult.created_at = row["Datum"]
            db.session.commit()

    except dbathlete is not None:
        return logging.WARNING("Athlet existiert schon!")
    
    return logging.info("CSV-Daten wurden erfolgreich importiert!")