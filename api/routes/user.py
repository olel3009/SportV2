from flask import Blueprint, request, jsonify
from database import db
from database.models import User
from database.schemas import UserSchema
from sqlalchemy import inspect

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
    return jsonify({"message": "User erstellt"}), 201

# READ Users
@bp_user.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        "email": user.email,
        "password": user.password,  # In einer echten App: Hashen!
        "created_at": user.created_at,
        "updated_at": user.updated_at
    } for user in users])

@bp_user.route('/users/<string:email>', methods=['GET'])
def get_user_email(email):
    user = User.query.get_or_404(email)
    schema = UserSchema()
    return jsonify(schema.dump(user))



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
    return jsonify({"message": "User aktualisiert"})

# DELETE User
@bp_user.route('/users/<string:email>', methods=['DELETE'])
def delete_user(email):
    user = User.query.get_or_404(email)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User gelöscht"})
