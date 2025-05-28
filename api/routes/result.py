import csv
from marshmallow import ValidationError
from datetime import datetime, date
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database import db
from database.models import Result, Athlete, Rule, Discipline
from database.schemas import ResultSchema
from api.logs.logger import logger
from api.utils import to_float_german

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
@jwt_required()
def create_result():
    data = request.get_json()
    schema = ResultSchema()
    try:
        print(data)
        valid = schema.load(data)
    except ValidationError as err:
        print(err.messages)
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
    logger.info("Ergebnis erfolgreich kreiert!")
    return jsonify({"message": "Result added", "id": new.id}), 201

@bp_result.route('/results', methods=['GET'])
@jwt_required()
def get_results():
    all = Result.query.all()
    schema = ResultSchema(many=True)
    logger.info("Alle Ergebnisse erfolgreich aufgerufen!")
    return jsonify(schema.dump(all)), 200


@bp_result.route('/results/<int:id>', methods=['GET'])
@jwt_required()
def get_result_id(id):
    res = Result.query.get_or_404(id)
    schema = ResultSchema()
    logger.info("Ergebnis erfolgreich aufgerufen!")
    return jsonify(schema.dump(res)), 200


@bp_result.route('/results/<int:id>', methods=['PUT'])
@jwt_required()
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
    logger.info("Ergebnis erfolgreich aktualisiert!")
    return jsonify({"message": "Result updated"}), 200


@bp_result.route('/results/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_result(id):
    res = Result.query.get_or_404(id)
    db.session.delete(res)
    db.session.commit()
    return jsonify({"message": "Result deleted"}), 200

# deutsche → englische Spaltenköpfe
DE_TO_EN = {
    'Nachname':       'last_name',
    'Vorname':        'first_name',
    'Geburtstag':     'birth_date',
    'Uebung':         'rule_name',
    'Kategorie':      'discipline_name',
    'Leistung':       'result_value',
    'Datum':          'exam_date',
}

REQUIRED_FIELDS = set(DE_TO_EN.keys())

def parse_date_field(value: str, field: str, idx: int) -> datetime.date:
    """
    Parst ein deutsches Datum DD.MM.YYYY und wirft bei Fehlern eine ValueError mit
    einer menschenlesbaren Nachricht.
    """
    s = value.strip()
    if not s:
        raise ValueError(f"Zeile {idx}: Feld '{field}' ist leer")
    try:
        return datetime.strptime(s, "%d.%m.%Y").date()
    except ValueError:
        raise ValueError(f"Zeile {idx}: Ungültiges Datum im Feld '{field}' (`{s}`), muss DD.MM.YYYY sein")

@bp_result.route('/results/import', methods=['POST'])
@jwt_required()
def import_results_from_csv():
    f = request.files.get('file')
    if not f:
        return jsonify({"error": "Keine CSV-Datei hochgeladen"}), 400

    text = f.stream.read().decode('utf-8-sig')
    reader = csv.DictReader(text.splitlines(), delimiter=';')

    created = []
    updated = []
    missing_athletes   = []
    duplicate_athletes = []
    missing_rules      = []
    age_mismatch       = []

    for idx, raw in enumerate(reader, start=1):
        # --- 1) Trim keys+values ---
        rec = {k.strip(): (v or "").strip() for k, v in raw.items()}

        # --- 2) Parse Geburtstag ---
        try:
            bd = datetime.strptime(rec['Geburtstag'], "%d.%m.%Y").date()
        except Exception as e:
            return jsonify({"error": f"Zeile {idx}: Ungültiges Datum im Feld 'Geburtstag' ({rec.get('Geburtstag')})"}), 400

        # --- 3) Athlet suchen ---
        matches = Athlete.query.filter_by(
            first_name=rec['Vorname'],
            last_name =rec['Nachname'],
            birth_date=bd
        ).all()

        if not matches:
            missing_athletes.append(f"{rec['Vorname']} {rec['Nachname']} ({bd})")
            continue
        if len(matches) > 1:
            duplicate_athletes.append(f"{rec['Vorname']} {rec['Nachname']} ({bd})")
            continue

        athlete = matches[0]

        # --- 4) Leistungs-Datum parsen ---
        try:
            perf_date = datetime.strptime(rec['Datum'], "%d.%m.%Y").date()
        except:
            return jsonify({"error": f"Zeile {idx}: Ungültiges Datum im Feld 'Datum' ({rec['Datum']})"}), 400

        year = perf_date.year
        age  = year - athlete.birth_date.year

        # --- 5) Discipline + Rule ermitteln ---
        disc = Discipline.query.filter_by(discipline_name=rec['Kategorie']).first()
        if not disc:
            missing_rules.append(f"Zeile {idx}: Unbekannte Disziplin '{rec['Kategorie']}'")
            continue

        # erst Übungsstring matchen, dann Altersbereich
        base = rec['Uebung']
        candidates = (Rule.query
            .filter(Rule.discipline_id == disc.id)
            .filter(Rule.rule_name.ilike(f"{base}%"))
            .order_by(Rule.version.desc())
            .all()
        )
        if not candidates:
            missing_rules.append(f"Zeile {idx}: Keine Regel für Übung '{base}' gefunden")
            continue

        # nun unter den Kandidaten den passenden Altersbereich suchen
        rule = next((r for r in candidates if r.min_age <= age <= r.max_age), None)
        if not rule:
            age_mismatch.append(f"Zeile {idx}: Keine Regel für Übung '{base}' und Alter {age}")
            continue

        # --- 6) Leistungswert parsen ---
        try:
            value = to_float_german(rec['Leistung'])
        except ValueError as e:
            return jsonify({"error": f"Zeile {idx}: Ungültiger Leistungswert – {e}"}), 400

        # --- 7) Medaille bestimmen ---
        medal = determine_medal(rule, value, athlete.gender)

        # --- 8) Result updaten oder neu anlegen ---
        existing = Result.query.filter_by(
            athlete_id=athlete.id,
            rule_id=rule.id,
            year=perf_date
        ).first()

        if existing:
            existing.result = value
            existing.age    = age
            existing.medal  = medal
            updated.append({
                "athlete_id": athlete.id,
                "first_name": athlete.first_name,
                "last_name":  athlete.last_name
            })
        else:
            new_r = Result(
                athlete_id=athlete.id,
                rule_id=rule.id,
                year=perf_date,
                age=age,
                result=value,
                medal=medal
            )
            db.session.add(new_r)
            created.append({
                "athlete_id": athlete.id,
                "first_name": athlete.first_name,
                "last_name":  athlete.last_name
            })

    # 9) Commit einmal am Ende
    db.session.commit()
    logger.info("Regel erfolgreich gelöscht!")

    # 10) Response zusammenbauen
    resp = {
        "created":            created,
        "updated":            updated,
        "missing_athletes":   missing_athletes,
        "duplicate_athletes": duplicate_athletes,
        "missing_rules":      missing_rules,
        "age_mismatch":       age_mismatch
    }
    return jsonify(resp), 200
