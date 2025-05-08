from flask import Blueprint, jsonify
from database.models import Athlete as DBAthlete, Result as DBResult, Rule as DBRule, Discipline as DBDiscipline
from database import db
import logging
import csv
from sqlalchemy import select
from api.routes.rule import create_rule
import sys

bp_csv = Blueprint('csv', __name__)

test_csv =r"api\data\PO.csv"

@bp_csv.route("/sportdaten/import", methods=['POST'])
def import_csv(csv_file=test_csv):
    try:
        with open(csv_file, newline="") as csv_data:
            reader = csv.DictReader(csv_data, delimiter=";")
            try:
                athletes = DBAthlete.query.all()
            except AttributeError:
                logging.warning("Keine Athleten zur Verfügung")
                sys.exit()
            print(athletes)
            disciplines = DBDiscipline.query.all()
            rule = DBResult.query.all()
            for row in reader:
                print(row)
                #Athleten-ID aus der CSV
                athlete_name=row["ï»¿Name"]
                athlete_surname=row["Vorname"]
                athlete_year = row["Geburtsjahr"]
                athlete_day = row["Geburtstag"]
                discipline_category = row["Kategorie"]
                rule_exercise = row["Uebung"]
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
                print(dbathlete)
                data = {
                    "athlete_id": athlete_id,
                    "rule_id": rule_id,
                    "year": row["Datum"],
                    "result": row["Leistung"]
                }

                #Attribute aktualisieren
                create_rule(data)

    except dbathlete is []:
        print(dbathlete)
        return logging.WARNING("Athlet existiert nicht!")
    
    return logging.info("CSV-Daten wurden erfolgreich importiert!")
