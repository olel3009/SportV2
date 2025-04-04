from flask import Flask, request, jsonify, Blueprint
from database import db
from database.models import Athlete as DBAthlete

import athlete

app = Flask(__name__)

@app.route('/gruppen/export/pdf', methods=['GET'])
def group():
    group = []
    return jsonify([{
        "id": athlete.id,
        "first_name": athlete.first_name,
        "last_name": athlete.last_name,
        "birth_date": athlete.birth_date.strftime('%d-%m-%Y'),
        "gender": athlete.gender,
        "created_at": athlete.created_at,
        "updated_at": athlete.updated_at
    }for athlete in group])
