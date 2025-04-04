from flask import Blueprint, request, jsonify
from database.models import Discipline
from database.schemas import DisciplineSchema
from database import db

bp_discipline = Blueprint('discipline', __name__)

# CREATE Discipline
@bp_discipline.route('/disciplines', methods=['POST'])
def create_discipline():
    data = request.json
    schema = DisciplineSchema()
    valid_data = schema.load(data)  # Falls invalid -> ValidationError -> 400

    new_disc = Discipline(
        group_name=valid_data['group_name'],
        discipline_name=valid_data['discipline_name'],
        unit=valid_data['unit']
    )
    db.session.add(new_disc)
    db.session.commit()
    return jsonify({"message": "Discipline created", "id": new_disc.id}), 201

# READ Disciplines
@bp_discipline.route('/disciplines', methods=['GET'])
def get_disciplines():
    all_disc = Discipline.query.all()
    schema = DisciplineSchema(many=True)
    result = schema.dump(all_disc)
    return jsonify(result)

# UPDATE Discipline
@bp_discipline.route('/disciplines/<int:id>', methods=['PUT'])
def update_discipline(id):
    disc = Discipline.query.get_or_404(id)
    data = request.json

    # Partial Updates mit Marshmallow
    schema = DisciplineSchema(partial=True)
    valid_data = schema.load(data)

    if 'group_name' in valid_data:
        disc.group_name = valid_data['group_name']
    if 'discipline_name' in valid_data:
        disc.discipline_name = valid_data['discipline_name']
    if 'unit' in valid_data:
        disc.unit = valid_data['unit']

    db.session.commit()
    return jsonify({"message": "Discipline updated"})

# DELETE Discipline
@bp_discipline.route('/disciplines/<int:id>', methods=['DELETE'])
def delete_discipline(id):
    disc = Discipline.query.get_or_404(id)
    db.session.delete(disc)
    db.session.commit()
    return jsonify({"message": "Discipline deleted"})
