from flask import Flask, request, jsonify
import athlete

app = Flask(__name__)

@app.route('/gruppen/export/pdf', methods='[GET]')
def group():
    group = []
    for ath in group:
        return jsonify(ath)