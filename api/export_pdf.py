import re
from datetime import datetime
from pypdf import PdfReader, PdfWriter
from api.athlet import Athlete

PDF_TEMPLATE = r"api/data/DSA_Einzelpruefkarte_2025_SCREEN.pdf"

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

     # -----------------------
     # 1) Geburtsdatum in T1, T2, M1, M2, J1, J2, J3, J4 splitten
     #    Beispiel:  "DD-MM-YYYY" -> T1=1, T2=2, M1=0, M2=6, J1=2, J2=0, J3=2, J4=3
     # -----------------------
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

     # -----------------------
     # 2) Athlete-Name, Geschlecht etc.
     # -----------------------
     # In deinem PDF gibt es Felder wie Nachname, Vorname, Geschlecht etc.
     # Häufig sind die Feldnamen nicht offensichtlich. Du musst sie via
     #   `reader.get_fields()` (pypdf 3.x) oder `reader.pages[0].Annots` inspizieren.
     # Ich gehe davon aus, dass T1,T2,... existieren und z.B. "sex", "first_name", "last_name" so heißen.
     # Du passt das bitte an die tatsächlichen Felder in deinem PDF an!
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

     # -----------------------
     # 3) PerformanceData eintragen
     #    Angenommen, du hast im PDF Felder wie "Ausdauer1", "Kraft1", etc.
     #    oder du füllst generische Felder in Abhängigkeit der Disziplin
     # -----------------------
     # Wir erlauben bis zu 4 Einträge (wie gefordert)
     for i, perf in enumerate(athlete.performances[:4]):
         # Bsp. "Ausdauer1Disciplin", "Ausdauer1Year", "Ausdauer1Result", "Ausdauer1Points"
         # Du kannst beliebige Feldnamen benutzen, je nach PDF-Feld.
         # Hier exemplifiziert:
         index = i + 1
         prefix = perf.disciplin  # z.B. "Ausdauer", "Kraft", ...
         suffix = prefix.split()[-1]
         points = perf.points
         # Bilde daraus z.B. "Ausdauer1Result"
         field_values[f"date {prefix}"]      = str(perf.year)
         field_values[f"{prefix}"]    = str(perf.result)
         field_values[f"P{points} {suffix}"]    = str("x")

     # -----------------------
     # 4) Felder wirklich ins PDF schreiben
     # -----------------------
     page = writer.pages[0]
     writer.update_page_form_field_values(page, field_values, auto_regenerate=False)

     # -----------------------
     # 5) Ausgefüllte PDF speichern
     # -----------------------
     destination = rf"api/pdfs/{athlete.last_name}_{athlete.first_name}_DSA_Einzelpruefkarte.pdf"
     with open(destination, "wb") as f:
         writer.write(f)

     return f"PDF erstellt unter {destination}"
