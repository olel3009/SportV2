from datetime import datetime
import os
from flask import Blueprint, request, jsonify, current_app, url_for
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required
from database import db
from database.models import Athlete as DBAthlete, Result as DBResult, Rule as DBRule
from database.schemas import AthleteSchema, DisciplineSchema, ResultSchema, RuleSchema
from api.utils import allowed_file
from sqlalchemy.orm import joinedload
from api.logs.logger import logger

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
        email=valid_data["email"],
        birth_date=valid_data["birth_date"],
        gender=valid_data["gender"]
    )
    db.session.add(new_athlete)
    db.session.commit()
    logger.info("Athlet erfolgreich kreiert!")
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
            "email": ath.email,
            "birth_date": ath.birth_date.strftime("%d.%m.%Y"),
            "gender": ath.gender,
            "swim_certificate": ath.swim_certificate,
            "swim_certificate_file": ath.swim_cert_file,
            "created_at": ath.created_at,
            "updated_at": ath.updated_at
        })
    logger.info("Alle Athleten erfolgreich aufgerufen!")
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
    logger.info("Athlet erfolgreich aufgerufen!")
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
    if "email" in data:
        athlete.email = data["email"]
    if "birth_date" in data:
        athlete.birth_date = datetime.strptime(data["birth_date"], "%d.%m.%Y").date()
    if "gender" in data:
        athlete.gender = data["gender"]

    db.session.commit()
    logger.info("Athlet erfolgreich aktualisiert!")
    return jsonify({"message": "Athlet aktualisiert"})

@bp_athlete.route('/athletes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_athlete(id):
    athlete = DBAthlete.query.get_or_404(id)
    db.session.delete(athlete)
    db.session.commit()
    logger.info("Athlet erfolgreich gelöscht!")
    return jsonify({"message": "Athlet gelöscht"})

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
    logger.info("Ergebnisse des Athleten erfolgreich aufgerufen!")
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
        if processed_lines_count==0:
            processed_lines_count += 1
            continue

        processed_lines_count += 1
        line_number = index + 1

        try:
            parts = original_line_data.split(';')
            if len(parts) != 6:
                errors_list.append({
                    "line_number": line_number,
                    "data": original_line_data,
                    "error": "Ungültiges Datenformat. Erwartet werden 6 Felder getrennt durch ';'."
                })
                continue
            
            first_name, last_name, birth_date_str, gender_str, swim_certificate_str, new_email = parts

            if not first_name or not last_name or not new_email:
                errors_list.append({
                    "line_number": line_number,
                    "data": original_line_data,
                    "error": "Vorname, Nachname und E-Mail dürfen nicht leer sein."
                })
                continue

            try:
                print(birth_date_str)
                birth_date_obj = datetime.strptime(birth_date_str, '%d.%m.%Y').date()
            except ValueError:
                errors_list.append({
                    "line_number": line_number,
                    "data": original_line_data,
                    "error": f"Ungültiges Datumsformat für birth_date ('{birth_date_str}'). Erwartet: TT.MM.JJJJ."
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

            # ####################################################################
            # NEU HINZUGEFÜGT: Prüfen, ob die E-Mail bereits existiert
            # ####################################################################
            existing_athlete = DBAthlete.query.filter_by(email=new_email).first()
            if existing_athlete:
                errors_list.append({
                    "line_number": line_number,
                    "data": original_line_data,
                    "error": f"Ein Athlet mit der E-Mail '{new_email}' existiert bereits."
                })
                continue
            # ####################################################################

            athlete_obj = DBAthlete(
                first_name=first_name,
                last_name=last_name,
                birth_date=birth_date_obj,
                gender=gender_val,
                swim_certificate=swim_certificate_bool,
                email=new_email
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
    
    logger.info("Athleten erfolgreich aus einer CSV kreiert!")
    return jsonify({
        "message": "Batch-Verarbeitung abgeschlossen.",
        "created_athlete_ids": committed_athlete_ids,
        "errors": errors_list
    }), response_status_code

@bp_athlete.route('/athletes/<int:id>/upload_picture', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
