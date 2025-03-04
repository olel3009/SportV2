from datetime import datetime
from flask import Blueprint, request, jsonify
from database import db
from database.models import Trainer, Athlete, Result, Regel, User
from api.export_pdf import *

bp_rule = Blueprint('rule', __name__)

@bp_rule.route('/regeln', methods=['POST'])
def create_regel():
    data = request.json
    new_regel = Regel(
        rulename=data['rulename'],
        description=data.get('description'),
        disciplin=data.get('disciplin'),
        distance=data['distance'],
        time_in_seconds=data['time_in_seconds'],
        points=data['points'],
        medal=data['medal'],
        valid_start=datetime.strptime(data['valid_start'], '%Y-%m-%d'),
        valid_end=datetime.strptime(data['valid_end'], '%Y-%m-%d') if 'valid_end' in data else None
    )
    db.session.add(new_regel)
    db.session.commit()
    return jsonify({"message": "Regel hinzugefügt", "id": new_regel.id}), 201

@bp_rule.route('/regeln', methods=['GET'])
def get_regeln():
    regeln = Regel.query.all()
    return jsonify([{
        "id": regel.id,
        "rulename": regel.rulename,
        "description": regel.description,
        "disciplin": regel.disciplin,
        "distance": regel.distance,
        "time_in_seconds": regel.time_in_seconds,
        "points": regel.points,
        "medal": regel.medal,
        "valid_start": regel.valid_start.strftime('%Y-%m-%d'),
        "valid_end": regel.valid_end.strftime('%Y-%m-%d') if regel.valid_end else None,
        "version": regel.version,
        "created_at": regel.created_at,
        "updated_at": regel.updated_at
    } for regel in regeln])

@bp_rule.route('/regeln/<int:id>', methods=['PUT'])
def update_regel(id):
    regel = Regel.query.get_or_404(id)
    data = request.json
    regel.description = data.get('description', regel.description)
    regel.disciplin = data.get('disciplin', regel.disciplin)
    regel.distance = data.get('distance', regel.distance)
    regel.time_in_seconds = data.get('time_in_seconds', regel.time_in_seconds)
    regel.points = data.get('points', regel.points)
    regel.medal = data.get('medal', regel.medal)
    regel.valid_start = datetime.strptime(data['valid_start'], '%Y-%m-%d') if 'valid_start' in data else regel.valid_start
    regel.valid_end = datetime.strptime(data['valid_end'], '%Y-%m-%d') if 'valid_end' in data else regel.valid_end
    regel.version += 1  # Version erhöhen
    db.session.commit()
    return jsonify({"message": "Regel aktualisiert"})

@bp_rule.route('/regeln/<int:id>', methods=['DELETE'])
def delete_regel(id):
    regel = Regel.query.get_or_404(id)
    db.session.delete(regel)
    db.session.commit()
    return jsonify({"message": "Regel gelöscht"})