import os
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from sqlalchemy import extract
from PyPDF2 import PdfReader, PdfWriter

from database.models import Athlete, Result

bp_group = Blueprint('group_pdf', __name__, url_prefix='/group')

# Hilfs-Mappings
EXERCISE_CODES = {
    'Ausdauer': {
        'Laufen': '1',
        '10 km Lauf': '2',
        'Dauer-/Geländelauf': '3',
        '7,5 km Walking': '4',
        'Schwimmen': '5',
        'Radfahren': '6',
        'Sportartspezifisches Abzeichen': 'A',
    },
    'Kraft': {
        'Schlagball / Wurfball': '1',
        'Medizinball': '2',
        'Kugelstoßen': '3',
        'Steinstoßen': '4',
        'Standweitsprung': '5',
        'Erweiterter LK': '6',
        'Gerätturnen': '7',
        'Sportartspezifisches Abzeichen': 'A',
    },
    'Schnelligkeit': {
        'Laufen': '1',
        'Schwimmen': '2',
        'Radfahren': '3',
        'Gerätturnen': '4',
    },
    'Koordination': {
        'Hochsprung': '1',
        'Weitsprung': '2',
        'Zonenweitsprung': '3',
        'Drehwurf': '4',
        'Schleuderball': '5',
        'Seilspringen': '6',
        'Gerätturnen': '7',
    },
}

MEDAL_POINTS = {'Bronze': 1, 'Silber': 2, 'Gold': 3}

@bp_group.route('/export/pdf', methods=['POST'])
@jwt_required()
def export_group_pdf():
    data = request.get_json(silent=True) or {}
    year = data.get('year') or request.args.get('year', type=int)
    ids  = data.get('athlete_ids') or request.args.get('athlete_ids', '')
    if isinstance(ids, str):
        # aus "1,2,3,4" eine Liste von ints machen
        athlete_ids = [int(x) for x in ids.split(',') if x.strip()]
    else:
        athlete_ids = ids

    # Validierung
    if not isinstance(athlete_ids, list) or not 1 <= len(athlete_ids) <= 10:
        return jsonify(error="Bitte eine Liste von 1–10 athlete_ids übergeben"), 400
    if not isinstance(year, int):
        return jsonify(error="Bitte 'year' als Integer übergeben"), 400

    # PDF-Vorlage laden
    tpl = current_app.config['GROUP_PDF_TEMPLATE_PATH']
    reader = PdfReader(tpl)
    writer = PdfWriter()
    writer.append_pages_from_reader(reader)
    page = writer.pages[0]

    # vorhandene Feldnamen
    existing = set(reader.get_fields().keys())

    # Output-Ordner vorbereiten
    out_dir = current_app.config.get('PDF_OUTPUT_FOLDER', 'api/pdfs')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"group_{datetime.now():%d%m%Y_%H%M%S}.pdf")

    y2 = f"{year % 100:02d}"
    jdp1, jdp2 = y2[0], y2[1]

    updates = {
        "jdp1": jdp1,
        "jdp2": jdp2,
    }

    # Für jeden Athleten eine Zeile (idx=1…len(athlete_ids))
    athletes = Athlete.query.filter(Athlete.id.in_(athlete_ids)).all()
    for idx, athlete in enumerate(athletes, start=1):
        # -- 1) Basisfelder --
        # name, sex, birthdate, age
        nm = f"{athlete.last_name}, {athlete.first_name}"
        updates[f"name{idx}"]      = nm
        updates[f"sex{idx}"]       = 'w' if athlete.gender=='f' else 'm'
        bd_str = athlete.birth_date.strftime("%d.%m.%Y")
        updates[f"birthdate{idx}"] = bd_str
        age = year - athlete.birth_date.year
        updates[f"age{idx}"]       = str(age)

        # -- 2) Ergebnisse des Jahres abrufen --
        results = (
            Result.query
                  .filter_by(athlete_id=athlete.id)
                  .filter(extract('year', Result.year) == year)
                  .all()
        )

        # best Result je Disziplin-Gruppe ermitteln
        best = {}
        for r in results:
            grp = r.rule.discipline.discipline_name
            base = r.rule.rule_name.split(',')[0]
            # nur Übungen, die im Mapping existieren
            if base not in EXERCISE_CODES.get(grp, {}):
                continue
            rank = MEDAL_POINTS.get(r.medal, 0)
            prev = best.get(grp)
            if prev is None or rank > MEDAL_POINTS.get(prev.medal, 0):
                best[grp] = r

        # Punkte-Summe
        total = 0

        # -- 3) je Disziplin die Felder befüllen --
        for grp, code_map in EXERCISE_CODES.items():
            r = best.get(grp)
            if not r:
                continue  # keine Übung dieser Disziplin → nichts setzen

            base = r.rule.rule_name.split(',')[0]
            code = code_map[grp] if code_map.get(base) is None else code_map[base]
            # Übungs-Ziffer
            fld_zu = f"ZdUe_{grp}{idx}"
            if fld_zu in existing:
                updates[fld_zu] = str(code)
            # Ergebnis-Wert
            fld_val = f"{grp}{idx}"
            if fld_val in existing:
                val = f"{r.result:.2f}".replace(".", ",")
                updates[fld_val] = f"{val} ({r.rule.unit})"
            # Punkte
            pts = MEDAL_POINTS.get(r.medal)
            if pts:
                fld_pt = f"Punkte_{grp}{idx}"
                if fld_pt in existing:
                    updates[fld_pt] = str(pts)
                total += pts

        # -- 4) Gesamtpunktzahl --
        fld_tot = f"Gesamtpunktzahl{idx}"
        if fld_tot in existing:
            updates[fld_tot] = str(total)

    # alle Felder updaten und speichern
    writer.update_page_form_field_values(page, updates)
    with open(out_path, 'wb') as f:
        writer.write(f)

    return jsonify(pdf_path=out_path), 200
