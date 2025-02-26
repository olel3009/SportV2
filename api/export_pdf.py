from flask import Flask, jsonify, request
#import main
from pypdf import *
import api.athlet as athlet
from typing import Tuple
import re

#Athlet
swimming_certificate1 = athlet.SwimmingCertificate("keine Ahnung", True)
performance_data1 = athlet.PerformanceData("Laufen Ausdauer", "11.09.2001", "1 Min., 30 Sek.", 3)
performance_data2 = athlet.PerformanceData("Schwimmen Schnelligkeit", "03.06.1989", "0 Min., 30 Sek.", 2)
athlet1 = athlet.Athlet("Müller", "Mark Alexander", "m", "25.01.2005", swimming_certificate1, performance_data1, performance_data2)

birthdate: Tuple[str, str, str, str, str, str, str, str] = ("T1", "T2", "M1", "M2", "J1", "J2", "J3", "J4")

regex = ".(Ausdauer)|.(Kraft)|.(Schnelligkeit)|.(Koordinaten)"

PDFFILE = r'data\DSA_Einzelpruefkarte_2025_SCREEN.pdf'

def bday(ath: athlet) -> Tuple[str, str, str, str, str, str, str, str]:
    return (ath.birthdate[0], ath.birthdate[1], ath.birthdate[3], ath.birthdate[4], ath.birthdate[6], ath.birthdate[7], ath.birthdate[8], ath.birthdate[9])

def extract_form_fields() -> dict | None:
    reader = PdfReader(PDFFILE)
    fields = reader.get_fields()
    #for key, value in fields.items():
    #    print(key + " : " + str(value))
    return fields

def fill_out_fields(ath: athlet):
    fields = extract_form_fields()
    reader = PdfReader(PDFFILE)
    writer = PdfWriter()
    writer.append(reader)
    #value muss zu den jeweiligen attributen der 3 Klassen umgeändert werden
    for key in fields:
        print(key)
        for attr, value in ath.__dict__.items():
            #richtiges schreiben der Punkte und Daten gehlt
            if attr == "performances" and isinstance(value, tuple):
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
    DESTINATION = rf'pdfs\{ath.name}_{ath.surname}_DSA_Einzelpruefkarte_2025_SCREEN.pdf'

    with open(DESTINATION, "wb") as dest:
        writer.write(dest)

