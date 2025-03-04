from datetime import datetime
from flask import Blueprint, request, jsonify
from database import db
from database.models import Trainer, Athlete, Result, Regel, User
from api.export_pdf import *

bp_athlete = Blueprint('athlete', __name__)

@bp_athlete.route('/athletes', methods=['POST'])
def create_athlete():
    data = request.json
    new_athlete = Athlete(
        first_name=data['first_name'],
        last_name=data['last_name'],
        birth_date=datetime.strptime(data['birth_date'], '%Y-%m-%d'),
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
        "birth_date": athlete.birth_date.strftime('%Y-%m-%d'),
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
    athlete.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d') if 'birth_date' in data else athlete.birth_date
    athlete.gender = data.get('gender', athlete.gender)
    db.session.commit()
    return jsonify({"message": "Athlet aktualisiert"})

@bp_athlete.route('/athletes/<int:id>', methods=['DELETE'])
def delete_athlete(id):
    athlete = Athlete.query.get_or_404(id)
    db.session.delete(athlete)
    db.session.commit()
    return jsonify({"message": "Athlet gelöscht"})

@bp_athlete.route('/athletes/<int:id>/export/pdf', methods=['GET'])
def export_athlete_pdf(id):
    athlete = Athlete.query.get_or_404(id)
    fill_out_fields(athlete)
    return jsonify({"message": "PDF-Export erfolgreich"})
