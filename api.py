from flask import Flask, jsonify, request
#import main
from pypdf import PdfReader
from pathlib import Path
import athlet
from reportlab.pdfgen.canvas import Canvas
from pdfrw import PdfReader, PdfWriter, PageMerge
from io import BytesIO
 
#Athlet
swimming_certificate1 = athlet.SwimmingCertificate("keine Ahnung", True)
performance_data1 = athlet.PerformanceData("Laufen", "11.09.2001", "1 Min., 30 Sek.", 3)
athlet1 = athlet.Athlet("Müller", "Mark Alexander", "Männlich", "25.01.2005", performance_data1, swimming_certificate1) 

pdffile = r'C:\Users\mulle\Desktop\SportV2\data\DSA_Einzelpruefkarte_2025_SCREEN.pdf'
destination = r'C:\Users\mulle\Desktop\SportV2\data\Neu_DSA_Einzelpruefkarte_2025_SCREEN.pdf'
test = r'C:\Users\mulle\Desktop\SportV2\data\test.pdf'
 
def add_text(inputpdf, outputpdf, text, x, y):

    pdf_reader = PdfReader(inputpdf)
    pdf_writer = PdfWriter()

    #Buffer
    packet = BytesIO()
    canvas = Canvas(packet)
    canvas.drawString(x,y, text)
    canvas.save()
    
    #Anfang des Buffers
    packet.seek(0)

    #Bestehende PDF mit Neuer mergen
    newpdf = PdfReader(packet)
    page = pdf_reader.pages[0]
    pagemerge = PageMerge(page)
    pagemerge.add(newpdf.pages[0])
    pdf_writer.addpage(page)

    #Übrige Seiten wieder hinzufügen
    for p in range(1, len(pdf_reader.pages)):
        pdf_writer.addpage(pdf_reader.pages[p])

    #Gemergedte Inhalte in der neuen PDF speichern
    pdf_writer.write(outputpdf)


app = Flask(__name__)

base_url = '/api/v1'

@app.route(base_url + '/athleten/<int:ath_id>/export/pdf', methods=['GET'])
def export_pdf(ath_id):
    #return main.create_pdf(ath_id)
    pass

if __name__ == "__main__":
    add_text(pdffile, destination, "LOLOLOLOLOLOL", 72, 72)
    add_text(pdffile, test, "LOLOLOLOLOLOL", 72, 72)
    print(PdfReader(pdffile).pages[0])