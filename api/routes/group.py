from flask import Flask, request, jsonify, Blueprint
from database import db
from database.models import Athlete as DBAthlete, Result as DBResult, Rule as DBRule
from api.export_pdf import fill_out_group
from api.athlet import Athlete, PerformanceData
from api.logs.logger import logger

bp_group = Blueprint("group", __name__)

#Gruppe wird als Liste von Athleten ID's übergeben

@bp_group.route('/gruppen/export/pdf', methods=['GET'])
def export_group_pdf():
    ids_param: str = request.args.get("ids", "")
    if not ids_param:
        return jsonify({ "error": "No ids provided" }), 400

    # split into ['1','2','3'], filter out any empty strings, convert to ints
    try:
        ids = [int(i) for i in ids_param.split(",") if i.strip()]
    except ValueError:
        return jsonify({ "error": "Invalid id format" }), 400

    db_group = []
    for ath_id in ids:
        db_athlete = DBAthlete.query.get_or_404(ath_id)
        
        #Datenbank-Abfrage der Ergebnisse des jeweiligen Athleten; Ergebnisse auf 4 pro Athleten jeweilig begrenzt
        db_perf = DBResult.query.filter_by(athlete_id=ath_id).limit(4).all()
        
        #Datenbank-Einträge des jeweiligen Athleten dem Athlete-Objekt übergeben
        py_athlete = Athlete(
            first_name=db_athlete.first_name,
            last_name=db_athlete.last_name,
            gender=db_athlete.gender,
            birth_date=db_athlete.birth_date,
            swim_certificate=False,
            performances=[]
        )

        #Datenbank-Einträge der Übungen des jeweiligen Athleten dem Performance-Data-Objekt übergeben

        for perf in db_perf:
            res_rule=DBRule.query.get_or_404(perf.rule_id)
            py_athlete.performances.append(
                PerformanceData(
                    disciplin=res_rule.discipline.discipline_name, 
                    year=perf.year,
                    result=perf.result, 
                    points=perf.medal
                )
            )
            
        
        db_group.append(py_athlete)
        
    #Ausfüllen und Export des PDF-Template
    pdf_feedback = fill_out_group(db_group)

    logger.info("Gruppe von Athleten wurde erfolgreich in einer PDF exportiert!")
    return jsonify({
        "message": "Export erfolgreich",
        "pdf_feedback": pdf_feedback
    })
