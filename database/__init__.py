import os
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

    # wo die Dateien abgelegt werden
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # erlaubte Extensions
    app.config['ALLOWED_IMAGE_EXTS'] = {'png', 'jpg', 'jpeg', 'gif'}
    app.config['ALLOWED_CERT_EXTS']  = {'pdf', 'png', 'jpg', 'jpeg'}
    
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
    from api.routes.discipline import bp_discipline
    
    for bp in [bp_user, bp_trainer, bp_result, bp_athlete, bp_rule, bp_discipline]:
        app.register_blueprint(bp)

    @app.errorhandler(ValidationError)
    def handle_validation_error(err):
        return jsonify({
            "error": "Validation Error",
            "messages": err.messages
        }), 400
    
    return app
