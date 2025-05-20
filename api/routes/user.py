from flask import Blueprint, request, jsonify
from database import db
from database.models import User
from database.schemas import UserSchema
from sqlalchemy import inspect
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
    )
from passlib.hash import pbkdf2_sha256

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
    return jsonify({"id": new_user.id, "message": "User erstellt"}), 201

# READ Users
@bp_user.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
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
    return jsonify(schema.dump(user))


@bp_user.route('/users/login', methods=['POST'])
def login_user():
    """
    Prüft anhand von Email und Passwort, ob ein Nutzer existiert und die Credentials stimmen.
    """
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    access_token = create_access_token(identity=email)

    #if not email or not password:
    #    return jsonify({"error": "Email und Passwort müssen übergeben werden"}), 400
#
    ## User per Email laden
    user = User.query.filter_by(email=email).first()
    #if user is None or user.password != password:
    #    return jsonify({"error": "Ungültige Anmeldedaten"}), 401

    # Login erfolgreich
    return jsonify({
        "message": "Login erfolgreich",
        #user.email = variable
        "email": "user.email",
        "access_token": access_token
    }), 200


# UPDATE User
@bp_user.route('/users/<string:email>', methods=['PUT'])
@jwt_required()
def update_user(email):
    current_user = get_jwt_identity()
    user = User.query.get_or_404(email)
    data = request.json

    if "email" in data:
        user.email = data['email']
    if "password" in data:
        user.password = data['password']  # In einer echten App: Hashen!

    db.session.commit()
    return jsonify({"message": "User aktualisiert"})

# DELETE User
@bp_user.route('/users/<string:email>', methods=['DELETE'])
@jwt_required()
def delete_user(email):
    current_user = get_jwt_identity()
    user = User.query.get_or_404(email)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User gelöscht"})
