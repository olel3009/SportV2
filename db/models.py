from app import db
from datetime import datetime

# Trainer-Modell
class Trainer(db.Model):
    __tablename__ = 'trainers'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    gender = db.Column(db.Enum('m', 'f', 'd', name='gender_enum'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Trainer {self.first_name} {self.last_name}>"

# Athleten-Modell
class Athlete(db.Model):
    __tablename__ = 'athletes'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    gender = db.Column(db.Enum('m', 'f', 'd', name='gender_enum'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to results
    results = db.relationship('Result', backref='athlete', lazy=True)

    def __repr__(self):
        return f"<Athlete {self.first_name} {self.last_name}>"

# Ergebnisse-Modell
class Result(db.Model):
    __tablename__ = 'results'

    id = db.Column(db.Integer, primary_key=True)
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    result = db.Column(db.Float, nullable=False)  # z.B. Zeit oder Punkte
    version = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Result Athlete ID: {self.athlete_id}, Year: {self.year}, Result: {self.result}>"

# Regeln-Modell
class Regel(db.Model):
    __tablename__ = 'regeln'

    id = db.Column(db.Integer, primary_key=True)
    reglename = db.Column(db.String(255), nullable=False)
    beschreibung = db.Column(db.Text, nullable=True)
    disziplin = db.Column(db.String(50), nullable=True)
    strecke = db.Column(db.Integer, nullable=False)
    zeit_in_sekunden = db.Column(db.Integer, nullable=False)
    punkte = db.Column(db.Integer, nullable=False)
    gueltig_ab = db.Column(db.Date, nullable=False)
    gueltig_bis = db.Column(db.Date, nullable=True)
    version = db.Column(db.Integer, nullable=False, default=1)
    erstellt_am = db.Column(db.DateTime, default=datetime.utcnow)
    aktualisiert_am = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Regel {self.reglename}, Disziplin: {self.disziplin}>"
    