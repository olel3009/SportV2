from flask import Blueprint
from database.models import Rule as DBRule
from database import db
import logging
import csv
from sqlalchemy import select

bp_update = Blueprint("update-rule", __name__)

@bp_update.route("/regelungen/aktualisieren", methods = ["POST"])
def update_rule(csv_updates):
    try:
        with open(csv_updates, newline="") as csv_data:
            reader = csv.reader(csv_data)
            rules = DBRule.query.all()
            for row in reader:
                rule_id = select("Rule").where(rules.disciplin == row["Disziplin"])
                dbrule= DBRule.query.get_or_404(rule_id)
                dbrule.discilplin = row["Disziplin"]
                dbrule.min_age = row["Altersgruppe"].split("-")[0]
                dbrule.max_age = row["Altersgruppe"].split("-")[1]
                
                gender = row["Geschlecht"]
                if gender == "männlich":
                    dbrule.treshold_bronze_m = row["Bronze"]
                    dbrule.treshold_silver_m = row["Silber"]
                    dbrule.treshold_gold_m = row["Gold"]
                else:
                    dbrule.treshold_bronze_f = row["Bronze"]
                    dbrule.treshold_silver_f = row["Silber"]
                    dbrule.treshold_gold_f = row["Gold"]
        db.session.commit()
    except Exception as e:
        logging.warning(e)
    return logging.info("Die Regelungen wurden erfolgreich aktualisiert!")