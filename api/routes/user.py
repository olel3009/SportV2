from flask import Blueprint, request, jsonify
from database import db
from database.models import User
from database.schemas import UserSchema
from sqlalchemy import inspect
import logging

bp_user = Blueprint('user', __name__)

@bp_user.route('/users', methods=['POST'])
def create_user():
    
    #insp = inspect(db.engine)
    #print(insp.get_columns('http://127.0.0.1:5000/users'))
    data = request.json
    schema = UserSchema()
    valid_data = schema.load(data)  # Falls invalid, ValidationError -> 400


    new_user = User(
        email=valid_data["email"],
        password=valid_data["password"]
    )

    db.session.add(new_user)
    db.session.commit()
    logging.info("Neuer Benutzer erfolgreich erstellt!")
    return jsonify({"id": new_user.id, "message": "User erstellt"}), 201

# READ Users
@bp_user.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    logging.info("Alle Users erforlgreich aufgerufen!")
    return jsonify([{
        "id": user.id,
        "email": user.email,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    } for user in users])
    

@bp_user.route('/users/<string:email>', methods=['GET'])
def get_user_email(email):
    user = User.query.get_or_404(email)
    schema = UserSchema()
    logging.info("User-E-Mail-Adresse erforlgreich aufgerufen!")
    return jsonify(schema.dump(user))


@bp_user.route('/users/login', methods=['POST'])
def login_user():
    """
    Prüft anhand von Email und Passwort, ob ein Nutzer existiert und die Credentials stimmen.
    """
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        logging.error("E-Mail, Passwort oder beide fehlen!")
        return jsonify({"error": "Email und Passwort müssen übergeben werden"}), 400

    # User per Email laden
    user = User.query.filter_by(email=email).first()
    if user is None or user.password != password:
        logging.error("Ungültige Anmeldedaten!")
        return jsonify({"error": "Ungültige Anmeldedaten"}), 401

    # Login erfolgreich
    logging.info("Login erfolgreich!")
    return jsonify({
        "message": "Login erfolgreich",
        "email": user.email
    }), 200


# UPDATE User
@bp_user.route('/users/<string:email>', methods=['PUT'])
def update_user(email):
    user = User.query.get_or_404(email)
    data = request.json

    if "email" in data:
        user.email = data['email']
    if "password" in data:
        user.password = data['password']  # In einer echten App: Hashen!

    db.session.commit()
    logging.info("User erfolgreich aktualisiert!")
    return jsonify({"message": "User aktualisiert"})

# DELETE User
@bp_user.route('/users/<string:email>', methods=['DELETE'])
def delete_user(email):
    user = User.query.get_or_404(email)
    db.session.delete(user)
    db.session.commit()
    logging.info("User erfolgreich gelöscht!")
    return jsonify({"message": "User gelöscht"})
