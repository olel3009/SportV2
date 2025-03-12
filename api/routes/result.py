from flask import Blueprint, request, jsonify
from database import db
from database.models import Result

bp_result = Blueprint('result', __name__)

@bp_result.route('/results', methods=['POST'])
def create_result():
    data = request.json
    new_result = Result(
        athlete_id=data['athlete_id'],
        year=data['year'],
        age=data['age'],
        disciplin=data['disciplin'],
        result=data['result'],
        points=data['points'],
        medal=data['medal'],
    )
    db.session.add(new_result)
    db.session.commit()
    return jsonify({"message": "Ergebnis hinzugefügt", "id": new_result.id}), 201

@bp_result.route('/results', methods=['GET'])
def get_results():
    results = Result.query.all()
    return jsonify([{
        "id": result.id,
        "athlete_id": result.athlete_id,
        "year": result.year,
        "age": result.age,
        "disciplin": result.disciplin,
        "result": result.result,
        "points": result.points,
        "medal": result.medal,
        "version": result.version,
        "created_at": result.created_at,
        "updated_at": result.updated_at
    } for result in results])

@bp_result.route('/results/<int:id>', methods=['PUT'])
def update_result(id):
    result = Result.query.get_or_404(id)
    data = request.json
    result.year = data.get('year', result.year)
    result.age = data.get('age', result.age)
    result.disciplin = data.get('disciplin', result.disciplin)
    result.result = data.get('result', result.result)
    result.points = data.get('points', result.points)
    result.medal = data.get('medal', result.medal)
    result.version += 1  # Neue Version erzeugen
    db.session.commit()
    return jsonify({"message": "Ergebnis aktualisiert"})

@bp_result.route('/results/<int:id>', methods=['DELETE'])
def delete_result(id):
    result = Result.query.get_or_404(id)
    db.session.delete(result)
    db.session.commit()
    return jsonify({"message": "Ergebnis gelöscht"})