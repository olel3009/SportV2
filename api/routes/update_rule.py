from flask import Blueprint
from database.models import Rule as DBRule
from database import db
import logging

bp_update = Blueprint("update rule", __name__)

@bp_update.route("/regelungen/aktualisieren", methods = ["POST"])
def update_rule(csv_updates):
    rules = DBRule.query.all()
    
    db.session.commit()
    return logging.info("Die Regelungen wurden erfolgreich aktualisiert!")