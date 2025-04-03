from datetime import datetime
from flask import Blueprint, request, jsonify
from database import db
from database.models import Athlete as DBAthlete, Result as DBResult
from database.schemas import AthleteSchema
from api.export_pdf import fill_pdf_form

bp_athlete = Blueprint('athlete', __name__)

@bp_athlete.route('/athletes', methods=['POST'])
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
def get_athletes():
    athletes = DBAthlete.query.all()
    result = []
    for ath in athletes:
        result.append({
            "id": ath.id,
            "first_name": ath.first_name,
            "last_name": ath.last_name,
            "birth_date": ath.birth_date.strftime("%d-%m-%Y"),
            "gender": ath.gender,
            "swim_certificate": ath.swim_certificate,
            "created_at": ath.created_at,
            "updated_at": ath.updated_at
        })
    return jsonify(result)

@bp_athlete.route('/athletes/<int:id>', methods=['PUT'])
def update_athlete(id):
    athlete = DBAthlete.query.get_or_404(id)
    data = request.json

    if "first_name" in data:
        athlete.first_name = data["first_name"]
    if "last_name" in data:
        athlete.last_name = data["last_name"]
    if "birth_date" in data:
        athlete.birth_date = datetime.strptime(data["birth_date"], "%d-%m-%Y").date()
    if "gender" in data:
        athlete.gender = data["gender"]
    # NEUES FELD
    if "swim_certificate" in data:
        athlete.swim_certificate = data["swim_certificate"]

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
        birth_date=db_athlete.birth_date,  # datetime.date
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
