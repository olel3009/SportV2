from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database import db
from database.models import Trainer
from database.schemas import TrainerSchema
from api.logs.logger import logger

bp_trainer = Blueprint('trainer', __name__)

@bp_trainer.route('/trainers', methods=['POST'])
@jwt_required()
def create_trainer():
    data = request.json
    schema = TrainerSchema()
    valid_data = schema.load(data)  # Falls invalid, ValidationError -> 400

    new_trainer = Trainer(
        first_name=valid_data["first_name"],
        last_name=valid_data["last_name"],
        email=valid_data["email"],
        birth_date=valid_data["birth_date"],
        gender=valid_data["gender"]
    )
    db.session.add(new_trainer)
    db.session.commit()
    logger.info("Trainer erfolgreich hinzugefügt!")
    return jsonify({"message": "Trainer hinzugefügt", "id": new_trainer.id}), 201

@bp_trainer.route('/trainers', methods=['GET'])
@jwt_required()
def get_trainers():
    trainers = Trainer.query.all()
    logger.info("Alle Trainer erfolgreich aufgerufen!")
    return jsonify([{
        "id": trainer.id,
        "first_name": trainer.first_name,
        "last_name": trainer.last_name,
        "email": trainer.email,
        "birth_date": trainer.birth_date.strftime('%d,%m,%Y'),
        "gender": trainer.gender,
        "created_at": trainer.created_at,
        "updated_at": trainer.updated_at
    } for trainer in trainers])

@bp_trainer.route('/trainers/<int:id>', methods=['GET'])
@jwt_required()
def get_trainer_id(id):
    trainer = Trainer.query.get_or_404(id)
    schema = TrainerSchema()
    logger.info("Trainer erfolgreich aufgerufen!")
    return jsonify(schema.dump(trainer))

@bp_trainer.route('/trainers/<int:id>', methods=['PUT'])
@jwt_required()
def update_trainer(id):
    trainer = Trainer.query.get_or_404(id)
    data = request.json
    trainer.first_name = data.get('first_name', trainer.first_name)
    trainer.last_name = data.get('last_name', trainer.last_name)
    trainer.email = data.get('email', trainer.email)
    trainer.birth_date = datetime.strptime(data['birth_date'], '%d,%m,%Y') if 'birth_date' in data else trainer.birth_date
    trainer.gender = data.get('gender', trainer.gender)
    db.session.commit()
    logger.info("Trainer erfolgreich aktualisiert!")
    return jsonify({"message": "Trainer aktualisiert"})

@bp_trainer.route('/trainers/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_trainer(id):
    trainer = Trainer.query.get_or_404(id)
    db.session.delete(trainer)
    db.session.commit()
    logger.info("Trainer erfolgreich gelöscht!")
    return jsonify({"message": "Trainer gelöscht"})