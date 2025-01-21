from flask import Flask, jsonify, request
import main

app = Flask(__name__)

base_url = '/api/v1'

@app.route(base_url + '/athleten/<int:ath_id>/export/pdf', methods=['GET'])
def export_pdf(ath_id):
    return main.create_pdf(ath_id)




