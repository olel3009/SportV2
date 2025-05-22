from flask import Blueprint, request, jsonify
from datetime import datetime
from database import db
from database.models import Result, Athlete, Rule
from database.schemas import ResultSchema 
from marshmallow import ValidationError
import logging

bp_result = Blueprint('result', __name__)

def determine_medal(rule, result_value, athlete_gender):
    """
    Bestimmt das Medal anhand der Thresholds aus dem Rule-Datensatz.
    Für die Einheiten 'points', 'amount' und 'distance': je höher, desto besser.
    Für die Einheit 'time': je geringer, desto besser.
    Gibt "Gold", "Silber", "Bronze" zurück, wenn die entsprechenden Thresholds erreicht werden,
    sonst None.
    """
    if athlete_gender.lower() == "m":
        bronze = rule.threshold_bronze_m
        silver = rule.threshold_silver_m
        gold = rule.threshold_gold_m
    else:
        bronze = rule.threshold_bronze_f
        silver = rule.threshold_silver_f
        gold = rule.threshold_gold_f

    if rule.unit in ["Punkte", "m,cm"]:
        if result_value >= gold:
            return "Gold"
        elif result_value >= silver:
            return "Silber"
        elif result_value >= bronze:
            return "Bronze"
        else:
            return None
    elif rule.unit in ["Min.,Sek.", "Sek.,1/10 Sek."]:
        if result_value <= gold:
            return "Gold"
        elif result_value <= silver:
            return "Silber"
        elif result_value <= bronze:
            return "Bronze"
        else:
            return None
    else:
        return None

@bp_result.route('/results', methods=['POST'])
def create_result():
    data = request.json
    schema = ResultSchema()
    try:
        valid_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"error": "Validation Error", "messages": err.messages}), 400

    # Lade die zugehörigen Datensätze
    athlete = Athlete.query.get_or_404(valid_data["athlete_id"])
    rule = Rule.query.get_or_404(valid_data["rule_id"])

    # Prüfungsjahr
    exam_year = valid_data["year"]
    # Gültigkeitscheck: Das Prüfungsjahr muss >= rule.valid_start.year sein.
    if exam_year < rule.valid_start.year:
        return jsonify({"error": "Exam year is before the rule's valid start"}), 400
    if rule.valid_end is not None and exam_year > rule.valid_end.year:
        return jsonify({"error": "Exam year is after the rule's valid end"}), 400

    # Alter berechnen: Prüfungsjahr - Geburtsjahr
    age = exam_year - athlete.birth_date.year

    # Medaille automatisch ermitteln anhand der Rule-Thresholds
    medal = determine_medal(rule, valid_data["result"], athlete.gender)

    new_result = Result(
        athlete_id=valid_data["athlete_id"],
        rule_id=valid_data["rule_id"],
        year=exam_year,
        age=age,
        result=valid_data["result"],
        medal=medal  
    )
    db.session.add(new_result)
    db.session.commit()
    logging.info("Ergebnis erfolgreich kreiert!")
    return jsonify({"message": "Result added", "id": new_result.id}), 201

@bp_result.route('/results', methods=['GET'])
def get_results():
    results = Result.query.all()
    schema = ResultSchema(many=True)
    logging.info("Alle Ergebnisse erfolgreich aufgerufen!")
    return jsonify(schema.dump(results))

@bp_result.route('/results/<int:id>', methods=['GET'])
def get_result_id(id):
    result = Result.query.get_or_404(id)
    schema = ResultSchema()
    logging.info("Ergebnis erfolgreich aufgerufen!")
    return jsonify(schema.dump(result))

@bp_result.route('/results/<int:id>', methods=['PUT'])
def update_result(id):
    result_obj = Result.query.get_or_404(id)
    data = request.json
    schema = ResultSchema(partial=True)
    try:
        valid_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"error": "Validation Error", "messages": err.messages}), 400

    # Wenn athlete_id oder rule_id geändert werden, neu laden
    if "athlete_id" in valid_data:
        athlete = Athlete.query.get_or_404(valid_data["athlete_id"])
        result_obj.athlete_id = valid_data["athlete_id"]
    else:
        athlete = result_obj.athlete

    if "rule_id" in valid_data:
        rule = Rule.query.get_or_404(valid_data["rule_id"])
        result_obj.rule_id = valid_data["rule_id"]
    else:
        rule = result_obj.rule

    # Wenn year geändert wird, prüfen und alter neu berechnen
    if "year" in valid_data:
        exam_year = valid_data["year"]
        if exam_year < rule.valid_start.year:
            return jsonify({"error": "Exam year is before the rule's valid start"}), 400
        if rule.valid_end is not None and exam_year > rule.valid_end.year:
            return jsonify({"error": "Exam year is after the rule's valid end"}), 400
        result_obj.year = exam_year
        result_obj.age = exam_year - athlete.birth_date.year

    if "result" in valid_data:
        result_obj.result = valid_data["result"]

    # Automatisch Medaille neu bestimmen
    result_obj.medal = determine_medal(rule, result_obj.result, athlete.gender)

    db.session.commit()
    logging.info("Ergebnis erfolgreich aktualisiert!")
    return jsonify({"message": "Result updated"})

@bp_result.route('/results/<int:id>', methods=['DELETE'])
def delete_result(id):
    result_obj = Result.query.get_or_404(id)
    db.session.delete(result_obj)
    db.session.commit()
    logging.info("Regel erfolgreich gelöscht!")
    return jsonify({"message": "Result deleted"})
