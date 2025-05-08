from flask import Blueprint
from database.models import Athlete as DBAthlete, Result as DBResult, Rule as DBRule, Discipline as DBDiscipline
from database import db
import logging
import csv
from sqlalchemy import select

bp_csv = Blueprint('csv', __name__)

test_csv =r"api\data\PO.csv"

@bp_csv.route("/sportdaten/import", method=['POST'])
def import_csv(csv_file):
    try:
        with open(csv_file, newline="") as csv_data:
            reader = csv.reader(csv_data)
            athletes = DBAthlete.query.all()
            disciplines = DBDiscipline.query.all()
            rule = DBResult.query.all()
            for row in reader:
                #Athleten-ID aus der CSV
                athlete_name=row["Name"]
                athlete_surname=row["Vorname"]
                athlete_year = row["Geburtsjahr"]
                athlete_day = row["Geburtstag"]
                
                discipline_category = row["Kategorie"]
                rule_exercise = row["Übung"]
                
                #Ermittelt die ID des Athleten anhand von Namen und Geburtsdaten
                athlete_id = select(DBAthlete) \
                .where(athletes.first_name == athlete_name) \
                .where(athletes.last_name == athlete_surname) \
                .where(athlete_year in athletes.birth_date) \
                .where(athlete_day in athletes.birth_date) \
                .compile()['id']
                
                discipline_id = select(DBDiscipline) \
                .where(disciplines.discipline_name == discipline_category).compile()['id']
                
                rule_id = select(DBRule) \
                .where(rule.rule_name == rule_exercise)\
                .where(rule.discipline_id == discipline_id)\
                .compile()['id']
                
                #Objekte mit der Athleten-ID
                dbathlete = DBAthlete.query.get_or_404(athlete_id)
                dbresult = DBResult.query.get_or_404(athlete_id)

                #Attribute aktualisieren
                dbresult.result = row["Leitstung"]
                dbresult.year = row["Datum"]
                dbresult.rule_id = rule_id
                db.athlete_id = athlete_id
            db.session.commit()

    except dbathlete is None:
        return logging.WARNING("Athlet existiert nicht!")
    
    return logging.info("CSV-Daten wurden erfolgreich importiert!")
