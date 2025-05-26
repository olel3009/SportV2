from datetime import datetime
import os
from flask import Blueprint, request, jsonify, current_app, url_for
from werkzeug.utils import secure_filename
from database import db
from database.models import Athlete as DBAthlete, Result as DBResult, Rule as DBRule
from database.schemas import AthleteSchema, DisciplineSchema, ResultSchema, RuleSchema
from api.export_pdf import fill_pdf_form
from api.utils import allowed_file
from sqlalchemy.orm import joinedload

bp_athlete = Blueprint('athlete', __name__)

@bp_athlete.route('/athletes', methods=['POST'])
def create_athlete():
    data = request.json
    schema = AthleteSchema()
    valid_data = schema.load(data)  # Falls invalid, ValidationError -> 400
    
    new_athlete = DBAthlete(
        first_name=valid_data["first_name"],
        last_name=valid_data["last_name"],
        email=valid_data["email"],
        birth_date=valid_data["birth_date"],
        gender=valid_data["gender"]
    )
    db.session.add(new_athlete)
    db.session.commit()
    return jsonify({"message": "Athlet hinzugefügt", "id": new_athlete.id}), 201

@bp_athlete.route('/athletes', methods=['GET'])
def get_athletes():
    athletes = DBAthlete.query.all()
    result = []
    for ath in athletes:
        result.append({
            "id": ath.id,
            "first_name": ath.first_name,
            "last_name": ath.last_name,
            "email": ath.email,
            "birth_date": ath.birth_date.strftime("%d.%m.%Y"),
            "gender": ath.gender,
            "swim_certificate": ath.swim_certificate,
            "created_at": ath.created_at,
            "updated_at": ath.updated_at
        })
    return jsonify(result)

@bp_athlete.route('/athletes/<int:id>', methods=['GET'])
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
def update_athlete(id):
    athlete = DBAthlete.query.get_or_404(id)
    data = request.json

    if "first_name" in data:
        athlete.first_name = data["first_name"]
    if "last_name" in data:
        athlete.last_name = data["last_name"]
    if "email" in data:
        athlete.email = data["email"]
    if "birth_date" in data:
        athlete.birth_date = datetime.strptime(data["birth_date"], "%d.%m.%Y").date()
    if "gender" in data:
        athlete.gender = data["gender"]

    db.session.commit()
    return jsonify({"message": "Athlet aktualisiert"})

@bp_athlete.route('/athletes/<int:id>', methods=['DELETE'])
def delete_athlete(id):
    athlete = DBAthlete.query.get_or_404(id)
    db.session.delete(athlete)
    db.session.commit()
    return jsonify({"message": "Athlet gelöscht"})

@bp_athlete.route('/athletes/<int:athlete_id>/export/pdf', methods=['GET'])
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
        res_rule=DBRule.query.get_or_404(res.rule_id)
        py_athlete.performances.append(
            PerformanceData(
                disciplin=res_rule.discipline.discipline_name, 
                year=res.year,
                result=res.result, 
                points=res.medal
            )
        )

    # 4) PDF generieren
    pdf_feedback = fill_pdf_form(py_athlete)

    return jsonify({
        "message": "Export erfolgreich",
        "pdf_feedback": pdf_feedback
    })

@bp_athlete.route('/athletes/<int:athlete_id>/results', methods=['GET'])
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
                birth_date_obj = datetime.strptime(birth_date_str, '%d.%m.%Y').date()
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

@bp_athlete.route('/athletes/<int:id>/upload_picture', methods=['POST'])
def upload_athlete_picture(id):
    ath = DBAthlete.query.get_or_404(id)
    if 'picture' not in request.files:
        return jsonify(error="Keine Datei 'picture'"), 400

    file = request.files['picture']
    if file.filename == '':
        return jsonify(error="Keine Datei ausgewählt"), 400

    if not allowed_file(file.filename, current_app.config['ALLOWED_IMAGE_EXTS']):
        return jsonify(error="Invalider Bildtyp"), 400

    filename = secure_filename(f"athlete_{id}_pic.{file.filename.rsplit('.',1)[1].lower()}")
    save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)

    ath.picture = filename
    db.session.commit()

    return jsonify(message="Picture uploaded", url=url_for('static', filename=f'uploads/{filename}', _external=True)), 200


@bp_athlete.route('/athletes/<int:id>/upload_swim_cert', methods=['POST'])
def upload_swim_certificate(id):
    ath = DBAthlete.query.get_or_404(id)
    if 'swim_cert_file' not in request.files:
        return jsonify(error="Keine Datei 'swim_cert_file'"), 400

    file = request.files['swim_cert_file']
    if file.filename == '':
        return jsonify(error="Keine Datei ausgewählt"), 400

    if not allowed_file(file.filename, current_app.config['ALLOWED_CERT_EXTS']):
        return jsonify(error="Invalider Zertifikatsdateityp"), 400

    filename = secure_filename(f"athlete_{id}_cert.{file.filename.rsplit('.',1)[1].lower()}")
    save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)

    ath.swim_cert_file = filename
    ath.swim_certificate = True
    db.session.commit()

    return jsonify(message="Schwimmzertifikat hochgeladen",
                   url=url_for('static', filename=f'uploads/{filename}', _external=True)), 200
