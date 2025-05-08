from flask import Blueprint
from database.models import Rule as DBRule
from database import db
import logging
import csv

bp_update = Blueprint("update rule", __name__)

@bp_update.route("/regelungen/aktualisieren", methods = ["POST"])
def update_rule(csv_updates):
    try:
        with open(csv_updates, newline="") as csv_data:
            reader = csv.reader(csv_data)
            rules = DBRule.query.all()
            for row in reader:
                discilplin = row["Disziplin"]
                min_age = row["Altersgruppe"].split("-")[0]
                max_age = row["Altersgruppe"].split("-")[1]
                
                gender = row["Geschlecht"]
                if gender == "männlich":
                    treshold_bronze_m = row["Bronze"]
                    treshold_silver_m = row["Silber"]
                    treshold_gold_m = row["Gold"]
                else:
                    treshold_bronze_f = row["Bronze"]
                    treshold_silver_f = row["Silber"]
                    treshold_gold_f = row["Gold"]
        db.session.commit()
    except Exception as e:
        logging.warning(e)
    return logging.info("Die Regelungen wurden erfolgreich aktualisiert!")