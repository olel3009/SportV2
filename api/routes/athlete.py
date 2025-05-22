from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database import db
from database.models import Athlete as DBAthlete, Result as DBResult, Rule as DBRule
from database.schemas import AthleteSchema, DisciplineSchema, ResultSchema, RuleSchema
from api.export_pdf import fill_pdf_form
from sqlalchemy.orm import joinedload

bp_athlete = Blueprint('athlete', __name__)

@bp_athlete.route('/athletes', methods=['POST'])
@jwt_required()
def create_athlete():
    data = request.json
    schema = AthleteSchema()
    valid_data = schema.load(data)  # Falls invalid, ValidationError -> 400
    
    new_athlete = DBAthlete(
        first_name=valid_data["first_name"],
        last_name=valid_data["last_name"],
        birth_date=valid_data["birth_date"],
        gender=valid_data["gender"],
        swim_certificate=valid_data["swim_certificate"]
    )
    db.session.add(new_athlete)
    db.session.commit()
    return jsonify({"message": "Athlet hinzugefügt", "id": new_athlete.id}), 201

@bp_athlete.route('/athletes', methods=['GET'])
@jwt_required()
def get_athletes():
    athletes = DBAthlete.query.all()
    result = []
    for ath in athletes:
        result.append({
            "id": ath.id,
            "first_name": ath.first_name,
            "last_name": ath.last_name,
            "birth_date": ath.birth_date.strftime("%d.%m.%Y"),
            "gender": ath.gender,
            "swim_certificate": ath.swim_certificate,
            "created_at": ath.created_at,
            "updated_at": ath.updated_at
        })
    return jsonify(result)

@bp_athlete.route('/athletes/<int:id>', methods=['GET'])
@jwt_required()
def get_athlete_id(id):
    # 1) Athleten‐Datensatz laden oder 404
    athlete = DBAthlete.query.get_or_404(id)
    schema = AthleteSchema()
    data = schema.dump(athlete)

    # 3) Query‐Parameter auslesen (Default = "false")
    show = request.args.get('show_results', 'false').lower() == 'true'

    if show:
        # 4) nur wenn show_results=true, Medaillen zählen
        data.update({
            "total_bronze": DBResult.query.filter_by(athlete_id=id, medal='Bronze').count(),
            "total_silver": DBResult.query.filter_by(athlete_id=id, medal='Silber').count(),
            "total_gold":   DBResult.query.filter_by(athlete_id=id, medal='Gold').count(),
        })

    return jsonify(data), 200

@bp_athlete.route('/athletes/<int:id>', methods=['PUT'])
@jwt_required()
def update_athlete(id):
    athlete = DBAthlete.query.get_or_404(id)
    data = request.json

    if "first_name" in data:
        athlete.first_name = data["first_name"]
    if "last_name" in data:
        athlete.last_name = data["last_name"]
    if "birth_date" in data:
        athlete.birth_date = datetime.strptime(data["birth_date"], "%d.%m.%Y").date()
    if "gender" in data:
        athlete.gender = data["gender"]
    # NEUES FELD
    if "swim_certificate" in data:
        athlete.swim_certificate = data["swim_certificate"]

    db.session.commit()
    return jsonify({"message": "Athlet aktualisiert"})

