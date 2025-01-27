from flask import app

@app.route('/regeln', methods=['POST'])
def create_regel():
    data = request.json
    neue_regel = Regel(
        reglename=data['reglename'],
        beschreibung=data.get('beschreibung'),
        disziplin=data.get('disziplin'),
        strecke=data['strecke'],
        zeit_in_sekunden=data['zeit_in_sekunden'],
        punkte=data['punkte'],
        gueltig_ab=datetime.strptime(data['gueltig_ab'], '%Y-%m-%d'),
    )
    db.session.add(neue_regel)
    db.session.commit()
    return jsonify({"message": "Regel erstellt", "id": neue_regel.id}), 201

@app.route('/regeln', methods=['GET'])
def get_regeln():
    filters = request.args  # Optional: Query-Parameter für Filter
    query = Regel.query

    if 'disziplin' in filters:
        query = query.filter_by(disziplin=filters['disziplin'])
    if 'strecke' in filters:
        query = query.filter_by(strecke=int(filters['strecke']))

    regeln = query.all()
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
        "erstellt_am": regel.erstellt_am.isoformat(),
        "aktualisiert_am": regel.aktualisiert_am.isoformat()
    } for regel in regeln])

@app.route('/regeln/<int:id>', methods=['PUT'])
def update_regel(id):
    data = request.json
    regel = Regel.query.get_or_404(id)

    regel.beschreibung = data.get('beschreibung', regel.beschreibung)
    regel.disziplin = data.get('disziplin', regel.disziplin)
    regel.strecke = data.get('strecke', regel.strecke)
    regel.zeit_in_sekunden = data.get('zeit_in_sekunden', regel.zeit_in_sekunden)
    regel.punkte = data.get('punkte', regel.punkte)
    regel.gueltig_ab = datetime.strptime(data['gueltig_ab'], '%Y-%m-%d') if 'gueltig_ab' in data else regel.gueltig_ab
    regel.gueltig_bis = datetime.strptime(data['gueltig_bis'], '%Y-%m-%d') if 'gueltig_bis' in data else regel.gueltig_bis
    regel.version += 1  # Automatische Versionserhöhung

    db.session.commit()
    return jsonify({"message": "Regel aktualisiert"})

@app.route('/regeln/<int:id>', methods=['DELETE'])
def delete_regel(id):
    regel = Regel.query.get_or_404(id)
    if regel.gueltig_bis and regel.gueltig_bis < datetime.utcnow().date():
        db.session.delete(regel)
        db.session.commit()
        return jsonify({"message": "Regel gelöscht"})
    return jsonify({"error": "Regel kann nicht gelöscht werden"}), 400