from flask import Blueprint, request, jsonify
from app import db
from app.models import Trainer, Athlete, Result, Regel

# Blueprint für Routen
bp = Blueprint('routes', __name__)

# TRAINERS -----------------------------------------------------------------------

@bp.route('/trainers', methods=['POST'])
def create_trainer():
    data = request.json
    new_trainer = Trainer(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        birth_date=datetime.strptime(data['birth_date'], '%Y-%m-%d'),
        gender=data['gender']
    )
    db.session.add(new_trainer)
    db.session.commit()
    return jsonify({"message": "Trainer hinzugefügt", "id": new_trainer.id}), 201

@bp.route('/trainers', methods=['GET'])
def get_trainers():
    trainers = Trainer.query.all()
    return jsonify([{
        "id": trainer.id,
        "first_name": trainer.first_name,
        "last_name": trainer.last_name,
        "email": trainer.email,
        "birth_date": trainer.birth_date.strftime('%Y-%m-%d'),
        "gender": trainer.gender,
        "created_at": trainer.created_at,
        "updated_at": trainer.updated_at
    } for trainer in trainers])

@bp.route('/trainers/<int:id>', methods=['PUT'])
def update_trainer(id):
    trainer = Trainer.query.get_or_404(id)
    data = request.json
    trainer.first_name = data.get('first_name', trainer.first_name)
    trainer.last_name = data.get('last_name', trainer.last_name)
    trainer.email = data.get('email', trainer.email)
    trainer.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d') if 'birth_date' in data else trainer.birth_date
    trainer.gender = data.get('gender', trainer.gender)
    db.session.commit()
    return jsonify({"message": "Trainer aktualisiert"})

@bp.route('/trainers/<int:id>', methods=['DELETE'])
def delete_trainer(id):
    trainer = Trainer.query.get_or_404(id)
    db.session.delete(trainer)
    db.session.commit()
    return jsonify({"message": "Trainer gelöscht"})

# ATHLETES -----------------------------------------------------------------------

@bp.route('/athletes', methods=['POST'])
def create_athlete():
    data = request.json
    new_athlete = Athlete(
        first_name=data['first_name'],
        last_name=data['last_name'],
        birth_date=datetime.strptime(data['birth_date'], '%Y-%m-%d'),
        gender=data['gender']
    )
    db.session.add(new_athlete)
    db.session.commit()
    return jsonify({"message": "Athlet hinzugefügt", "id": new_athlete.id}), 201

@bp.route('/athletes', methods=['GET'])
def get_athletes():
    athletes = Athlete.query.all()
    return jsonify([{
        "id": athlete.id,
        "first_name": athlete.first_name,
        "last_name": athlete.last_name,
        "birth_date": athlete.birth_date.strftime('%Y-%m-%d'),
        "gender": athlete.gender,
        "created_at": athlete.created_at,
        "updated_at": athlete.updated_at
    } for athlete in athletes])

@bp.route('/athletes/<int:id>', methods=['PUT'])
def update_athlete(id):
    athlete = Athlete.query.get_or_404(id)
    data = request.json
    athlete.first_name = data.get('first_name', athlete.first_name)
    athlete.last_name = data.get('last_name', athlete.last_name)
    athlete.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d') if 'birth_date' in data else athlete.birth_date
    athlete.gender = data.get('gender', athlete.gender)
    db.session.commit()
    return jsonify({"message": "Athlet aktualisiert"})

@bp.route('/athletes/<int:id>', methods=['DELETE'])
def delete_athlete(id):
    athlete = Athlete.query.get_or_404(id)
    db.session.delete(athlete)
    db.session.commit()
    return jsonify({"message": "Athlet gelöscht"})

# RESULTS -----------------------------------------------------------------------

@bp.route('/results', methods=['POST'])
def create_result():
    data = request.json
    new_result = Result(
        athlete_id=data['athlete_id'],
        year=data['year'],
        age=data['age'],
        result=data['result']
    )
    db.session.add(new_result)
    db.session.commit()
    return jsonify({"message": "Ergebnis hinzugefügt", "id": new_result.id}), 201

