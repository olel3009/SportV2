from flask import Flask, request, jsonify, Blueprint
from database import db
from database.models import Athlete as DBAthlete, Result as DBResult
from api.export_pdf import fill_out_group
from api.athlet import Athlete, PerformanceData

bp_group = Blueprint("group", __name__)

#Gruppe wird als Liste von Athleten ID's übergeben

@bp_group.route('/gruppen/export/pdf', methods=['GET'])
def export_group_pdf():
    db_group = []
    ids_str: list = request.args.get("ids")
    for ath in ids_str:
        #Datenbank-Abfrage des jeweiligen Athleten
        db_athlete = DBAthlete.query.get_or_404(ath)
        
        #Datenbank-Abfrage der Ergebnisse des jeweiligen Athleten; Ergebnisse auf 4 pro Athleten jeweilig begrenzt
        db_perf = DBResult.query.filter_by(athlete_id=ath).limit(4).all()
        
        #Datenbank-Einträge des jeweiligen Athleten dem Athlete-Objekt übergeben
        py_athlete = Athlete(
            first_name=db_athlete.first_name,
            last_name=db_athlete.last_name,
            gender=db_athlete.gender,
            birth_date=db_athlete.birth_date,
            performances=[]
        )

        #Datenbank-Einträge der Übungen des jeweiligen Athleten dem Performance-Data-Objekt übergeben
        for perf in db_perf:
            py_athlete.performances.append(
                PerformanceData(
                    disciplin=perf.disciplin,
                    year=perf.year,
                    result=perf.result,
                    points=perf.points
                )
            )
        
        db_group.append(py_athlete)
        
    #Ausfüllen und Export des PDF-Template
    pdf_feedback = fill_out_group(db_group)

    return jsonify({
        "message": "Export erfolgreich",
        "pdf_feedback": pdf_feedback
    })
