from flask import Flask, jsonify, request
#import main
from pypdf import *
import athlet

#Athlet
swimming_certificate1 = athlet.SwimmingCertificate("keine Ahnung", True)
performance_data1 = athlet.PerformanceData("Laufen", "11.09.2001", "1 Min., 30 Sek.", 3)
athlet1 = athlet.Athlet("Müller", "Mark Alexander", "Männlich", "25.01.2005", performance_data1, swimming_certificate1) 

pdffile = r'C:\Users\A200274077\OneDrive - Deutsche Telekom AG\Desktop\SportV2-2\data\DSA_Einzelpruefkarte_2025_SCREEN.pdf'

def extract_form_fields(inputpdf) -> dict | None:
    reader = PdfReader(inputpdf)
    page0 = reader.pages[0]
    print(page0)
    #Anscheinend befinden sich keine Forms auf der ersten Seite (sollten aber)
    fields = page0.get_fields()
    #fields = page0.getObject()
    #fields = reader.get_form_text_fields()
    print(fields)
    return fields

def fill_out_fields(inputpdf):
    fields = extract_form_fields(inputpdf)
    reader = PdfReader(inputpdf)
    writer = PdfWriter()
    writer.append(reader)
    #value muss zu den jeweiligen attributen der 3 Klassen umgeändert werden
    for key, value in fields:
        writer.update_page_form_field_values(
            writer.pages[0],
            {key: value},
            auto_regenerate=False,
        )

app = Flask(__name__)

base_url = '/api/v1'

@app.route(base_url + '/athleten/<int:ath_id>/export/pdf', methods=['GET'])
def export_pdf(ath_id):
    #return main.create_pdf(ath_id)
    pass

if __name__ == "__main__":
    #add_text(pdffile, destination, "LOLOLOLOLOLOL", 72, 72)
    #add_text(pdffile, test, "LOLOLOLOLOLOL", 72, 72)
    #print(PdfReader(pdffile).pages[0])
    extract_form_fields(pdffile)