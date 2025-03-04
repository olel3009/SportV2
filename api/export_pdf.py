#import main
import re
from typing import Any, Tuple
from pypdf import PdfReader, PdfWriter
import api.athlet as athlet

birthdate: Tuple[str, str, str, str, str, str, str, str] = ("T1", "T2", "M1", "M2", "J1", "J2", "J3", "J4")

regex = ".(Ausdauer)|.(Kraft)|.(Schnelligkeit)|.(Koordinaten)"

PDFFILE = r'api\data\DSA_Einzelpruefkarte_2025_SCREEN.pdf'

def bday(ath: athlet) -> Tuple[str, str, str, str, str, str, str, str]:
    return (ath.birthdate[0], ath.birthdate[1], ath.birthdate[3], ath.birthdate[4], ath.birthdate[6], ath.birthdate[7], ath.birthdate[8], ath.birthdate[9])

def extract_form_fields(reader: PdfReader):
    """
    Liest alle Formularfelder aus dem PDF aus.
    """
    fields = reader.get_fields()
    return fields

def generate_export_string(athlete: Any) -> str:
    """
    Erzeugt einen komma-separierten String aus 
    name, last_name, birthdate + PerformanceData (disciplin, date, result, points).
    """
    # Basisstring
    output_string = f"{athlete.first_name},{athlete.last_name},{athlete.birthdate}"

    # Performance-Daten
    for perf_obj in athlete.performances:
        output_string += f",{perf_obj.disciplin},{perf_obj.date},{perf_obj.result},{perf_obj.points}"

    return output_string

def fill_out_fields(ath: Any) -> str:
    """
    Schreibt Athletendaten (Name, Birthdate usw.) + Performance-Daten in ein PDF-Formular.
    Diese Funktion enthält den Code, den du in deinen Screenshots gezeigt hast,
    leicht angepasst, um PerformanceData zu verarbeiten.
    """
    try:
        reader = PdfReader(PDFFILE)
    except FileNotFoundError:
        return f"PDF-Datei {PDFFILE} nicht gefunden. Kein PDF-Export möglich."

    writer = PdfWriter()
    writer.append(reader)
    
    fields = extract_form_fields(reader)
    # print(fields)  # Nur zum Debuggen

    # Hier aktualisieren wir Felder in writer.pages[0]
    for key in fields:
        for attr, value in ath.__dict__.items():
            # 1) Falls es um Performance-Daten geht
            if key == "performances" and isinstance(ath.performances, (list, tuple)):
                for perf_obj in value:
                    match perf_obj:
                        case perf_obj if perf_obj.exersize == key:
                            writer.update_page_form_field_values(
                            writer.pages[0],
                            {key : perf_obj.result},
                            auto_regenerate=False,
                        )
                        case perf_obj if str(perf_obj.points) in key and (re.search(regex, key) and re.search(regex, perf_obj.exersize) is not None) and re.search(regex, key).group() == re.search(regex, perf_obj.exersize).group():
                            writer.update_page_form_field_values(
                            writer.pages[0],
                            {key : "X"},
                            auto_regenerate=False,
                        )
                        case perf_obj if "date" in key and (re.search(regex, key) and re.search(regex, perf_obj.exersize) is not None) and re.search(regex, key).group() == re.search(regex, perf_obj.exersize).group():
                            writer.update_page_form_field_values(
                            writer.pages[0],
                            {key : perf_obj.date},
                            auto_regenerate=False,
                        )
            # 2) SwimmingCertificate (freiwillig)
            match key:
                #Fertiggestellt
                    case key if key == attr and isinstance(value, athlet.SwimmingCertificate) :
                        #print("ZERTIFIKAT!")
                        #print(key)
                        if value.fulfilled:
                            #print(value.fulfilled)
                            writer.update_page_form_field_values(
                                writer.pages[0],
                                {key : "X"},
                                auto_regenerate=False,
                            )
                        if not value.fulfilled:
                            #print(value.fulfilled)
                            writer.update_page_form_field_values(
                                writer.pages[0],
                                {key: ""},
                                auto_regenerate=False,
                            )
                    #Fast fertiggestellt nur noch das Geburtsdatum
                    case key if key == attr and not isinstance(value, athlet.SwimmingCertificate):
                        #print("STRING!")
                        writer.update_page_form_field_values(
                            writer.pages[0],
                            {attr: value},
                            auto_regenerate=False,
                        )
                    case key if key in birthdate:
                        for dateelement in birthdate:
                            if key == dateelement:
                                n = dateelement[1]
                                match dateelement[0]:
                                    case "T":
                                        writer.update_page_form_field_values(
                                            writer.pages[0],
                                            {key: bday(ath)[int(n)-1]},
                                            auto_regenerate=False,
                                        )
                                    case "M":
                                        writer.update_page_form_field_values(
                                            writer.pages[0],
                                            {key: bday(ath)[1+int(n)]},
                                            auto_regenerate=False,
                                        )
                                    case "J":
                                        writer.update_page_form_field_values(
                                            writer.pages[0],
                                            {key: bday(ath)[3+int(n)]},
                                            auto_regenerate=False,
                                        )

    # PDF abspeichern
    destination = rf"api\pdfs\{ath.first_name}_{ath.last_name}_DSA_Einzelpruefkarte_2025_SCREEN.pdf"
    with open(destination, "wb") as dest:
        writer.write(dest)

    return f"PDF erfolgreich generiert: {destination}"


def process_export(athlete: Any) -> tuple[str, str]:
    """
    1) Erzeugt den Export-String
    2) Ruft die PDF-Schreibfunktion auf
    3) Gibt beides zurück
    """
    output_string = generate_export_string(athlete)
    pdf_feedback = fill_out_fields(athlete)
    return output_string, pdf_feedback
