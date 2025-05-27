from flask import Blueprint, request, jsonify
from datetime import datetime, date
import csv
from io import StringIO

from database import db
from database.models import Rule, Discipline
from database.schemas import RuleSchema
from database import db
from api.logs.logger import logger
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity

bp_rule = Blueprint('rule', __name__)

def parse_date_ddmmyyyy(s: str) -> date:
    """Parst ein Datum im Format DD.MM.YYYY."""
    return datetime.strptime(s, "%d.%m.%Y").date()

# CREATE Rule
@bp_rule.route('/rules', methods=['POST'])
@jwt_required()
def create_rule():
    data = request.json
    schema = RuleSchema()
    valid_data = schema.load(data)  # ValidationError -> 400

    # Versionserhöhung, wenn bereits Einträge mit demselben rule_name existieren
    existing_rules = Rule.query.filter_by(rule_name=valid_data['rule_name']).all()
    if existing_rules:
        max_version = max(r.version for r in existing_rules)
        new_version = max_version + 1
    else:
        new_version = 1

    new_rule = Rule(
        discipline_id=valid_data['discipline_id'],
        rule_name=valid_data['rule_name'],
        unit=valid_data['unit'],
        description_m=valid_data['description_m'],
        description_f=valid_data['description_f'],
        min_age=valid_data['min_age'],
        max_age=valid_data['max_age'],

        threshold_bronze_m=valid_data['threshold_bronze_m'],
        threshold_silver_m=valid_data['threshold_silver_m'],
        threshold_gold_m=valid_data['threshold_gold_m'],

        threshold_bronze_f=valid_data['threshold_bronze_f'],
        threshold_silver_f=valid_data['threshold_silver_f'],
        threshold_gold_f=valid_data['threshold_gold_f'],

        valid_start=valid_data['valid_start'],
        valid_end=valid_data.get('valid_end'),
        version=new_version
    )
    db.session.add(new_rule)
    db.session.commit()
    logger.info("Regel erfolgreich kreiert!")
    return jsonify({"message": "Rule created", "id": new_rule.id, "version": new_rule.version}), 201

# READ Rules
@bp_rule.route('/rules', methods=['GET'])
@jwt_required()
def get_rules():
    all_rules = Rule.query.all()
    schema = RuleSchema(many=True)
    result = schema.dump(all_rules)
    logger.info("Alle Regeln erfolgreich aufgerufen!")
    return jsonify(result)

@bp_rule.route('/rules/<int:id>', methods=['GET'])
@jwt_required()
def get_rule(id):
    rule = Rule.query.get_or_404(id)
    schema = RuleSchema()
    logger.info("Regel erfolgreich aufgerufen!")
    return jsonify(schema.dump(rule))

# UPDATE Rule
@bp_rule.route('/rules/<int:id>', methods=['PUT'])
@jwt_required()
def update_rule_id(id):
    rule = Rule.query.get_or_404(id)
    data = request.json

    # Partial Updates
    schema = RuleSchema(partial=True)
    valid_data = schema.load(data)

    if 'discipline_id' in valid_data:
        rule.discipline_id = valid_data['discipline_id']
    if 'rule_name' in valid_data:
        rule.rule_name = valid_data['rule_name']
    if 'unit' in valid_data:
        rule.unit = valid_data['unit']
    if 'description_m' in valid_data:
        rule.description_m = valid_data['description_m']
    if 'description_f' in valid_data:
        rule.description_f = valid_data['description_f']
    if 'min_age' in valid_data:
        rule.min_age = valid_data['min_age']
    if 'max_age' in valid_data:
        rule.max_age = valid_data['max_age']

    if 'threshold_bronze_m' in valid_data:
        rule.threshold_bronze_m = valid_data['threshold_bronze_m']
    if 'threshold_silver_m' in valid_data:
        rule.threshold_silver_m = valid_data['threshold_silver_m']
    if 'threshold_gold_m' in valid_data:
        rule.threshold_gold_m = valid_data['threshold_gold_m']

    if 'threshold_bronze_f' in valid_data:
        rule.threshold_bronze_f = valid_data['threshold_bronze_f']
    if 'threshold_silver_f' in valid_data:
        rule.threshold_silver_f = valid_data['threshold_silver_f']
    if 'threshold_gold_f' in valid_data:
        rule.threshold_gold_f = valid_data['threshold_gold_f']

    if 'action' in valid_data:
        rule.action = valid_data['action']
    if 'valid_start' in valid_data:
        rule.valid_start = valid_data['valid_start']
    if 'valid_end' in valid_data:
        rule.valid_end = valid_data['valid_end']

    db.session.commit()
    logger.info("Regel erfolgreich aktualisiert!")
    return jsonify({"message": "Rule updated"})

