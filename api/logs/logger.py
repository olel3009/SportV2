import logging
from logging.handlers import TimedRotatingFileHandler
from flask import app
import sys, os
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)
import export_pdf


formatter= logging.Formatter('%(asctime)s - %(levelname)s - %(name)s - %(message)s')

handler = TimedRotatingFileHandler(r'api\logs\system.log', when='midnight', backupCount= 3, interval=1)
handler.setFormatter(formatter)

logger = logging.getLogger(__name__)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

#@app.before_request
def log_request_info():
    #logger.info(f"Request: {request.method} {request.url} - Data: {request.json}")
    pass

def log_info_pdf():
    export_pdf.fill_out_fields(export_pdf.athlet1)
    logger.info(f"PDF eines Athleten wurde angelegt!")

#logging modul erstellen zum import für jede benötigte Datei
#keine personenbezogene Daten loggen nur die Veränderungen

if __name__ == "__main__":
    while True:
        log_info_pdf()