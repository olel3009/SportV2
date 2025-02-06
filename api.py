from flask import Flask, jsonify, request
#import main
from pypdf import *
import athlet

#Athlet
swimming_certificate1 = athlet.SwimmingCertificate("keine Ahnung", True)
performance_data1 = athlet.PerformanceData("Laufen", "11.09.2001", "1 Min., 30 Sek.", 3)
performance_data2 = athlet.PerformanceData("Schwimmen", "11.09.2001", "0 Min., 30 Sek.", 2)
athlet1 = athlet.Athlet("Müller", "Mark Alexander", "Männlich", "25.01.2005", (performance_data1, performance_data2), swimming_certificate1)

pdffile = r'C:\Users\A200274077\OneDrive - Deutsche Telekom AG\Desktop\SportV2-2\data\DSA_Einzelpruefkarte_2025_SCREEN.pdf'

def extract_form_fields(inputpdf) -> dict | None:
    reader = PdfReader(inputpdf)
    fields = reader.get_fields()
    for key in fields.keys():
        print(f"{key}\n")
    return fields

def fill_out_fields(inputpdf):
    fields = extract_form_fields(inputpdf)
    reader = PdfReader(inputpdf)
    writer = PdfWriter()
    writer.append(reader)
    #value muss zu den jeweiligen attributen der 3 Klassen umgeändert werden
    for key in fields:
        writer.update_page_form_field_values(
            writer.pages[0],
            {key: ""},
            auto_regenerate=False,
        )

app = Flask(__name__)

base_url = '/api/v1'

@app.route(base_url + '/athleten/<int:ath_id>/export/pdf', methods=['GET'])
def export_pdf(ath_id):
    #return main.create_pdf(ath_id)
    pass

if __name__ == "__main__":
    print(extract_form_fields(pdffile))
    print(athlet1.performances)