@bp_athlete.route('/athletes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_athlete(id):
    athlete = DBAthlete.query.get_or_404(id)
    db.session.delete(athlete)
    db.session.commit()
    return jsonify({"message": "Athlet gelöscht"})

@bp_athlete.route('/athletes/<int:athlete_id>/export/pdf', methods=['GET'])
@jwt_required()
def export_athlete_pdf(athlete_id):
    # 1) DB-Abfrage
    db_athlete = DBAthlete.query.get_or_404(athlete_id)

    # 2) Sample: hole bis zu 4 Results
    db_results = DBResult.query.filter_by(athlete_id=athlete_id).limit(4).all()

    # 3) Baue Python-Objekte
    from api.athlet import Athlete, PerformanceData

    # a) Athlete
    #    Falls birth_date in DB ein datetime ist, direct übernehmen
    #    Falls es ein date ist, auch ok
    py_athlete = Athlete(
        first_name=db_athlete.first_name,
        last_name=db_athlete.last_name,
        gender=db_athlete.gender,
        birth_date=db_athlete.birth_date,
        swim_certificate=db_athlete.swim_certificate,
        performances=[]
    )

    # b) PerformanceData
    for res in db_results:
        py_athlete.performances.append(
            PerformanceData(
                disciplin=res.disciplin, 
                year=res.year,
                result=res.result, 
                points=res.points
            )
        )

    # 4) PDF generieren
    pdf_feedback = fill_pdf_form(py_athlete)

    return jsonify({
        "message": "Export erfolgreich",
        "pdf_feedback": pdf_feedback
    })

@bp_athlete.route('/athletes/<int:athlete_id>/results', methods=['GET'])
@jwt_required()
def get_athletes_results(athlete_id):

    db_athlete = DBAthlete.query.get_or_404(athlete_id)

    athlete_schema = AthleteSchema()
    result_schema = ResultSchema()
    rule_schema = RuleSchema()
    discipline_schema = DisciplineSchema()

    serialized_athlete_details = athlete_schema.dump(db_athlete)

    db_results = DBResult.query.options(
        joinedload(DBResult.rule).joinedload(DBRule.discipline)
    ).filter(
        DBResult.athlete_id == athlete_id
    ).all()

    processed_results = []

    if db_results:
        for result in db_results:
            serialized_result = result_schema.dump(result) 
            rule = result.rule

            if rule:
                serialized_rule = rule_schema.dump(rule) 
                discipline = rule.discipline

                if discipline:
                    serialized_discipline = discipline_schema.dump(discipline) 
                    
                    if 'discipline_id' in serialized_rule:
                        del serialized_rule['discipline_id']
                    serialized_rule['discipline'] = serialized_discipline
                else:
                    serialized_rule['discipline'] = None
                    print(f"Warning: Discipline data missing for rule ID {rule.id}")

                if 'rule_id' in serialized_result:
                    del serialized_result['rule_id']
                serialized_result['rule'] = serialized_rule
            else:
                if 'rule_id' in serialized_result:
                    del serialized_result['rule_id']
                serialized_result['rule'] = None
                print(f"Warning: Rule data missing for result ID {result.id} (Rule ID: {result.rule_id if hasattr(result, 'rule_id') else 'N/A'})")
            
            processed_results.append(serialized_result)

    response_payload = {
        "athlete": serialized_athlete_details,
        "results": processed_results
    }
    
    return jsonify(response_payload), 200

@bp_athlete.post('/athletes/csv')
@jwt_required()
def create_athletes_from_csv():
    if not request.data:
        return jsonify({"error": "Keine Daten im Request Body gefunden."}), 400

    data_string = request.get_data(as_text=True)
    lines = data_string.strip().splitlines()

    if not lines:
        return jsonify({"error": "Keine Zeilen mit Athletendaten gefunden."}), 400

    created_athlete_objects = []
    errors_list = []
    processed_lines_count = 0

    for index, line_content in enumerate(lines):
        original_line_data = line_content.strip()
        if not original_line_data:
            continue

        processed_lines_count += 1
        line_number = index + 1

        try:
            parts = original_line_data.split(';')
            if len(parts) != 5:
                errors_list.append({
                    "line_number": line_number,
                    "data": original_line_data,
                    "error": "Ungültiges Datenformat. Erwartet werden 5 Felder getrennt durch ';'."
                })
                continue

            first_name, last_name, birth_date_str, gender_str, swim_certificate_str = parts

            if not first_name or not last_name:
                errors_list.append({
                    "line_number": line_number,
                    "data": original_line_data,
                    "error": "Vorname und Nachname dürfen nicht leer sein."
                })
                continue

            try:
                birth_date_obj = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
            except ValueError:
                errors_list.append({
                    "line_number": line_number,
                    "data": original_line_data,
                    "error": f"Ungültiges Datumsformat für birth_date ('{birth_date_str}'). Erwartet: YYYY-MM-DD."
                })
                continue

            gender_val = gender_str.lower()
            if gender_val not in ['m', 'f', 'd']:
                errors_list.append({
                    "line_number": line_number,
                    "data": original_line_data,
                    "error": f"Ungültiger Wert für gender ('{gender_str}'). Erwartet: 'm', 'f' oder 'd'."
                })
                continue
            
            swim_certificate_bool = None
            if swim_certificate_str.lower() == 'true':
                swim_certificate_bool = True
            elif swim_certificate_str.lower() == 'false':
                swim_certificate_bool = False
            else:
                errors_list.append({
                    "line_number": line_number,
                    "data": original_line_data,
                    "error": f"Ungültiger Wert für swim_certificate ('{swim_certificate_str}'). Erwartet: 'True' oder 'False'."
                })
                continue

            athlete_obj = DBAthlete(
                first_name=first_name,
                last_name=last_name,
                birth_date=birth_date_obj,
                gender=gender_val,
                swim_certificate=swim_certificate_bool
            )
            created_athlete_objects.append(athlete_obj)

        except Exception as e:
            errors_list.append({
                "line_number": line_number,
                "data": original_line_data,
                "error": f"Ein unerwarteter Fehler ist bei der Verarbeitung dieser Zeile aufgetreten: {str(e)}"
            })
            continue 

    if not created_athlete_objects and not errors_list and processed_lines_count == 0:
         return jsonify({"message": "Keine verarbeitbaren Athletendaten gefunden (nur leere Zeilen?)."}), 400

    committed_athlete_ids = []
    if created_athlete_objects:
        try:
            db.session.add_all(created_athlete_objects)
            db.session.commit()
            for athlete in created_athlete_objects:
                if athlete.id is not None:
                     committed_athlete_ids.append(athlete.id)
                else:
                    errors_list.append({
                        "line_data_intended_for": f"{athlete.first_name} {athlete.last_name}",
                        "error": "Athlet wurde möglicherweise erstellt, aber ID konnte nicht abgerufen werden."
                    })

        except Exception as e:
            db.session.rollback()
            for obj in created_athlete_objects:
                 errors_list.append({
                    "line_data_intended_for": f"{obj.first_name} {obj.last_name}", 
                    "error": f"Konnte nicht in Datenbank gespeichert werden aufgrund eines Batch-Fehlers: {str(e)}"
                 })
            committed_athlete_ids = []

    response_status_code = 207
    if not committed_athlete_ids and errors_list:
        response_status_code = 400
    elif committed_athlete_ids and not errors_list:
        response_status_code = 201
    
    return jsonify({
        "message": "Batch-Verarbeitung abgeschlossen.",
        "created_athlete_ids": committed_athlete_ids,
        "errors": errors_list
    }), response_status_code