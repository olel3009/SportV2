from flask import Blueprint, request, jsonify
from database.models import Discipline
from database.schemas import DisciplineSchema
from database import db
import logging

bp_discipline = Blueprint('discipline', __name__)

# CREATE Discipline
@bp_discipline.route('/disciplines', methods=['POST'])
def create_discipline():
    data = request.json
    schema = DisciplineSchema()
    valid_data = schema.load(data)  # Falls invalid -> ValidationError -> 400

    new_disc = Discipline(
        discipline_name=valid_data['discipline_name']
    )
    db.session.add(new_disc)
    db.session.commit()
    logging.info("Disziplin erfolgreich kreiert!")
    return jsonify({"message": "Discipline created", "id": new_disc.id}), 201

# READ Disciplines
@bp_discipline.route('/disciplines', methods=['GET'])
def get_disciplines():
    all_disc = Discipline.query.all()
    schema = DisciplineSchema(many=True)
    result = schema.dump(all_disc)
    logging.info("Alle Disziplinen erfolgreich aufgerufen")
    return jsonify(result)

@bp_discipline.route('/disciplines/<int:id>', methods=['GET'])
def get_discipline_id(id):
    discipline = Discipline.query.get_or_404(id)
    schema = DisciplineSchema()
    logging.info("Disziplin erfolgreich aufgerufen!")
    return jsonify(schema.dump(discipline))

# UPDATE Discipline
@bp_discipline.route('/disciplines/<int:id>', methods=['PUT'])
def update_discipline(id):
    disc = Discipline.query.get_or_404(id)
    data = request.json

    # Partial Updates mit Marshmallow
    schema = DisciplineSchema(partial=True)
    valid_data = schema.load(data)

    if 'discipline_name' in valid_data:
        disc.discipline_name = valid_data['discipline_name']

    db.session.commit()
    logging.info("Disziplin erfolgreich aktualisiert!")
    return jsonify({"message": "Discipline updated"})

# DELETE Discipline
@bp_discipline.route('/disciplines/<int:id>', methods=['DELETE'])
def delete_discipline(id):
    disc = Discipline.query.get_or_404(id)
    db.session.delete(disc)
    db.session.commit()
    logging.info("Disziplin erfolgreich gelöscht!")
    return jsonify({"message": "Discipline deleted"})
