from flask_jwt_extended import jwt_required
from sqlalchemy import and_
import os
from datetime import datetime, date
from flask import Blueprint, request, jsonify, current_app
from PyPDF2 import PdfReader, PdfWriter
from database import db
from database.models import Athlete, Result
from api.logs.logger import logger

bp_athlete_pdf = Blueprint('athlete_pdf', __name__, url_prefix='/athletes')

MEDAL_RANK = { 'Gold': 3, 'Silber': 2, 'Bronze': 1, None: 0 }
FIELD_GROUPS = {
    'Ausdauer': 'Ausdauer',
    'Kraft': 'Kraft',
    'Schnelligkeit': 'Schnelligkeit',
    'Koordination': 'Koordination',
}

def _medal_to_point(medal):
    return MEDAL_RANK.get(medal, 0)

def _split_date(d):
    """
    Liefert die Einzelziffern von Tag, Monat und Jahr in einem Dict:
      {'T1': '0', 'T2': '5', 'M1': '0', 'M2': '9',
       'J1': '2', 'J2': '0', 'J3': '2', 'J4': '5'}
    Akzeptiert als Input:
      - datetime.date
      - ISO-Strings 'YYYY-MM-DD'
      - Deutsche Strings 'DD.MM.YYYY'
    """
    # 1) Date-Objekt extrahieren
    if isinstance(d, date):
        dt = d
    elif isinstance(d, str):
        d = d.strip()
        # deutsche Notation?
        if '.' in d:
            try:
                dt = datetime.strptime(d, '%d.%m.%Y').date()
            except ValueError:
                raise ValueError(f"Ungültiges deutsches Datum: {d!r}")
        # ISO-Notation?
        elif '-' in d:
            try:
                dt = datetime.fromisoformat(d).date()
            except ValueError:
                raise ValueError(f"Ungültiges ISO-Datum: {d!r}")
        else:
            raise ValueError(f"Datum hat kein Trennzeichen: {d!r}")
    else:
        raise ValueError(f"Kann Datum nicht interpretieren: {d!r}")

    # 2) sauber in 'DD-MM-YYYY' umwandeln und splitten
    s = dt.strftime('%d-%m-%Y')  # z.B. '05-09-2025'
    parts = s.split('-')
    if len(parts) != 3:
        # sollte nie vorkommen, aber defensiv abfangen
        raise ValueError(f"Datum {s!r} lässt sich nicht in 3 Teile splitten")
    day, month, year = parts

    return {
        'T1': day[0], 'T2': day[1],
        'M1': month[0], 'M2': month[1],
        'J1': year[0], 'J2': year[1], 'J3': year[2], 'J4': year[3],
    }

def fill_pdf(athlete: Athlete, year: int) -> str:
    """
    Nimmt einen Athlete und das Prüfungsjahr,
    befüllt das PDF-Formular und speichert es.
    Gibt den Pfad zur Datei zurück.
    """
    template = current_app.config.get('PDF_TEMPLATE_PATH')
    reader = PdfReader(template)
    writer = PdfWriter()
    writer.append_pages_from_reader(reader)

    # parse year-Param als int
    year_param = int(request.args.get('year', datetime.today().year))

    # alle Ergebnisse des Athleten in diesem Jahr
    results = athlete.results
    results = [r for r in results if r.year.year == year_param]

    # gruppiert nach Feldgruppe, dann nach Medaillen-Rang absteigend
    best_per_group: dict[str, Result] = {}
    for r in results:
        grp = r.rule.discipline.discipline_name
        rank = MEDAL_RANK.get(r.medal, 0)
        if grp not in best_per_group or rank > MEDAL_RANK.get(best_per_group[grp].medal,0):
            best_per_group[grp] = r
    
    # Debug Info
    selected = []
    for grp, res in best_per_group.items():
        selected.append({
            "gruppe":      grp,
            "rule_name":   res.rule.rule_name,
            "result":      res.result,
            "medal":       res.medal,
            "datum":       res.year.strftime("%d.%m.%Y"),
            "points_field":"P"+str(MEDAL_RANK.get(res.medal, ""))+"_"+grp  
    })
    
    existing_fields = set(reader.get_fields().keys())
    page = writer.pages[0]

    # 2) PDF-Felder befüllen
    field_updates = {}

    # 2a) Name, Vorname, Geschlecht
    field_updates['name']    = athlete.first_name
    field_updates['surname'] = athlete.last_name
    field_updates['sex']     = 'w' if athlete.gender=='f' else 'm'

    # 2b) Geburtstags‐Split
    bd_fields = _split_date(athlete.birth_date)
    field_updates.update(bd_fields)

    # 2c) Nachweisfeld "swimming_proof"
    if athlete.swim_certificate:
        field_updates['swimming_proof'] = 'X'

    # 2d) Feld "date Nachweis" = heutiges Datum
    field_updates['date Nachweis'] = datetime.today().strftime('%d.%m.%Y')

    # 2e) für jede Gruppe Performance eintragen
    for grp_name, pdf_grp in FIELD_GROUPS.items():
        r = best_per_group.get(grp_name)
        # Ergebniswert und Datum
        if r:
            # Feldname im Formular ist z.B. "Laufen Ausdauer" oder "Schwimmen Koordination"
            form_field = f"{r.rule.rule_name.rsplit(',',1)[0]} {pdf_grp}"
            if form_field in existing_fields:
                field_updates[form_field] = str(r.result)

            # Datum-Feld:
            field_date_name  = f"date {pdf_grp}"
            if form_field in existing_fields:
                field_updates[field_date_name] = r.year.strftime('%d.%m.%Y')

            # P-Punkte Kreuzchen:
            pts = _medal_to_point(r.medal)

            pt_field = f"P{pts} {pdf_grp}"

            if pts:
                if form_field in existing_fields:
                    field_updates[pt_field] = 'X'

    # 3) Werte ins PDF schreiben
    writer.update_page_form_field_values(page, field_updates)

    # 4) Datei speichern
    output_dir = current_app.config['PDF_OUTPUT_FOLDER']
    # stelle sicher, dass das Verzeichnis existiert
    os.makedirs(output_dir, exist_ok=True)
    filename = f"athlete_{athlete.first_name}_{athlete.last_name}_{year}.pdf"
    destination = os.path.join(output_dir, filename)
    with open(destination, "wb") as f:
        writer.write(f)
        f.flush()
        os.fsync(f.fileno())

    # Info "selected" nur für Debug
    #logger.info((selected))
    logger.info((results))
    logger.info(best_per_group.items())

    return destination

@bp_athlete_pdf.route('/<int:athlete_id>/export/pdf', methods=['GET'])
@jwt_required()
def export_athlete_pdf(athlete_id):
    # Parameter
    year_str = request.args.get('year')
    if not year_str or not year_str.isdigit():
        return jsonify(error="Bitte Prüfungsjahr als 'year' (z.B. 2025) angeben"), 400
    year = int(year_str)

    # Athlete laden
    athlete = Athlete.query.get_or_404(athlete_id)

    try:
        pdf_path = fill_pdf(athlete, year)
    except Exception as e:
        current_app.logger.exception("Fehler beim Füllen des PDFs")
        return jsonify(error=str(e)), 500

    return jsonify({
        "message": "PDF erfolgreich erstellt",
        "path": pdf_path
    }), 200
