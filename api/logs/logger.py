import logging
import logging.handlers
from flask import app
import sys, os
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)
import export_pdf

logger = logging.getLogger(__name__)

logging.basicConfig(
    filename=r'api\logs\system.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(name)s - %(message)s',
    filemode = 'w',
    )

logging.handlers.TimedRotatingFileHandler('system.log', when='s', interval=10,)

#@app.before_request
def log_request_info():
    #logging.info(f"Request: {request.method} {request.url} - Data: {request.json}")
    pass

def log_info_test():
    export_pdf.fill_out_fields(export_pdf.athlet1)
    logging.info(f"PDF fuer den Athleten {export_pdf.athlet1.surname} wurde angelegt!")

#logging modul erstellen zum import für jede benötigte Datei
#keine personenbezogene Daten loggen nur die Veränderungen

if __name__ == "__main__":
    log_info_test()