@bp.route('/results', methods=['GET'])
def get_results():
    results = Result.query.all()
    return jsonify([{
        "id": result.id,
        "athlete_id": result.athlete_id,
        "year": result.year,
        "age": result.age,
        "result": result.result,
        "version": result.version,
        "created_at": result.created_at,
        "updated_at": result.updated_at
    } for result in results])

@bp.route('/results/<int:id>', methods=['PUT'])
def update_result(id):
    result = Result.query.get_or_404(id)
    data = request.json
    result.year = data.get('year', result.year)
    result.age = data.get('age', result.age)
    result.result = data.get('result', result.result)
    result.version += 1  # Neue Version erzeugen
    db.session.commit()
    return jsonify({"message": "Ergebnis aktualisiert"})

@bp.route('/results/<int:id>', methods=['DELETE'])
def delete_result(id):
    result = Result.query.get_or_404(id)
    db.session.delete(result)
    db.session.commit()
    return jsonify({"message": "Ergebnis gelöscht"})

# REGELN -----------------------------------------------------------------------

@bp.route('/regeln', methods=['POST'])
def create_regel():
    data = request.json
    new_regel = Regel(
        reglename=data['reglename'],
        beschreibung=data.get('beschreibung'),
        disziplin=data.get('disziplin'),
        strecke=data['strecke'],
        zeit_in_sekunden=data['zeit_in_sekunden'],
        punkte=data['punkte'],
        gueltig_ab=datetime.strptime(data['gueltig_ab'], '%Y-%m-%d'),
        gueltig_bis=datetime.strptime(data['gueltig_bis'], '%Y-%m-%d') if 'gueltig_bis' in data else None
    )
    db.session.add(new_regel)
    db.session.commit()
    return jsonify({"message": "Regel hinzugefügt", "id": new_regel.id}), 201

@bp.route('/regeln', methods=['GET'])
def get_regeln():
    regeln = Regel.query.all()
    return jsonify([{
        "id": regel.id,
        "reglename": regel.reglename,
        "beschreibung": regel.beschreibung,
        "disziplin": regel.disziplin,
        "strecke": regel.strecke,
        "zeit_in_sekunden": regel.zeit_in_sekunden,
        "punkte": regel.punkte,
        "gueltig_ab": regel.gueltig_ab.strftime('%Y-%m-%d'),
        "gueltig_bis": regel.gueltig_bis.strftime('%Y-%m-%d') if regel.gueltig_bis else None,
        "version": regel.version,
        "erstellt_am": regel.erstellt_am,
        "aktualisiert_am": regel.aktualisiert_am
    } for regel in regeln])

@bp.route('/regeln/<int:id>', methods=['PUT'])
def update_regel(id):
    regel = Regel.query.get_or_404(id)
    data = request.json
    regel.beschreibung = data.get('beschreibung', regel.beschreibung)
    regel.disziplin = data.get('disziplin', regel.disziplin)
    regel.strecke = data.get('strecke', regel.strecke)
    regel.zeit_in_sekunden = data.get('zeit_in_sekunden', regel.zeit_in_sekunden)
    regel.punkte = data.get('punkte', regel.punkte)
    regel.gueltig_ab = datetime.strptime(data['gueltig_ab'], '%Y-%m-%d') if 'gueltig_ab' in data else regel.gueltig_ab
    regel.gueltig_bis = datetime.strptime(data['gueltig_bis'], '%Y-%m-%d') if 'gueltig_bis' in data else regel.gueltig_bis
    regel.version += 1  # Version erhöhen
    db.session.commit()
    return jsonify({"message": "Regel aktualisiert"})

@bp.route('/regeln/<int:id>', methods=['DELETE'])
def delete_regel(id):
    regel = Regel.query.get_or_404(id)
    db.session.delete(regel)
    db.session.commit()
    return jsonify({"message": "Regel gelöscht"})