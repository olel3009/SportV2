from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

bp_auth = Blueprint("auth", __name__)

@bp_auth.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return current_user