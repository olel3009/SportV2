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
    medal = db.Column(db.Enum('Bronze', 'Silber', 'Gold', name='medal_enum'), nullable=False)
    version = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Result Athlete ID: {self.athlete_id}, Year: {self.year}, Result: {self.result}>"

# Regeln-Modell
class Regel(db.Model):
    __tablename__ = 'regeln'

    id = db.Column(db.Integer, primary_key=True)
    rulename = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    disciplin = db.Column(db.String(255), nullable=True)
    distance = db.Column(db.Integer, nullable=False)
    time_in_seconds = db.Column(db.Integer, nullable=False)
    points = db.Column(db.Integer, nullable=False)
    valid_start = db.Column(db.Date, nullable=False)
    valid_end = db.Column(db.Date, nullable=True)
    version = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Regel {self.reglename}, Disziplin: {self.disziplin}>"

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