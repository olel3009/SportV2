from marshmallow import ValidationError
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialisiere Extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    # Flask-App erstellen
    app = Flask(__name__)
    
    # Konfiguration laden
    app.config.from_object('config.Config')

    # Extensions initialisieren
    db.init_app(app)
    migrate.init_app(app, db)
    
    from api.routes.athlete import bp_athlete
    from api.routes.user import bp_user
    from api.routes.trainer import bp_trainer
    from api.routes.result import bp_result
    from api.routes.rule import bp_rule
    from api.routes.group import bp_group
    from api.routes.csv import bp_csv
    
    for bp in [bp_user, bp_trainer, bp_result, bp_athlete, bp_rule, bp_group]:
        app.register_blueprint(bp)

    @app.errorhandler(ValidationError)
    def handle_validation_error(err):
        return jsonify({
            "error": "Validation Error",
            "messages": err.messages
        }), 400
    
    return app
