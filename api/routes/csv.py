from flask import Blueprint
from database.models import Athlete as DBAthlete, Result as DBResult, Regel as DBRule
from database import db
import logging
import csv

bp_csv = Blueprint("csv", __name__)

@bp_csv.route("/sportdaten/import", method=["POST"])
def import_csv(csv):
    try:
        with open(csv, newline="") as csv_file:
            reader = csv.reader(csv_file)
            for row in reader:
                athlete_id=row["id"]
                #Objekte von der Athleten-ID
                dbathlete = DBAthlete.query.get_or_404(athlete_id)
                dbresult = DBResult.query.get_or_404(athlete_id)
                dbrule = DBRule.query.get_or_404(athlete_id)
                
                #Attribute aktualisieren
                dbathlete.first_name = row["first_name"]
                dbathlete.last_name = row["last_name"]
                dbathlete.birth_date = row["first_name"]
                dbrule.disziplin = row["disciplin"]
                #dbathlete.category = row["category"]
                dbresult.result = row["result"]
                dbathlete.date = row["date"]
                db.session.commit()

    except dbathlete is not None:
        return logging.WARNING("Athlet existiert schon!")
    
    return logging.info("CSV-Daten wurden erfolgreich importiert!")