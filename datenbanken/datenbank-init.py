from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///regeln.db'  # Passe den URI für deine Datenbank an
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Regel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reglename = db.Column(db.String(255), nullable=False)
    beschreibung = db.Column(db.Text, nullable=True)
    disziplin = db.Column(db.String(50), nullable=True)
    strecke = db.Column(db.Integer, nullable=False)
    zeit_in_sekunden = db.Column(db.Integer, nullable=False)
    punkte = db.Column(db.Integer, nullable=False)
    gueltig_ab = db.Column(db.Date, nullable=False)
    gueltig_bis = db.Column(db.Date, nullable=True)
    version = db.Column(db.Integer, default=1)
    erstellt_am = db.Column(db.DateTime, default=datetime.utcnow)
    aktualisiert_am = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

db.create_all()