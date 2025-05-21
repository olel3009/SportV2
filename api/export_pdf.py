from datetime import datetime
from pypdf import PdfReader, PdfWriter
from api.athlet import Athlete
import os

PDF_TEMPLATE = r"api/data/DSA_Einzelpruefkarte_2025_SCREEN.pdf"
GROUP_TEMPLATE = r"api\data\DSA_Gruppenpruefkarte_2025_SCREEN.pdf"

def fill_pdf_form(athlete: Athlete) -> str:
    """
    Nimmt ein Athlete-Objekt und schreibt dessen Daten
    in die Felder der PDF "DSA_Einzelpruefkarte_2025_SCREEN.pdf".
    Gibt den Pfad zur ausgefüllten PDF zurück.
    """
    try:
        reader = PdfReader(PDF_TEMPLATE)
    except FileNotFoundError:
        return f"Fehler: PDF-Vorlage {PDF_TEMPLATE} nicht gefunden."
    writer = PdfWriter()
    writer.append(reader)

    # 1) Geburtsdatum in T1, T2, M1, M2, J1, J2, J3, J4 splitten
    birth_str = ""
    if isinstance(athlete.birth_date, datetime):
        birth_str = athlete.birth_date.strftime("%d-%m-%Y") 
    elif isinstance(athlete.birth_date, str):
        # Falls es schon ein String im Format "YYYY-MM-DD" ist, passend umwandeln
        dt = datetime.strptime(athlete.birth_date, "%Y-%m-%d")
        birth_str = dt.strftime("%d-%m-%Y")
    else:
        # Notlösung
        birth_str = "01-01-2000"
    # "DD-MM-YYYY"
    day, month, year = birth_str.split("-")  # z.B. day="12", month="06", year="2023"
    T1, T2 = day[0], day[1]
    M1, M2 = month[0], month[1]
    J1, J2, J3, J4 = year[0], year[1], year[2], year[3]

    # 2) Athlete-Name, Geschlecht etc.
    field_values = {
        # Geburtsdatum
        "T1": T1,
        "T2": T2,
        "M1": M1,
        "M2": M2,
        "J1": J1,
        "J2": J2,
        "J3": J3,
        "J4": J4,
        # Name, Geschlecht ...
        "name": athlete.first_name,
        "surname": athlete.last_name,
        "sex": athlete.gender,  # z.B. "m"
    }

    # 3) PerformanceData eintragen
    # bis zu 4 Einträge 
    for i, perf in enumerate(athlete.performances[:4]):
       
        index = i + 1
        prefix = perf.disciplin  # z.B. "Ausdauer", "Kraft", ...
        suffix = prefix.split()[-1]
        points = perf.points
        # Bilde daraus z.B. "Ausdauer1Result"
        field_values[f"date {prefix}"]      = str(perf.year)
        field_values[f"{prefix}"]    = str(perf.result)
        field_values[f"P{points} {suffix}"]    = str("x")
    # 4) Felder wirklich ins PDF schreiben
    page = writer.pages[0]
    writer.update_page_form_field_values(page, field_values, auto_regenerate=False)
    # 5) Ausgefüllte PDF speichern
    path=rf"/downloadFiles/{athlete.last_name}_{athlete.first_name}_DSA_Einzelpruefkarte.pdf"
    destination = rf"./frontend/public{path}"
    
    # ensure the output directory exists
    output_dir = os.path.dirname(destination)
    os.makedirs(output_dir, exist_ok=True)
    with open(destination, "wb") as f:
        writer.write(f)
    return f"{path}"

def fill_out_group(athletenIds: list[Athlete]) -> str:
    """ 
    Nimmt eine Liste von athleten und schreibt dessen Daten 
    in die Felder der PDF "DSA_Gruppenpruefkarte.pdf"
    Gibt den Pfad zur ausgefüllten PDF zurück.
    """
    try:
        reader = PdfReader(GROUP_TEMPLATE)
    except FileNotFoundError:
        return f"Fehler: PDF-Vorlage {GROUP_TEMPLATE} nicht gefunden."
    writer = PdfWriter()
    writer.append(reader)
    
    performances = {
        "Ausdauer":{
            1 : "Laufen",
            2 : "10km Lauf",
            3 : "Dauer-/Geländelauf",
            4 : "7,5km Walking/Nordic Walking",
            5 : "Schwimmen",
            6 : "Radfahren",
            "A" : "Sportartspezifisches Abzeichen",
        },
        "Kraft":{
            1:"Schlagball/Wurfball",
            2:"Medizinball",
            3:"Kugelstoßen",
            4:"Steinstoßen",
            5:"Standweitsprung",
            6:"erweiteter Leistungskatalog",
            7:"Gerätturnen",
            "A":"Sportartspezifisches Abzeichen",
        },
        "Schnelligkeit":{
            1:"Laufen",
            2:"Schwimmen",
            3:"Radfahren",
            4:"Gerätturnen",
        },
        "Koordination":{
            1:"Hochsprung",
            2:"Weitsprung",
            3:"Zonenweitsprung",
            4:"Drehwurf",
            5:"Schleuderball",
            6:"Seilspringen",
            7:"Gerätturnen",
            "A":"Sportartspezifisches Abzeichen",
        }
    }
    for athlete, i in zip(athletenIds, range(1,len(athletenIds)+1)):
        field_values = {
            f"name{i}": f"{athlete.last_name} {athlete.first_name}",
            f"sex{i}" : athlete.gender,
            f"birthdate{i}": athlete.birth_date,
            #f"age{i}" : (int(datetime.today().year) - int(datetime.date(athlete.birth_date, "%Y-%m-%d").year))
        }
        sum = 0
        for perf in athlete.performances:
            prefix = perf.disciplin.split()[0]
            suffix = perf.disciplin.split()[-1]
            field_values.update({f"Punkte_{suffix}{str(i)}" : str(perf.points)})
            for key in performances[suffix].keys():
                if performances[suffix][key] == prefix:
                    field_values.update({f"ZdÜ_{suffix}{str(i)}" : key})
            field_values.update({f"{suffix}{str(i)}" : prefix})
            #sum = sum + perf.points  ##TODO das hier muss iwie über medaillien oder sowas laufen
            sum=0
            field_values.update({f"Gesamtpunktzahl{i}" : sum})
        writer.update_page_form_field_values(writer.pages[0], field_values, auto_regenerate=False)

    path=rf"/downloadFiles/{...}_DSA_Gruppenpruefkarte.pdf"
    destination = rf"./frontend/public{path}"
    
    # ensure the output directory exists
    output_dir = os.path.dirname(destination)
    os.makedirs(output_dir, exist_ok=True)
    with open(destination, "wb") as f:
        writer.write(f)
    return f"{path}"

if __name__ == "__main__":
    fill_out_group(Gruppe1)