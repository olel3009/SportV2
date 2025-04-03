from flask import Blueprint, request, jsonify
from database import db
from database.models import User
from database.schemas import UserSchema

bp_user = Blueprint('user', __name__)

@bp_user.route('/users', methods=['POST'])
def create_user():
    data = request.json
    schema = UserSchema()
    valid_data = schema.load(data)  # Falls invalid, ValidationError -> 400

    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email und Passwort sind erforderlich"}), 400

    if bool(data.get('trainer_id')) == bool(data.get('athlete_id')):  
        return jsonify({"error": "Ein User kann entweder Trainer oder Athlet sein, aber nicht beides"}), 400

    new_user = User(
        email=valid_data["email"],
        password=valid_data["password"], 
        trainer_id=valid_data.get("trainer_id"),
        athlete_id=valid_data.get("athlete_id")
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User erstellt", "id": new_user.id}), 201

# READ Users
@bp_user.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        "id": user.id,
        "email": user.email,
        "trainer_id": user.trainer_id,
        "athlete_id": user.athlete_id,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    } for user in users])

# UPDATE User
@bp_user.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.json

    if "email" in data:
        user.email = data['email']
    if "password" in data:
        user.password = data['password']  # In einer echten App: Hashen!
    if "trainer_id" in data and "athlete_id" in data:
        return jsonify({"error": "Ein User kann entweder Trainer oder Athlet sein, aber nicht beides"}), 400
    if "trainer_id" in data:
        user.trainer_id = data['trainer_id']
        user.athlete_id = None  # Sicherstellen, dass nur eine Rolle aktiv ist
    if "athlete_id" in data:
        user.athlete_id = data['athlete_id']
        user.trainer_id = None

    db.session.commit()
    return jsonify({"message": "User aktualisiert"})

# DELETE User
@bp_user.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User gelöscht"})
