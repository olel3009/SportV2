from datetime import datetime
from database import db

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
    swim_certificate = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Athlete {self.first_name} {self.last_name}>"

# Ergebnisse-Modell
class Result(db.Model):
    __tablename__ = 'results'

    id = db.Column(db.Integer, primary_key=True)
    # Verknüpfung mit Athlete
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.id'), nullable=False)
    # Verknüpfung mit Rule
    rule_id = db.Column(db.Integer, db.ForeignKey('rule.id'), nullable=False)

    # Jahr der Prüfung 
    year = db.Column(db.Integer, nullable=False)
    # Alter des Athleten im Prüfungsjahr
    age = db.Column(db.Integer, nullable=False)

    # Ergebnis (z.B. Zeit in Sekunden, Distanz in Meter, Punkte, ...)
    result = db.Column(db.Float, nullable=False)
    # Enum kann "Bronze", "Silber", "Gold" oder NULL sein
    medal = db.Column(
        db.Enum('Bronze', 'Silber', 'Gold', name='medal_enum'),
        nullable=True
    )

    # Zeitstempel
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships 
    athlete = db.relationship('Athlete', backref=db.backref('results', lazy=True))
    rule = db.relationship('Rule', backref=db.backref('results', lazy=True))

    def __repr__(self):
        return f"<Result Athlete ID: {self.athlete_id}, Year: {self.year}, Result: {self.result}>"

# Disciplin-Modell
class Discipline(db.Model):
    __tablename__ = 'discipline'

    id = db.Column(db.Integer, primary_key=True)
    discipline_name = db.Column(
        db.Enum('Ausdauer', 'Kraft', 'Schnelligkeit', 'Koordination', name='group_enum'),
        nullable=False
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Discipline {self.discipline_name}, Unit: {self.unit}>"

# Regel-Modell
class Rule(db.Model):
    __tablename__ = 'rule'

    id = db.Column(db.Integer, primary_key=True)

    # Fremdschlüssel auf discipline
    discipline_id = db.Column(db.Integer, db.ForeignKey('discipline.id'), nullable=False)
    discipline = db.relationship('Discipline', backref=db.backref('rules', lazy=True))

    rule_name = db.Column(db.String(255), nullable=False)
    unit = db.Column(db.Enum('points', 'distance', 'time', 'amount', name='unit_enum'), nullable=False)
    description_m = db.Column(db.String(255), nullable=False)
    description_f = db.Column(db.String(255), nullable=False)

    # Altersgrenzen
    min_age = db.Column(db.Integer, nullable=False)
    max_age = db.Column(db.Integer, nullable=False)

    # Thresholds für Bronze/Silber/Gold je Geschlecht (male/female)
    threshold_bronze_m = db.Column(db.Float, nullable=False)
    threshold_silver_m = db.Column(db.Float, nullable=False)
    threshold_gold_m = db.Column(db.Float, nullable=False)

    threshold_bronze_f = db.Column(db.Float, nullable=False)
    threshold_silver_f = db.Column(db.Float, nullable=False)
    threshold_gold_f = db.Column(db.Float, nullable=False)

    valid_start = db.Column(db.Date, nullable=False)
    valid_end = db.Column(db.Date, nullable=True)

    # Version, startet mit 1
    version = db.Column(db.Integer, nullable=False, default=1)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Rule {self.rule_name}, Version: {self.version}>"

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # Hash-Speicherung empfohlen
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.email}>"    