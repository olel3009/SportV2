from datetime import datetime
from flask import Blueprint, request, jsonify
from api.export_pdf import process_export
from api.load_athlete_config import load_athlete_for_export
from database import db
from database.models import Athlete

bp_athlete = Blueprint('athlete', __name__)

@bp_athlete.route('/athletes', methods=['POST'])
def create_athlete():
    data = request.json
    new_athlete = Athlete(
        first_name=data['first_name'],
        last_name=data['last_name'],
        birth_date=datetime.strptime(data['birth_date'], '%d-%m-%Y'),
        gender=data['gender']
    )
    db.session.add(new_athlete)
    db.session.commit()
    return jsonify({"message": "Athlet hinzugefügt", "id": new_athlete.id}), 201

@bp_athlete.route('/athletes', methods=['GET'])
def get_athletes():
    athletes = Athlete.query.all()
    return jsonify([{
        "id": athlete.id,
        "first_name": athlete.first_name,
        "last_name": athlete.last_name,
        "birth_date": athlete.birth_date.strftime('%d-%m-%Y'),
        "gender": athlete.gender,
        "created_at": athlete.created_at,
        "updated_at": athlete.updated_at
    } for athlete in athletes])

@bp_athlete.route('/athletes/<int:id>', methods=['PUT'])
def update_athlete(id):
    athlete = Athlete.query.get_or_404(id)
    data = request.json
    athlete.first_name = data.get('first_name', athlete.first_name)
    athlete.last_name = data.get('last_name', athlete.last_name)
    athlete.birth_date = datetime.strptime(data['birth_date'], '%d-%m-%Y') if 'birth_date' in data else athlete.birth_date
    athlete.gender = data.get('gender', athlete.gender)
    db.session.commit()
    return jsonify({"message": "Athlet aktualisiert"})

@bp_athlete.route('/athletes/<int:id>', methods=['DELETE'])
def delete_athlete(id):
    athlete = Athlete.query.get_or_404(id)
    db.session.delete(athlete)
    db.session.commit()
    return jsonify({"message": "Athlet gelöscht"})

@bp_athlete.route('/athletes/<int:athlete_id>/export/pdf', methods=['GET'])
def export_athlete_pdf(athlete_id):
    """
    Lädt Athlet + PerformanceData aus der DB,
    übergibt sie an process_export -> 
    generiert output_string und füllt das PDF.
    """
    try:
        athlete_obj = load_athlete_for_export(athlete_id)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    output_string, pdf_feedback = process_export(athlete_obj)

    return jsonify({
        "message": "Export erfolgreich",
        "output_string": output_string,
        "pdf_feedback": pdf_feedback
    })
