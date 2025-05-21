import io, csv
from flask import Blueprint, request, jsonify
from datetime import datetime, date
from database import db
from database.models import Result, Athlete, Rule, Discipline
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

@bp_result.route('/results/import', methods=['POST'])
def import_results_from_csv():
    """
    Importiert Results aus einer deutschen CSV mit Spalten:
    Name;Vorname;Geburtstag;Uebung;Kategorie;Leistung;Datum
    """
    f = request.files.get('file')
    if not f:
        return jsonify({"error": "Keine CSV-Datei hochgeladen"}), 400

    # CSV öffnen
    data = f.stream.read().decode('utf-8')
    reader = csv.DictReader(io.StringIO(data), delimiter=';')

    # Mapping deutsch -> englisch
    DE_TO_EN = {
        'Name': 'last_name',
        'Vorname': 'first_name',
        'Geburtstag': 'birth_date',
        'Uebung': 'rule_name',
        'Kategorie': 'discipline_name',
        'Leistung': 'result_value',
        'Datum': 'date'
    }

    required = set(DE_TO_EN.keys())
    missing_athletes = []
    duplicate_athletes = []
    created = []
    updated = []

    rows = list(reader)
    if not rows:
        return jsonify({"error": "Leere CSV"}), 400

    for idx, row in enumerate(rows, start=1):
        # 1) Pflichtspalten prüfen
        if not required.issubset(row.keys()):
            return jsonify({"error": f"Zeile {idx}: Fehlende Spalten"}), 400

        # 2) Übersetze Feldnamen
        rec = {DE_TO_EN[k]: v.strip() for k, v in row.items()}

        # 3) Geburtstag parsen (DD.MM.YYYY)
        try:
            bd = datetime.strptime(rec['birth_date'], '%d.%m.%Y').date()
        except ValueError:
            return jsonify({"error": f"Zeile {idx}: Ungültiges Datum im Feld Geburtstag"}), 400

        # 4) Athlet suchen
        matches = Athlete.query.filter_by(
            first_name=rec['first_name'],
            last_name=rec['last_name'],
            birth_date=bd
        ).all()

        if len(matches) == 0:
            missing_athletes.append({
                "first_name": rec['first_name'],
                "last_name": rec['last_name'],
                "birth_date": rec['birth_date']
            })
            continue
        if len(matches) > 1:
            duplicate_athletes.append({
                "first_name": rec['first_name'],
                "last_name": rec['last_name'],
                "birth_date": rec['birth_date']
            })
            continue

        athlete = matches[0]

        # 5) Datum der Leistung parsen (DD.MM.YYYY)
        try:
            perf_date = datetime.strptime(rec['date'], '%d.%m.%Y').date()
        except ValueError:
            return jsonify({"error": f"Zeile {idx}: Ungültiges Datum im Feld Datum"}), 400

        # 6) Disziplin und Rule suchen
        disc = Discipline.query.filter_by(discipline_name=rec['discipline_name']).first()
        if not disc:
            return jsonify({"error": f"Zeile {idx}: Unbekannte Disziplin '{rec['discipline_name']}'"}), 400

        rule = (Rule.query
                .filter_by(rule_name=rec['rule_name'], discipline_id=disc.id)
                .order_by(Rule.version.desc())
                .first())
        if not rule:
            return jsonify({"error": f"Zeile {idx}: Keine Regel '{rec['rule_name']}' für Disziplin '{disc.discipline_name}' gefunden"}), 400

        # 7) Ergebniswert als Float
        try:
            value = float(rec['result_value'].replace(',', '.'))
        except ValueError:
            return jsonify({"error": f"Zeile {idx}: Ungültiger Leistungswert '{rec['result_value']}'"}), 400

        # 8) Alter im Prüfungsjahr
        year = perf_date.year
        age = year - athlete.birth_date.year

        # 9) Medal bestimmen
        medal = determine_medal(rule, value, athlete.gender)

        # 10) Existierendes Result suchen (gleiche Athlete, Rule und Datum)
        existing = Result.query.filter_by(
            athlete_id=athlete.id,
            rule_id=rule.id,
            year=perf_date
        ).first()

        if existing:
            # update
            existing.result = value
            existing.age = age
            existing.medal = medal
            existing.version += 1
            updated.append({
                "athlete_id": athlete.id,
                "first_name": athlete.first_name,
                "last_name": athlete.last_name
            })
        else:
            # neu anlegen
            new_res = Result(
                athlete_id = athlete.id,
                rule_id    = rule.id,
                year       = perf_date,
                age        = age,
                result     = value,
                medal      = medal
            )
            db.session.add(new_res)
            created.append({
                "athlete_id": athlete.id,
                "first_name": athlete.first_name,
                "last_name": athlete.last_name
            })

    # 11) abschließend speichern
    db.session.commit()

    resp = {"created": created, "updated": updated}
    if missing_athletes:
        resp["missing_athletes"] = missing_athletes
    if duplicate_athletes:
        resp["duplicate_athletes"] = duplicate_athletes

    return jsonify(resp), 200