# DELETE Rule
@bp_rule.route('/rules/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_rule(id):
    rule = Rule.query.get_or_404(id)
    db.session.delete(rule)
    db.session.commit()
    logger.info("Regel erfolgreich gelöscht!")
    return jsonify({"message": "Rule deleted"})


# Import Rules from CSV
@bp_rule.route('/rules/import', methods=['POST'])
@jwt_required()
def import_rules_from_csv():
    """
    Importiert Regeln aus einer hochgeladenen CSV.
    Erwartet im JSON:
      { "csv": "...Inhalt der CSV als String..." }
    Spalten (deutsch):
      Disziplin;Regelungsname;Einheit;Beschreibung-Maennlich;
      Beschreibung-Weiblich;Mindestalter;Hoechstalter;
      Bronze-Weiblich;Silber-Weiblich;Gold-Weiblich;
      Bronze-Maennlich;Silber-Maennlich;Gold-Maennlich;
      Gueltig-Start;Gueltig-Ende;Gueltigkeitsjahr
    """
    # Datei aus dem Multipart-Form-Data holen:
    if 'csv' not in request.files:
        return jsonify(error="No file part"), 400
    file = request.files['csv']
    # optional: auf CSV-MIME oder Extension prüfen
    if not file.filename.lower().endswith('.csv'):
        return jsonify(error="Invalid file type"), 400

    # den Text parsen
    content = file.stream.read().decode('utf-8').splitlines()
    reader = csv.DictReader(content, delimiter=';')
    #content = request.json.get("csv", "")
    #reader = csv.DictReader(StringIO(content), delimiter=';')
    created = []
    errors = []

    for i,row in enumerate(reader, start=1):
        # 1) Discipline-ID ermitteln
        disc = Discipline.query.filter_by(discipline_name=row["Disziplin"]).first()
        if not disc:
            errors.append(f"Zeile {i}: Disziplin „{row['Disziplin']}“ nicht gefunden")
            continue

        # 2) Basis-Daten map
        data = {
            "discipline_id": disc.id,
            "rule_name":     row["Regelungsname"],
            "unit":          row["Einheit"],
            "description_m": row["Beschreibung-Maennlich"],
            "description_f": row["Beschreibung-Weiblich"],
            "min_age":       int(row["Mindestalter"]),
            "max_age":       int(row["Hoechstalter"]),
            "threshold_bronze_m": float(row["Bronze-Maennlich"]),
            "threshold_silver_m": float(row["Silber-Maennlich"]),
            "threshold_gold_m":   float(row["Gold-Maennlich"]),
            "threshold_bronze_f": float(row["Bronze-Weiblich"]),
            "threshold_silver_f": float(row["Silber-Weiblich"]),
            "threshold_gold_f":   float(row["Gold-Weiblich"]),
        }

        # 3) Gültigkeitsjahr oder explizite Start/Ende?
        guelt_year = row.get("Gueltigkeitsjahr","").strip()
        if guelt_year:
            try:
                y = int(guelt_year)
                data["valid_start"] = date(y,1,1).strftime("%d.%m.%Y")
                data["valid_end"]   = date(y,12,31).strftime("%d.%m.%Y")
            except ValueError:
                errors.append(f"Zeile {i}: Ungültiges Gueltigkeitsjahr „{guelt_year}“")
                continue
        else:
            # parse explicit dates
            try:
                data["valid_start"] = parse_date_ddmmyyyy(row["Gueltig-Start"])
            except Exception:
                errors.append(f"Zeile {i}: Ungültiges Datum in Gueltig-Start")
                continue

            ende = row.get("Gueltig-Ende","").strip()
            if ende:
                try:
                    data["valid_end"] = parse_date_ddmmyyyy(ende)
                except Exception:
                    errors.append(f"Zeile {i}: Ungültiges Datum in Gueltig-Ende")
                    continue
            else:
                data["valid_end"] = None

        # 4) Version ermitteln (erste Version = 1, bei gleichem Name +1)
        last = (Rule.query
                   .filter_by(rule_name=data["rule_name"])
                   .order_by(Rule.version.desc())
                   .first())
        data["version"] = last.version + 1 if last else 1

        # 5) Schema-Validierung
        schema = RuleSchema()
        try:
            valid = schema.load(data)
        except ValidationError as ve:
            errors.append(f"Zeile {i}: {ve.messages}")
            continue

        # 6) Anlegen
        new_rule = Rule(**valid)
        db.session.add(new_rule)
        created.append({"row": i, "id": None, "name": new_rule.rule_name, "version": new_rule.version})

    # 7) Commit & IDs ergänzen
    db.session.commit()
    for cr in created:
        # wir finden sie anhand name+version
        r = Rule.query.filter_by(rule_name=cr["name"], version=cr["version"]).first()
        cr["id"] = r.id

    return jsonify({
        "created": created,
        "errors":   errors
    }), (400 if errors else 201)
