import io, csv
from datetime import datetime
from flask import Blueprint, request, jsonify
from database.models import Rule, Discipline
from database.schemas import RuleSchema
from database import db
from flask_jwt_extended import jwt_required, get_jwt_identity

bp_rule = Blueprint('rule', __name__)

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
    return jsonify({"message": "Rule created", "id": new_rule.id, "version": new_rule.version}), 201

# READ Rules
@bp_rule.route('/rules', methods=['GET'])
@jwt_required()
def get_rules():
    all_rules = Rule.query.all()
    schema = RuleSchema(many=True)
    result = schema.dump(all_rules)
    return jsonify(result)

@bp_rule.route('/rules/<int:id>', methods=['GET'])
@jwt_required()
def get_rule(id):
    rule = Rule.query.get_or_404(id)
    schema = RuleSchema()
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
    return jsonify({"message": "Rule updated"})

# DELETE Rule
@bp_rule.route('/rules/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_rule(id):
    rule = Rule.query.get_or_404(id)
    db.session.delete(rule)
    db.session.commit()
    return jsonify({"message": "Rule deleted"})


# Import Rules from CSV
@bp_rule.route('/rules/import', methods=['POST'])
@jwt_required()
def import_rules_from_csv():
    """
    Importiert Regeln aus einer CSV-Datei mit deutschen Spalten:
    Disziplin;Regelungsname;Einheit;Beschreibung-Maennlich;Beschreibung-Weiblich;
    Mindestalter;Hoechstalter;
    Bronze-Weiblich;Silber-Weiblich;Gold-Weiblich;
    Bronze-Maennlich;Silber-Maennlich;Gold-Maennlich;
    Gueltig-Start;Gueltig-Ende
    """
    f = request.files.get('file')
    if not f:
        return jsonify({"error": "Keine CSV-Datei hochgeladen"}), 400

    rdr = csv.DictReader(io.StringIO(f.stream.read().decode('utf-8')), delimiter=';')

    # Mapping deutsch -> attribut
    DE_TO_EN = {
        'Disziplin': 'discipline',
        'Regelungsname': 'rule_name',
        'Einheit': 'unit',
        'Beschreibung-Maennlich': 'description_m',
        'Beschreibung-Weiblich': 'description_f',
        'Mindestalter': 'min_age',
        'Hoechstalter': 'max_age',
        'Bronze-Maennlich': 'threshold_bronze_m',
        'Silber-Maennlich': 'threshold_silver_m',
        'Gold-Maennlich': 'threshold_gold_m',
        'Bronze-Weiblich': 'threshold_bronze_f',
        'Silber-Weiblich': 'threshold_silver_f',
        'Gold-Weiblich': 'threshold_gold_f',
        'Gueltig-Start': 'valid_start',
        'Gueltig-Ende': 'valid_end',
    }

    required = [
        'discipline','rule_name','unit',
        'description_m','description_f',
        'min_age','max_age',
        'threshold_bronze_m','threshold_silver_m','threshold_gold_m',
        'threshold_bronze_f','threshold_silver_f','threshold_gold_f',
        'valid_start'
    ]

    imported = []
    for idx, row in enumerate(rdr, start=1):
        # 1) deutsch->englisch
        data = { en: row.get(de, '').strip() for de, en in DE_TO_EN.items() }

        # 2) Pflichtfelder prüfen
        missing = [k for k in required if not data.get(k)]
        if missing:
            return jsonify({"error": f"Zeile {idx}: Fehlende Felder: {missing}"}), 400

        # 3) Disziplin auflösen
        disc = Discipline.query.filter_by(discipline_name=data['discipline']).first()
        if not disc:
            return jsonify({"error": f"Zeile {idx}: Unbekannte Disziplin '{data['discipline']}'"}), 400

        # 4) Typumwandlungen
        try:
            min_age = int(data['min_age'])
            max_age = int(data['max_age'])
        except ValueError:
            return jsonify({"error": f"Zeile {idx}: Alter muss Integer sein"}), 400

        # unit prüfen gegen DB-Enum
        if data['unit'] not in Rule.__table__.c.unit.type.enums:
            allowed = Rule.__table__.c.unit.type.enums
            return jsonify({"error": f"Zeile {idx}: Einheit '{data['unit']}' muss eine von {allowed} sein"}), 400

        def to_float(val, col):
            try:
                return float(val.replace(',', '.'))
            except:
                raise ValueError(f"Zeile {idx}: '{col}' muss Float")

        try:
            tbm = to_float(data['threshold_bronze_m'], 'Bronze-Maennlich')
            tsm = to_float(data['threshold_silver_m'], 'Silber-Maennlich')
            tgm = to_float(data['threshold_gold_m'],   'Gold-Maennlich')
            tbf = to_float(data['threshold_bronze_f'], 'Bronze-Weiblich')
            tsf = to_float(data['threshold_silver_f'], 'Silber-Weiblich')
            tgf = to_float(data['threshold_gold_f'],   'Gold-Weiblich')
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

        # 5) Datum parsen
        try:
            vs = datetime.strptime(data['valid_start'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": f"Zeile {idx}: Gueltig-Start muss YYYY-MM-DD sein"}), 400
        ve = None
        if data['valid_end']:
            try:
                ve = datetime.strptime(data['valid_end'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": f"Zeile {idx}: Gueltig-Ende muss YYYY-MM-DD sein oder leer"}), 400

        # 6) Version ermitteln
        last = (Rule.query
                    .filter_by(rule_name=data['rule_name'])
                    .order_by(Rule.version.desc())
                    .first())
        version = last.version + 1 if last else 1

        # 7) neuen Rule anlegen
        r = Rule(
            discipline_id      = disc.id,
            rule_name          = data['rule_name'],
            unit               = data['unit'],
            description_m      = data['description_m'],
            description_f      = data['description_f'],
            min_age            = min_age,
            max_age            = max_age,
            threshold_bronze_m = tbm,
            threshold_silver_m = tsm,
            threshold_gold_m   = tgm,
            threshold_bronze_f = tbf,
            threshold_silver_f = tsf,
            threshold_gold_f   = tgf,
            valid_start        = vs,
            valid_end          = ve,
            version            = version
        )
        db.session.add(r)
        imported.append({"rule_name": data['rule_name'], "version": version})

    db.session.commit()
    return jsonify({"imported": imported}), 201
