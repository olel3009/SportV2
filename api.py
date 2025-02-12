from flask import Flask, jsonify, request
#import main
from pypdf import *
import athlet

#Athlet
swimming_certificate1 = athlet.SwimmingCertificate("keine Ahnung", True)
performance_data1 = athlet.PerformanceData("Laufen", "11.09.2001", "1 Min., 30 Sek.", 3)
performance_data2 = athlet.PerformanceData("Schwimmen Schnelligkeit", "11.09.2001", "0 Min., 30 Sek.", 2)
athlet1 = athlet.Athlet("Müller", "Mark Alexander", "m", "25.01.2005", swimming_certificate1, performance_data1, performance_data2)

pdffile = r'C:\Users\A200274077\OneDrive - Deutsche Telekom AG\Desktop\SportV2-2\data\DSA_Einzelpruefkarte_2025_SCREEN.pdf'

def extract_form_fields(inputpdf) -> dict | None:
    reader = PdfReader(inputpdf)
    fields = reader.get_fields()
    #for key in fields.keys():
    #    print(f"{key}\n")
    return fields

def append_obj(key, obj: object, writer: PdfWriter):
    for sub_attr, sub_value in obj.__dict__.items():
        if key == sub_attr:
            print("KLAPPT!")
            writer.update_page_form_field_values(
                writer.pages[0],
                {sub_attr: sub_value},
                auto_regenerate=False,
            )

def fill_out_fields(inputpdf):
    fields = extract_form_fields(inputpdf)
    reader = PdfReader(inputpdf)
    writer = PdfWriter()
    writer.append(reader)
    #value muss zu den jeweiligen attributen der 3 Klassen umgeändert werden
    for key in fields:
        print(key)
        for attr, value in athlet1.__dict__.items():
            #print(type(value))
            if attr == "performances" and isinstance(value, tuple):
                for perf_obj in value:
                    if key == value.exersize:
                        #append_obj(key, perf_obj, writer)
                        print(perf_obj.__name__().upper() + "-OBJEKT GEFUNDEN!")
            #print(value)
            if key == attr and isinstance(value, athlet.SwimmingCertificate) :
                print("ZERTIFIKAT!")
                if value.fulfilled == True:
                    pass
                    print(True)
                    #writer.update_page_form_field_values(
                    #    writer.pages[0],
                    #    {key: value.fulfilled},
                    #    auto_regenerate=False,
                    #)
                if value.fulfilled == False:
                    pass
                print(False)
                    #writer.update_page_form_field_values(
                    #    writer.pages[0],
                    #    {key: value.fulfilled},
                    #    auto_regenerate=False,
                    #)
            if  key == attr and (not isinstance(value, object) or not isinstance(value, tuple)):
                print("STRING!")
                #writer.update_page_form_field_values(
                #    writer.pages[0],
                #    {attr: value},
                #    auto_regenerate=False,
                #)
            if key == attr and (isinstance(value, int) or isinstance(value, bool)):
                if isinstance(value, int):
                    print("ZIFFER!")
                if isinstance(value, bool):
                    print("BOOL!")

    with open(r"C:\Users\A200274077\OneDrive - Deutsche Telekom AG\Desktop\SportV2-2\data\NEU_DSA_Einzelpruefkarte_2025_SCREEN.pdf", "wb") as dest:
        writer.write(dest)

app = Flask(__name__)

base_url = '/api/v1'

@app.route(base_url + '/athleten/<int:ath_id>/export/pdf', methods=['GET'])
def export_pdf(ath_id):
    #return main.create_pdf(ath_id)
    pass

if __name__ == "__main__":
    #print(athlet1.performances[0].exersize)
    #print(performance_data1.exersize)
    #print(athlet1.__dict__.items())
    fill_out_fields(pdffile)