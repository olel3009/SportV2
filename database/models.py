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
    disciplin = db.Column(db.String(255), nullable=False)
    result = db.Column(db.String(50), nullable=False)  # Erzielte Zeit, Strecke oder Punkte
    points = db.Column(db.Integer, nullable=False) # Ergebnis Punkt von 1-3
    medal = db.Column(db.Enum('Bronze', 'Silber', 'Gold', name='medal_enum'), nullable=True)
    version = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Result Athlete ID: {self.athlete_id}, Year: {self.year}, Result: {self.result}>"

# Disciplin-Modell
class Discipline(db.Model):
    __tablename__ = 'discipline'

    id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(255), nullable=False)
    discipline_name = db.Column(db.String(255), nullable=False)
    # unit kann 'points', 'distance', 'time' oder 'amount' sein
    unit = db.Column(db.Enum('points', 'distance', 'time', 'amount', name='unit_enum'), nullable=False)

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

    action = db.Column(db.String(255), nullable=False)

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
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id'), nullable=True)
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Beziehungen
    trainer = db.relationship('Trainer', backref=db.backref('users', lazy=True))
    athlete = db.relationship('Athlete', backref=db.backref('users', lazy=True))

    __table_args__ = (
        db.CheckConstraint('(trainer_id IS NOT NULL AND athlete_id IS NULL) OR (trainer_id IS NULL AND athlete_id IS NOT NULL)', 
                           name='check_only_one_role'),
    )

    def __repr__(self):
        return f"<User {self.email}>"    