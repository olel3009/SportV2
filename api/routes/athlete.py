from datetime import datetime
from flask import Blueprint, request, jsonify
from database import db
from database.models import Athlete as DBAthlete, Result as DBResult
from api.export_pdf import fill_pdf_form

bp_athlete = Blueprint('athlete', __name__)

@bp_athlete.route('/athletes', methods=['POST'])
def create_athlete():
    data = request.json
    new_athlete = DBAthlete(
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
    athletes = DBAthlete.query.all()
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
    athlete = DBAthlete.query.get_or_404(id)
    data = request.json
    athlete.first_name = data.get('first_name', athlete.first_name)
    athlete.last_name = data.get('last_name', athlete.last_name)
    athlete.birth_date = datetime.strptime(data['birth_date'], '%d-%m-%Y') if 'birth_date' in data else athlete.birth_date
    athlete.gender = data.get('gender', athlete.gender)
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
