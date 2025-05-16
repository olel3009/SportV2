from flask import Blueprint, request, jsonify
from datetime import datetime, date
from database import db
from database.models import Result, Athlete, Rule
from database.schemas import ResultSchema
from marshmallow import ValidationError

bp_result = Blueprint('result', __name__)

def parse_date(ddmmyyyy):
    if isinstance(ddmmyyyy, date):
        return ddmmyyyy
    try:
        return datetime.strptime(ddmmyyyy, "%d.%m.%Y").date()
    except ValueError:
        raise ValueError(f"Datum '{ddmmyyyy}' muss im Format DD.MM.YYYY sein")

def determine_medal(rule, result_value, athlete_gender):
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
    return None

@bp_result.route('/results', methods=['POST'])
def create_result():
    data = request.get_json()
    schema = ResultSchema()
    try:
        valid = schema.load(data)
    except ValidationError as err:
        return jsonify({"error": "Validation Error", "messages": err.messages}), 400

    # Athlete und Rule laden
    athlete = Athlete.query.get_or_404(valid["athlete_id"])
    rule    = Rule.query.get_or_404(valid["rule_id"])

    # Prüfungsdatum parsen
    try:
        exam_date = parse_date(valid["year"])
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    # Validity-Check
    if exam_date < rule.valid_start:
        return jsonify({"error": "Exam date is before the rule's valid start"}), 400
    if rule.valid_end and exam_date > rule.valid_end:
        return jsonify({"error": "Exam date is after the rule's valid end"}), 400

    # Alter berechnen
    age = exam_date.year - athlete.birth_date.year

    # Medal
    medal = determine_medal(rule, valid["result"], athlete.gender)

    new = Result(
        athlete_id = athlete.id,
        rule_id    = rule.id,
        year       = exam_date,
        age        = age,
        result     = valid["result"],
        medal      = medal
    )
    db.session.add(new)
    db.session.commit()

    return jsonify({"message": "Result added", "id": new.id}), 201


@bp_result.route('/results', methods=['GET'])
def get_results():
    all = Result.query.all()
    schema = ResultSchema(many=True)
    return jsonify(schema.dump(all)), 200


@bp_result.route('/results/<int:id>', methods=['GET'])
def get_result_id(id):
    res = Result.query.get_or_404(id)
    schema = ResultSchema()
    return jsonify(schema.dump(res)), 200


@bp_result.route('/results/<int:id>', methods=['PUT'])
def update_result(id):
    res = Result.query.get_or_404(id)
    data = request.get_json()
    schema = ResultSchema(partial=True)
    try:
        valid = schema.load(data)
    except ValidationError as err:
        return jsonify({"error": "Validation Error", "messages": err.messages}), 400

    # Athlete oder Rule gewechselt?
    if "athlete_id" in valid:
        athlete = Athlete.query.get_or_404(valid["athlete_id"])
        res.athlete_id = athlete.id
    else:
        athlete = res.athlete

    if "rule_id" in valid:
        rule = Rule.query.get_or_404(valid["rule_id"])
        res.rule_id = rule.id
    else:
        rule = res.rule

    # Datum updaten?
    if "year" in valid:
        try:
            exam_date = parse_date(valid["year"])
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

        if exam_date < rule.valid_start:
            return jsonify({"error": "Exam date is before the rule's valid start"}), 400
        if rule.valid_end and exam_date > rule.valid_end:
            return jsonify({"error": "Exam date is after the rule's valid end"}), 400

        res.year = exam_date
        res.age  = exam_date.year - athlete.birth_date.year

    # Resultwert updaten?
    if "result" in valid:
        res.result = valid["result"]

    # Medal neu berechnen
    res.medal   = determine_medal(rule, res.result, athlete.gender)

    db.session.commit()
    return jsonify({"message": "Result updated"}), 200


@bp_result.route('/results/<int:id>', methods=['DELETE'])
def delete_result(id):
    res = Result.query.get_or_404(id)
    db.session.delete(res)
    db.session.commit()
    return jsonify({"message": "Result deleted"}), 200
