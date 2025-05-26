from datetime import datetime
from pypdf import PdfReader, PdfWriter
from api.athlet import Athlete, PerformanceData

PDF_TEMPLATE = r"api/data/DSA_Einzelpruefkarte_2025_SCREEN.pdf"

def fill_pdf_form(athlete: Athlete) -> str:
    """
    Füllt die PDF "DSA_Einzelpruefkarte_2025_SCREEN.pdf" mit den Daten
    aus dem Athlete-Objekt und speichert sie ab.
    Gibt den Pfad zur erzeugten PDF oder eine Fehlermeldung zurück.
    """
    # 1) PDF-Vorlage einlesen
    try:
        reader = PdfReader(PDF_TEMPLATE)
    except FileNotFoundError:
        return f"Fehler: PDF-Vorlage {PDF_TEMPLATE} nicht gefunden."
    writer = PdfWriter()
    writer.append(reader)

    # 2) Geburtsdatum aufsplitten in T1/T2, M1/M2, J1–J4
    if isinstance(athlete.birth_date, datetime):
        birth_str = athlete.birth_date.strftime("%d-%m-%Y")
    elif isinstance(athlete.birth_date, str):
        # erwartet "YYYY-MM-DD"
        dt = datetime.strptime(athlete.birth_date, "%Y-%m-%d")
        birth_str = dt.strftime("%d-%m-%Y")
    else:
        birth_str = "01-01-2000"
    day, month, year = birth_str.split("-")
    T1, T2 = day[0], day[1]
    M1, M2 = month[0], month[1]
    J1, J2, J3, J4 = year[0], year[1], year[2], year[3]

    # 3) Basis-Felder (Geburt, Name, Geschlecht)
    field_values = {
        "T1": T1, "T2": T2,
        "M1": M1, "M2": M2,
        "J1": J1, "J2": J2, "J3": J3, "J4": J4,
        "name": athlete.first_name,
        "surname": athlete.last_name,
        "sex": athlete.gender,
    }

    # 4) Bestleistungen pro Disziplin ermitteln
    is_time_discipline = {
        "Ausdauer": True,
        "Schnelligkeit": True,
        "Kraft": False,
        "Koordination": False,
    }

    best_per_discipline: dict[str, PerformanceData] = {}

    for perf in athlete.performances:
        disc = perf.disciplin  # z. B. "Ausdauer"
        pts = {"Bronze": 1, "Silber": 2, "Silver": 2, "Gold": 3}.get(perf.points, 0)

        if disc not in best_per_discipline:
            perf._pts = pts
            best_per_discipline[disc] = perf
            continue

        other = best_per_discipline[disc]
        other_pts = getattr(other, "_pts", 0)

        if pts > other_pts:
            perf._pts = pts
            best_per_discipline[disc] = perf
        elif pts == other_pts:
            better_is_smaller = is_time_discipline.get(disc, True)
            if (better_is_smaller and perf.result < other.result) or \
               (not better_is_smaller and perf.result > other.result):
                perf._pts = pts
                best_per_discipline[disc] = perf

    # 5) PDF-Felder für jede Disziplin befüllen
    for discipline, perf in best_per_discipline.items():
       # short_rule = perf.rule_description_f.split(",")[0].strip()
        #exercise_field = f"{short_rule} {discipline}"
        date_field     = f"date {discipline}"
        point_field    = f"P{perf._pts} {discipline}"

       # field_values[exercise_field] = str(perf.result)
        field_values[date_field]     = perf.year
        field_values[point_field]    = "x"

    # 6) Felder in die PDF schreiben
    page = writer.pages[0]
    writer.update_page_form_field_values(page, field_values, auto_regenerate=False)

    # 7) PDF speichern
    destination = rf"api/pdfs/{athlete.last_name}_{athlete.first_name}_DSA_Einzelpruefkarte.pdf"
    with open(destination, "wb") as f:
        writer.write(f)

    return f"PDF erstellt unter {destination}"