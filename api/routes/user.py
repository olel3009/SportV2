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

    new_user = User(
        email=valid_data["email"],
        password=valid_data["password"]
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
        "created_at": user.created_at,
        "updated_at": user.updated_at
    } for user in users])

@bp_user.route('/users/<int:id>', methods=['GET'])
def get_user_id(id):
    user = User.query.get_or_404(id)
    schema = UserSchema()
    return jsonify(schema.dump(user))

# UPDATE User
@bp_user.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.json

    if "email" in data:
        user.email = data['email']
    if "password" in data:
        user.password = data['password']  # In einer echten App: Hashen!

    db.session.commit()
    return jsonify({"message": "User aktualisiert"})

# DELETE User
@bp_user.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User gelöscht"})
